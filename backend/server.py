from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form, Header
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from dotenv import load_dotenv

# Load env vars at the very beginning
load_dotenv(dotenv_path=Path(__file__).parent / ".env", override=True)

from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import base64
import io
import re
from PIL import Image
import numpy as np
from deepface import DeepFace
from sklearn.ensemble import IsolationForest
import json
mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017")
db_name = os.getenv("DB_NAME", "smartballot")

print(f"OK: Using MongoDB URL: {mongo_url}")
print(f"OK: Using Database: {db_name}")

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

app = FastAPI()
api_router = APIRouter(prefix="/api")

JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = int(os.environ.get("JWT_EXPIRATION", 24))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class UserRegister(BaseModel):
    name: str
    aadhaar: str
    email: EmailStr
    password: str
    face_image: Optional[str] = None  # Base64 encoded, optional

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    face_image: Optional[str] = None

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class ElectionCreate(BaseModel):
    title: str
    description: str
    start_date: datetime
    end_date: datetime

class CandidateCreate(BaseModel):
    name: str
    party: str
    election_id: str
    image_url: Optional[str] = None

class VoteSubmit(BaseModel):
    election_id: str
    candidate_id: str
    face_image: Optional[str] = None # Optional

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    aadhaar: str
    email: str
    face_embedding: List[float]
    status: str = "active"
    voted: bool = False
    voted_elections: List[str] = []
    created_at: str

class Election(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    description: str
    start_date: str
    end_date: str
    status: str
    created_at: str

class Candidate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    party: str
    election_id: str
    image_url: Optional[str] = None
    vote_count: int = 0

class Vote(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    election_id: str
    candidate_id: str
    timestamp: str

# ==================== UTILITIES ====================

def validate_aadhaar(aadhaar: str) -> bool:
    """Validate Aadhaar format (12 digits)"""
    pattern = r'^\d{12}$'
    return bool(re.match(pattern, aadhaar))

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, email: str, role: str = 'user') -> str:
    """Create JWT token"""
    payload = {
        'user_id': user_id,
        'email': email,
        'role': role,
        'exp': datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> Dict[str, Any]:
    """Decode JWT token"""
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def base64_to_image(base64_str: str) -> Optional[np.ndarray]:
    """Convert base64 string to image array"""
    try:
        if not base64_str:
            return None
            
        # Remove header if present
        if ',' in base64_str:
            base64_str = base64_str.split(',')[1]
            
        if not base64_str:
            return None
        
        # Add padding if necessary
        missing_padding = len(base64_str) % 4
        if missing_padding:
            base64_str += '=' * (4 - missing_padding)
            
        img_data = base64.b64decode(base64_str)
        img = Image.open(io.BytesIO(img_data))
        img = img.convert('RGB')
        return np.array(img)
    except Exception as e:
        error_msg = str(e)
        logger.error(f"ERROR: Error converting base64 to image: {error_msg}")
        # Log the first 50 characters of base64_str for debugging
        if base64_str:
            logger.info(f"Base64 prefix: {base64_str[:50]}... (Length: {len(base64_str)})")
        else:
            logger.info("Base64 string is empty or None")
        raise HTTPException(status_code=400, detail=f"Invalid image data: {error_msg}")

def extract_face_embedding(image_array: np.ndarray) -> List[float]:
    """Extract face embedding using DeepFace"""
    try:
        embedding_objs = DeepFace.represent(
            img_path=image_array,
            model_name='Facenet',
            enforce_detection=True
        )
        return embedding_objs[0]['embedding']
    except Exception as e:
        logger.error(f"Error extracting face embedding: {e}")
        raise HTTPException(status_code=400, detail="Could not detect face in image")

def compare_faces(embedding1: List[float], embedding2: List[float], threshold: float = 0.6) -> bool:
    """Compare two face embeddings"""
    try:
        # Calculate Euclidean distance
        distance = np.linalg.norm(np.array(embedding1) - np.array(embedding2))
        logger.info(f"Face comparison distance: {distance}")
        return distance < threshold
    except Exception as e:
        logger.error(f"Error comparing faces: {e}")
        return False

def mock_send_email(to_email: str, subject: str, body: str):
    """Mock email sending - logs to console"""
    logger.info(f"\n{'='*50}\nMOCK EMAIL\nTo: {to_email}\nSubject: {subject}\nBody: {body}\n{'='*50}\n")

async def detect_fraud():
    """Detect fraudulent activities using Isolation Forest"""
    try:
        # Get all votes
        votes = await db.votes.find({}, {"_id": 0}).to_list(1000)
        
        if len(votes) < 10:
            return []
        
        # Create feature matrix (simplified)
        features = []
        for vote in votes:
            vote_time = datetime.fromisoformat(vote['timestamp'])
            features.append([
                hash(vote['user_id']) % 1000,
                vote_time.hour,
                vote_time.minute
            ])
        
        # Train Isolation Forest
        clf = IsolationForest(contamination=0.1, random_state=42)
        predictions = clf.fit_predict(features)
        
        # Get anomalies
        anomalies = []
        for i, pred in enumerate(predictions):
            if pred == -1:
                anomalies.append(votes[i])
        
        return anomalies
    except Exception as e:
        logger.error(f"Error in fraud detection: {e}")
        return []

# ==================== AUTH ENDPOINTS ====================

@api_router.post("/auth/register")
async def register_user(data: UserRegister):
    try:
        logger.info(f"Registration attempt for: {data.email}")
        
        # Validate Aadhaar
        if not validate_aadhaar(data.aadhaar):
            logger.warning(f"Invalid Aadhaar format: {data.aadhaar}")
            raise HTTPException(status_code=400, detail="Invalid Aadhaar format. Must be 12 digits.")
        
        # Check if user exists
        existing_user = await db.users.find_one({"email": data.email}, {"_id": 0})
        if existing_user:
            logger.warning(f"Email already registered: {data.email}")
            raise HTTPException(status_code=400, detail="Email already registered")
        
        existing_aadhaar = await db.users.find_one({"aadhaar": data.aadhaar}, {"_id": 0})
        if existing_aadhaar:
            logger.warning(f"Aadhaar already registered: {data.aadhaar}")
            raise HTTPException(status_code=400, detail="Aadhaar already registered")
        
        # Extract face embedding (if valid image provided)
        face_embedding = []
        if data.face_image and len(data.face_image.strip()) > 20: 
            logger.info(f"Extracting face embedding from image (length: {len(data.face_image)})...")
            try:
                image_array = base64_to_image(data.face_image)
                if image_array is not None:
                    face_embedding = extract_face_embedding(image_array)
                    logger.info("Face embedding extracted successfully")
                else:
                    logger.warning("base64_to_image returned None, skipping embedding")
            except Exception as e:
                logger.error(f"Failed to extract face embedding: {e}")
                # If they provided an image but it's invalid, we should probably warn them
                # but if they didn't really provide one (just a stub), we skip
                if len(data.face_image) > 100:
                    raise HTTPException(status_code=400, detail=f"Face registration failed: {str(e)}")
                else:
                    logger.warning("Ignoring invalid short face_image string")
        else:
            logger.info("No valid face image provided (or too short), skipping embedding")
        
        # Create user
        user_id = str(uuid.uuid4())
        hashed_pwd = hash_password(data.password)
        
        user_doc = {
            "id": user_id,
            "name": data.name,
            "aadhaar": data.aadhaar,
            "email": data.email,
            "password_hash": hashed_pwd,
            "face_embedding": face_embedding,
            "status": "active",
            "voted": False,
            "voted_elections": [],
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.users.insert_one(user_doc)
        logger.info(f"User registered successfully: {data.email}")
        
        # Mock email
        mock_send_email(
            data.email,
            "Registration Successful",
            f"Welcome {data.name}! Your voter account has been created successfully."
        )
        
        token = create_token(user_id, data.email, 'user')
        
        return {
            "success": True,
            "message": "Registration successful",
            "token": token,
            "user": {
                "id": user_id,
                "name": data.name,
                "email": data.email
            }
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/auth/login")
async def login_user(data: UserLogin):
    try:
        logger.info(f"Login attempt for: {data.email}")
        user = await db.users.find_one({"email": data.email}, {"_id": 0})
        if not user:
            logger.warning(f"User not found: {data.email}")
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        if not verify_password(data.password, user['password_hash']):
            logger.warning(f"Invalid password for: {data.email}")
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Face verification if provided (optional for login)
        if data.face_image:
            try:
                image_array = base64_to_image(data.face_image)
                if image_array is not None:
                    current_embedding = extract_face_embedding(image_array)
                    
                    if not compare_faces(user['face_embedding'], current_embedding):
                        logger.warning(f"Face verification failed for: {data.email}")
                        raise HTTPException(status_code=401, detail="Face verification failed. Please try again.")
                    logger.info(f"Face verification successful for: {data.email}")
                else:
                    logger.warning(f"Empty/Invalid face image provided for login: {data.email}")
            except HTTPException as e:
                raise e
            except Exception as e:
                logger.error(f"Face verification error: {e}")
                raise HTTPException(status_code=401, detail="Face verification failed. Please try again.")
        
        token = create_token(user['id'], user['email'], 'user')
        logger.info(f"Login successful for: {data.email}")
        
        return {
            "success": True,
            "token": token,
            "user": {
                "id": user['id'],
                "name": user['name'],
                "email": user['email'],
                "voted": user.get('voted', False)
            }
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/auth/admin/login")
async def admin_login(data: AdminLogin):
    try:
        logger.info(f"Admin login attempt for: {data.email}")
        admin = await db.admins.find_one({"email": data.email}, {"_id": 0})
        if not admin:
            logger.warning(f"Admin not found: {data.email}")
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        if not verify_password(data.password, admin['password_hash']):
            logger.warning(f"Invalid password for admin: {data.email}")
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        token = create_token(admin['id'], admin['email'], 'admin')
        logger.info(f"Admin login successful for: {data.email}")
        
        return {
            "success": True,
            "token": token,
            "admin": {
                "id": admin['id'],
                "email": admin['email'],
                "name": admin.get('name', 'Admin')
            }
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Admin login error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== VOTING ENDPOINTS ====================

@api_router.get("/elections/active")
async def get_active_elections():
    try:
        current_time = datetime.now(timezone.utc).isoformat()
        elections = await db.elections.find(
            {"status": "active"},
            {"_id": 0}
        ).to_list(100)
        return {"elections": elections}
    except Exception as e:
        logger.error(f"Error fetching elections: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/elections/{election_id}/candidates")
async def get_candidates(election_id: str):
    try:
        candidates = await db.candidates.find(
            {"election_id": election_id},
            {"_id": 0}
        ).to_list(100)
        return {"candidates": candidates}
    except Exception as e:
        logger.error(f"Error fetching candidates: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/vote")
async def submit_vote(data: VoteSubmit, authorization: str = Header(None)):
    try:
        if not authorization or not authorization.startswith('Bearer '):
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        token = authorization.split(' ')[1]
        payload = decode_token(token)
        user_id = payload['user_id']
        
        # Get user
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Check user eligibility (NEW)
        if user.get("status") != "active":
            raise HTTPException(
                status_code=403,
                detail="User not eligible to vote"
            )
            
        # ---------- FIX 1: Check election exists ----------
        election = await db.elections.find_one({"id": data.election_id})
        if not election:
            raise HTTPException(status_code=404, detail="Election not found")

        # ---------- NEW: Check election active ----------
        if election.get("status") != "active":
            raise HTTPException(
                status_code=400,
                detail="Election is not active"
            )

        # ---------- NEW: Check election time window ----------
        now = datetime.now(timezone.utc)

        start = datetime.fromisoformat(election["start_date"]).replace(tzinfo=timezone.utc)
        end = datetime.fromisoformat(election["end_date"]).replace(tzinfo=timezone.utc)


        if now < start:
            raise HTTPException(400, "Election not started")

        if now > end:
            raise HTTPException(400, "Election ended")

        # ---------- FIX 2: Check candidate belongs to election ----------
        candidate = await db.candidates.find_one({
            "id": data.candidate_id,
            "election_id": data.election_id
        })

        if not candidate:
            raise HTTPException(
                status_code=400,
                detail="Invalid candidate for this election"
            )

        # Face verification (Skip if user has no stored face OR if no image provided)
        if user.get('face_embedding') and data.face_image:
            image_array = base64_to_image(data.face_image)
            if image_array is not None:
                current_embedding = extract_face_embedding(image_array)
                if not compare_faces(user['face_embedding'], current_embedding):
                    raise HTTPException(status_code=401, detail="Face verification failed. Please try again.")
            else:
                logger.warning("Empty face image provided in vote, skipping verification")
        else:
            logger.info("Skipping face verification for this vote (Biometrics optional)")
        
        # Record vote
        vote_id = str(uuid.uuid4())
        vote_doc = {
            "id": vote_id,
            "user_id": user_id,
            "election_id": data.election_id,
            "candidate_id": data.candidate_id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        # Update user voted status with atomic check-and-set to prevent double voting
        result = await db.users.update_one(
            {
                "id": user_id,
                "voted_elections": {"$ne": data.election_id}
            },
            {
                "$set": {"voted": True},
                "$push": {"voted_elections": data.election_id}
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="You have already voted in this election")
        
        await db.votes.insert_one(vote_doc)
        
        # Update candidate vote count
        await db.candidates.update_one(
            {"id": data.candidate_id},
            {"$inc": {"vote_count": 1}}
        )
        
        return {
            "success": True,
            "message": "Vote recorded successfully"
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Vote submission error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/vote/status/{election_id}")
async def check_vote_status(election_id: str, authorization: str = Header(None)):
    try:
        if not authorization or not authorization.startswith('Bearer '):
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        token = authorization.split(' ')[1]
        payload = decode_token(token)
        user_id = payload['user_id']
        
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        has_voted = election_id in user.get('voted_elections', [])
        
        return {
            "has_voted": has_voted
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error checking vote status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== ADMIN ENDPOINTS ====================

@api_router.post("/admin/elections")
async def create_election(data: ElectionCreate, authorization: str = Header(None)):
    try:
        if not authorization or not authorization.startswith('Bearer '):
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        token = authorization.split(' ')[1]
        payload = decode_token(token)
        
        if payload.get('role') != 'admin':
            raise HTTPException(status_code=403, detail="Admin access required")
        
        election_id = str(uuid.uuid4())
        election_doc = {
            "id": election_id,
            "title": data.title,
            "description": data.description,
            "start_date": data.start_date.isoformat(),
            "end_date": data.end_date.isoformat(),
            "status": "active",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.elections.insert_one(election_doc)
        
        return {
            "success": True,
            "message": "Election created successfully",
            "election_id": election_id
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error creating election: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/admin/elections")
async def get_all_elections(authorization: str = Header(None)):
    try:
        if not authorization or not authorization.startswith('Bearer '):
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        token = authorization.split(' ')[1]
        payload = decode_token(token)
        
        if payload.get('role') != 'admin':
            raise HTTPException(status_code=403, detail="Admin access required")
        
        elections = await db.elections.find({}, {"_id": 0}).to_list(100)
        return {"elections": elections}
    except Exception as e:
        logger.error(f"Error fetching elections: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/admin/candidates")
async def create_candidate(data: CandidateCreate, authorization: str = Header(None)):
    try:
        if not authorization or not authorization.startswith('Bearer '):
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        token = authorization.split(' ')[1]
        payload = decode_token(token)
        
        if payload.get('role') != 'admin':
            raise HTTPException(status_code=403, detail="Admin access required")
        
        candidate_id = str(uuid.uuid4())
        candidate_doc = {
            "id": candidate_id,
            "name": data.name,
            "party": data.party,
            "election_id": data.election_id,
            "image_url": data.image_url or "https://images.unsplash.com/photo-1659355894117-0ae6f8f28d0b",
            "vote_count": 0
        }
        
        await db.candidates.insert_one(candidate_doc)
        
        return {
            "success": True,
            "message": "Candidate added successfully",
            "candidate_id": candidate_id
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error creating candidate: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/admin/candidates/{candidate_id}")
async def delete_candidate(candidate_id: str, authorization: str = Header(None)):
    try:
        if not authorization or not authorization.startswith('Bearer '):
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        token = authorization.split(' ')[1]
        payload = decode_token(token)
        
        if payload.get('role') != 'admin':
            raise HTTPException(status_code=403, detail="Admin access required")
        
        result = await db.candidates.delete_one({"id": candidate_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Candidate not found")
        
        return {
            "success": True,
            "message": "Candidate deleted successfully"
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error deleting candidate: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/admin/voters")
async def get_all_voters(authorization: str = Header(None)):
    try:
        if not authorization or not authorization.startswith('Bearer '):
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        token = authorization.split(' ')[1]
        payload = decode_token(token)
        
        if payload.get('role') != 'admin':
            raise HTTPException(status_code=403, detail="Admin access required")
        
        voters = await db.users.find(
            {},
            {"_id": 0, "password_hash": 0, "face_embedding": 0}
        ).to_list(1000)
        
        return {"voters": voters}
    except Exception as e:
        logger.error(f"Error fetching voters: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/admin/results/{election_id}")
async def get_election_results(election_id: str, authorization: str = Header(None)):
    try:
        if not authorization or not authorization.startswith('Bearer '):
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        token = authorization.split(' ')[1]
        payload = decode_token(token)
        
        if payload.get('role') != 'admin':
            raise HTTPException(status_code=403, detail="Admin access required")
        
        candidates = await db.candidates.find(
            {"election_id": election_id},
            {"_id": 0}
        ).sort("vote_count", -1).to_list(100)
        
        total_votes = sum(c.get('vote_count', 0) for c in candidates)
        
        return {
            "candidates": candidates,
            "total_votes": total_votes
        }
    except Exception as e:
        logger.error(f"Error fetching results: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/admin/fraud/detect")
async def detect_fraud_activity(authorization: str = Header(None)):
    try:
        if not authorization or not authorization.startswith('Bearer '):
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        token = authorization.split(' ')[1]
        payload = decode_token(token)
        
        if payload.get('role') != 'admin':
            raise HTTPException(status_code=403, detail="Admin access required")
        
        anomalies = await detect_fraud()
        
        return {
            "suspicious_votes": anomalies,
            "count": len(anomalies)
        }
    except Exception as e:
        logger.error(f"Error in fraud detection: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/admin/stats")
async def get_admin_stats(authorization: str = Header(None)):
    try:
        if not authorization or not authorization.startswith('Bearer '):
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        token = authorization.split(' ')[1]
        payload = decode_token(token)
        
        if payload.get('role') != 'admin':
            raise HTTPException(status_code=403, detail="Admin access required")
        
        total_users = await db.users.count_documents({})
        total_elections = await db.elections.count_documents({})
        active_elections = await db.elections.count_documents({"status": "active"})
        total_votes = await db.votes.count_documents({})
        
        return {
            "total_users": total_users,
            "total_elections": total_elections,
            "active_elections": active_elections,
            "total_votes": total_votes
        }
    except Exception as e:
        logger.error(f"Error fetching stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== INITIALIZATION ====================

@api_router.post("/init")
async def initialize_system():
    """Initialize system with default admin and sample data"""
    try:
        # Create default admin
        admin_exists = await db.admins.find_one({"email": "admin@voting.gov.in"})
        if not admin_exists:
            admin_doc = {
                "id": str(uuid.uuid4()),
                "email": "admin@voting.gov.in",
                "password_hash": hash_password("admin123"),
                "name": "System Administrator",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            await db.admins.insert_one(admin_doc)
            logger.info("Default admin created: admin@voting.gov.in / admin123")
        
        return {
            "success": True,
            "message": "System initialized",
            "admin_credentials": {
                "email": "admin@voting.gov.in",
                "password": "admin123"
            }
        }
    except Exception as e:
        logger.error(f"Initialization error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/")
async def root():
    return {"message": "AI-Enhanced Digital Voting System API"}

app.include_router(api_router)

@app.on_event("startup")
async def startup_db_client():
    """Check MongoDB connection, create default admin, and warn about security"""
    try:
        # Test MongoDB connection
        await client.admin.command('ping')
        logger.info("OK: MongoDB connected successfully")
        
        # Auto-create default admin if not exists
        admin_exists = await db.admins.find_one({"email": "admin@voting.gov.in"})
        if not admin_exists:
            admin_doc = {
                "id": str(uuid.uuid4()),
                "email": "admin@voting.gov.in",
                "password_hash": hash_password("admin123"),
                "name": "System Administrator",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            await db.admins.insert_one(admin_doc)
            logger.info("OK: Default admin created: admin@voting.gov.in / admin123")
        else:
            logger.info("OK: Admin account exists")
            
    except Exception as e:
        logger.error(f"ERROR: MongoDB connection failed: {e}")
        logger.error("Please ensure MongoDB is running on mongodb://localhost:27017")
    
    # Security warning
    if JWT_SECRET == 'your-secret-key-change-in-production':
        logger.warning("WARNING: Using default JWT_SECRET! Change it in .env file for production!")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
