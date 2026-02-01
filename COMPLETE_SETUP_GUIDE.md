# 🗳️ SmartBallot - AI Enhanced Voting System
## Complete Setup & Deployment Guide

---

## 📋 Table of Contents
1. [System Requirements](#system-requirements)
2. [Prerequisites Installation](#prerequisites-installation)
3. [Project Setup](#project-setup)
4. [Running the Application](#running-the-application)
5. [Testing & Verification](#testing--verification)
6. [Troubleshooting](#troubleshooting)
7. [Project Architecture](#project-architecture)
8. [Default Credentials](#default-credentials)

---

## 🖥️ System Requirements

### Minimum Hardware Requirements
- **Processor**: Intel Core i5 or AMD Ryzen 5 (or equivalent)
- **RAM**: 8 GB minimum (16 GB recommended)
- **Storage**: 5 GB free disk space
- **Internet**: Stable internet connection for initial setup
- **Webcam**: Required for face authentication feature

### Operating System
- **Windows**: Windows 10/11 (64-bit)
- **macOS**: macOS 10.15 or later
- **Linux**: Ubuntu 20.04+ or equivalent

---

## 📦 Prerequisites Installation

### Step 1: Install Python 3.8+

#### Windows:
1. Download Python from: https://www.python.org/downloads/
2. **Important**: During installation, check "Add Python to PATH"
3. Verify installation:
   ```cmd
   python --version
   ```
   Should show: `Python 3.8.x` or higher

#### macOS:
```bash
brew install python@3.11
python3 --version
```

#### Linux:
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
python3 --version
```

---

### Step 2: Install Node.js 16+

#### Windows:
1. Download from: https://nodejs.org/
2. Install the LTS version (Long Term Support)
3. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

#### macOS:
```bash
brew install node
node --version
npm --version
```

#### Linux:
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version
```

---

### Step 3: Install MongoDB

#### Option A: MongoDB Community Edition (Recommended)

**Windows:**
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a Windows Service (check the option)
5. Install MongoDB Compass (optional GUI tool)
6. Verify MongoDB is running:
   ```cmd
   net start MongoDB
   ```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Option B: MongoDB with Docker (Alternative)

If you have Docker installed:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Verify MongoDB Installation:
```cmd
# Check if MongoDB is running on port 27017
netstat -ano | findstr 27017
```

---

## 🚀 Project Setup

### Step 1: Download/Clone the Project

If you received the project as a ZIP file:
1. Extract the ZIP file to a location like `C:\Projects\` or `D:\Projects\`
2. Open PowerShell or Command Prompt
3. Navigate to the project folder:
   ```cmd
   cd D:\Acadamic_Projects\AI-Enchanced-Voting-System
   ```

If cloning from Git:
```bash
git clone <repository-url>
cd AI-Enchanced-Voting-System
```

---

### Step 2: Run First-Time Setup

This automated script will:
- ✅ Verify all prerequisites (Python, Node.js, MongoDB)
- ✅ Create Python virtual environment
- ✅ Install 170+ Python packages (AI/ML libraries)
- ✅ Install 1400+ Node.js packages (React frontend)
- ✅ Generate configuration files (.env)
- ✅ Create JWT secret keys

#### Windows (PowerShell):
```powershell
.\setup.ps1
```

#### If you get execution policy error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup.ps1
```

**⏱️ Expected Time**: 10-15 minutes (depends on internet speed)

**What happens during setup:**

```
[STEP 1/6] Checking prerequisites...
[OK] Python 3.11.x
[OK] Node v18.x.x
[OK] npm detected

[STEP 2/6] Checking MongoDB...
[OK] MongoDB detected on port 27017

[STEP 3/6] Virtual environment...
[OK] venv created

[STEP 4/6] Installing backend deps...
Installing 170+ packages (TensorFlow, DeepFace, FastAPI, etc.)
[OK] Backend ready

[STEP 5/6] Installing frontend deps...
Installing 1400+ packages (React, TailwindCSS, etc.)
[OK] Frontend ready

[STEP 6/6] Creating config...
✓ Backend .env created
✓ Frontend .env created

=========================================
        Setup Complete!
=========================================

Default Admin:
admin@voting.gov.in / admin123

Start app using:
start.ps1
```

---

## ▶️ Running the Application

### Start All Services (Recommended)

```powershell
.\start.ps1
```

This command will:
1. ✅ Check MongoDB status
2. ✅ Start Backend API (port 8000)
3. ✅ Start Frontend UI (port 3000)
4. ✅ Open browser automatically

**Expected Output:**
```
=========================================
   SmartBallot - Startup Script
=========================================

[MONGODB] Checking MongoDB...
[OK] MongoDB detected on port 27017

[BACKEND] Starting API...
[INFO] Launching backend (30-60s first time)...

[FRONTEND] Starting UI...
[INFO] Launching frontend...

=========================================
Access URLs
=========================================
Frontend: http://localhost:3000
Backend : http://localhost:8000
Docs    : http://localhost:8000/docs

Admin Login:
admin@voting.gov.in / admin123
=========================================
```

---

### Other Start Commands

```powershell
# Check service status
.\start.ps1 status

# Start backend only
.\start.ps1 backend

# Start frontend only
.\start.ps1 frontend

# Stop all services
.\start.ps1 stop
```

---

## 🌐 Access Points

Once the application is running:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main user interface |
| **Backend API** | http://localhost:8000 | REST API server |
| **API Documentation** | http://localhost:8000/docs | Interactive API docs (Swagger) |
| **Admin Dashboard** | http://localhost:3000/admin/login | Admin panel |
| **Voter Registration** | http://localhost:3000/register | New voter signup |
| **Voting Portal** | http://localhost:3000/vote | Cast your vote |

---

## 👤 Default Credentials

### Admin Account
The admin account is automatically created on first backend startup.

```
Email: admin@voting.gov.in
Password: admin123
```

**⚠️ IMPORTANT**: Change the admin password immediately after first login!

### Test Voter Accounts
You can create test voter accounts through the registration page:
- Navigate to: http://localhost:3000/register
- Fill in the registration form
- Use face authentication (optional)

---

## ✅ Testing & Verification

### 1. Verify Backend is Running

Open browser: http://localhost:8000/docs

You should see the FastAPI Swagger documentation with all API endpoints.

### 2. Test API Health Check

```bash
curl http://localhost:8000/
```

Expected response:
```json
{
  "message": "SmartBallot API is running",
  "version": "1.0.0"
}
```

### 3. Verify Frontend is Running

Open browser: http://localhost:3000

You should see the SmartBallot homepage.

### 4. Test Admin Login

1. Go to: http://localhost:3000/admin/login
2. Enter credentials:
   - Email: `admin@voting.gov.in`
   - Password: `admin123`
3. You should be redirected to the admin dashboard

### 5. Test Voter Registration

1. Go to: http://localhost:3000/register
2. Fill in the registration form
3. Test face authentication (if webcam available)
4. Submit registration

### 6. Run Automated Tests (Optional)

```bash
# Backend tests
cd backend
..\\.venv\Scripts\python.exe -m pytest

# Frontend tests
cd frontend
npm test
```

---

## 🔧 Troubleshooting

### Issue 1: MongoDB Not Running

**Symptoms:**
```
[WARN] MongoDB not detected on port 27017
```

**Solutions:**

**Windows:**
```cmd
# Start MongoDB service
net start MongoDB

# Or using services.msc
services.msc
# Find "MongoDB" service and start it
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

**Docker:**
```bash
docker start mongodb
# Or create new container
docker run -d -p 27017:27017 --name mongodb mongo
```

---

### Issue 2: Backend Takes Long to Start

**Symptoms:**
- Backend startup takes 30-60 seconds

**Explanation:**
This is normal! The backend loads heavy AI/ML models:
- DeepFace (face recognition)
- TensorFlow models
- Isolation Forest (fraud detection)

**First startup is always slower**. Subsequent starts are faster.

---

### Issue 3: Port Already in Use

**Symptoms:**
```
Error: Port 3000 is already in use
Error: Port 8000 is already in use
```

**Solutions:**

**Windows:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use the stop command
.\start.ps1 stop
```

**macOS/Linux:**
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Find and kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

---

### Issue 4: Python Virtual Environment Not Found

**Symptoms:**
```
[ERROR] Virtual environment missing.
```

**Solution:**
```powershell
# Re-run setup
.\setup.ps1
```

---

### Issue 5: Node Modules Missing

**Symptoms:**
```
[ERROR] node_modules missing.
```

**Solution:**
```powershell
cd frontend
npm install --legacy-peer-deps
cd ..
```

---

### Issue 6: Face Authentication Not Working

**Symptoms:**
- Camera not detected
- Face recognition fails

**Solutions:**

1. **Check camera permissions:**
   - Windows: Settings → Privacy → Camera
   - macOS: System Preferences → Security & Privacy → Camera
   - Browser: Allow camera access when prompted

2. **Test camera:**
   - Open browser console (F12)
   - Check for camera errors

3. **Fallback option:**
   - Face authentication is optional
   - You can register/login without it

---

### Issue 7: Database Reset

If you need to reset the database:

**Option A: Reset Everything**
```powershell
python reset_database.py
```

**Option B: Reset but Keep Admin**
```powershell
.\reset_database_keep_admin.ps1
```

---

## 🏗️ Project Architecture

### Directory Structure

```
AI-Enchanced-Voting-System/
├── backend/                    # Python FastAPI backend
│   ├── server.py              # Main API server
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Backend configuration
│   └── captured_images/       # Face authentication images
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── pages/            # React pages
│   │   ├── components/       # Reusable components
│   │   └── App.js            # Main app component
│   ├── package.json          # Node.js dependencies
│   └── .env                  # Frontend configuration
│
├── .venv/                     # Python virtual environment
├── setup.ps1                  # First-time setup script
├── start.ps1                  # Application startup script
├── reset_database.py          # Database reset utility
└── README.md                  # Quick reference guide
```

---

### Technology Stack

#### Backend (Python)
- **Framework**: FastAPI (high-performance async API)
- **Database**: MongoDB (NoSQL document database)
- **Authentication**: JWT (JSON Web Tokens)
- **AI/ML Libraries**:
  - DeepFace (face recognition)
  - TensorFlow (deep learning)
  - scikit-learn (fraud detection)
  - OpenCV (image processing)
- **Security**: bcrypt (password hashing), python-jose (JWT)

#### Frontend (React)
- **Framework**: React 19
- **UI Library**: Radix UI + TailwindCSS
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod validation
- **Charts**: Recharts

#### Database
- **MongoDB**: Document-based NoSQL database
- **Collections**:
  - `users` - Voter accounts
  - `admins` - Admin accounts
  - `candidates` - Election candidates
  - `votes` - Cast votes (encrypted)
  - `elections` - Election configurations

---

### Key Features

✅ **Aadhaar-based Registration**
- 12-digit Aadhaar validation
- Duplicate prevention

✅ **AI Face Authentication**
- DeepFace integration
- Optional biometric verification
- Privacy-focused (images stored locally)

✅ **Multi-Factor Authentication**
- Password + OTP
- Optional face recognition
- JWT token-based sessions

✅ **ML Fraud Detection**
- Isolation Forest algorithm
- Real-time anomaly detection
- Suspicious activity flagging

✅ **Accessibility**
- Text-to-speech support
- Keyboard navigation
- High contrast mode

✅ **Real-time Analytics**
- Live vote counting
- Turnout statistics
- Demographic insights

✅ **Admin Dashboard**
- Election management
- Candidate management
- Voter verification
- Results visualization

---

## 🔐 Security Features

1. **Password Security**
   - bcrypt hashing (cost factor: 12)
   - Minimum 8 characters
   - No plain-text storage

2. **JWT Authentication**
   - 30-minute token expiration
   - Secure HTTP-only cookies
   - HMAC-SHA256 signing

3. **Database Security**
   - Vote encryption
   - Voter anonymity
   - Audit logging

4. **API Security**
   - CORS protection
   - Rate limiting
   - Input validation

5. **Face Data Privacy**
   - Local storage only
   - No cloud upload
   - Encrypted storage

---

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  aadhaar: String (12 digits, unique),
  name: String,
  email: String (unique),
  phone: String,
  password: String (bcrypt hashed),
  face_encoding: Array (optional),
  has_voted: Boolean,
  created_at: DateTime
}
```

### Admins Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (bcrypt hashed),
  name: String,
  role: String ("admin"),
  created_at: DateTime
}
```

### Candidates Collection
```javascript
{
  _id: ObjectId,
  name: String,
  party: String,
  symbol: String,
  description: String,
  image_url: String,
  election_id: ObjectId
}
```

### Votes Collection
```javascript
{
  _id: ObjectId,
  voter_id: ObjectId (encrypted),
  candidate_id: ObjectId,
  election_id: ObjectId,
  timestamp: DateTime,
  ip_address: String (hashed),
  fraud_score: Float
}
```

---

## 🔄 Workflow

### Voter Registration Flow
1. User visits `/register`
2. Fills Aadhaar, name, email, phone, password
3. Optional: Face capture for biometric auth
4. System validates Aadhaar uniqueness
5. Password hashed with bcrypt
6. Account created in database
7. Redirect to login

### Voting Flow
1. User logs in with email + password
2. Optional: Face verification
3. JWT token issued (30 min validity)
4. User selects candidate
5. Vote recorded with fraud score
6. User marked as "has_voted"
7. Confirmation displayed

### Admin Flow
1. Admin logs in
2. Access dashboard
3. Manage elections, candidates
4. View real-time results
5. Export reports

---

## 🌍 Deployment to Production

### Environment Variables

**Backend (.env)**
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=smartballot
JWT_SECRET=<auto-generated-secret>
JWT_ALGORITHM=HS256
JWT_EXPIRATION=30
```

**Frontend (.env)**
```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

### Production Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret (auto-generated)
- [ ] Enable HTTPS/SSL
- [ ] Configure MongoDB authentication
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Set up monitoring/logging
- [ ] Use environment-specific configs
- [ ] Disable debug mode

---

## 📞 Support & Contact

### Common Questions

**Q: Can I run this on a different port?**
A: Yes, edit the port numbers in `start.ps1` and `.env` files.

**Q: How do I add more admins?**
A: Use the admin dashboard or MongoDB directly.

**Q: Can I use a cloud MongoDB?**
A: Yes, update `MONGO_URL` in `backend/.env` to your MongoDB Atlas connection string.

**Q: How do I backup the database?**
```bash
mongodump --db smartballot --out ./backup
```

**Q: How do I restore the database?**
```bash
mongorestore --db smartballot ./backup/smartballot
```

---

## 📝 License & Credits

This project is an academic implementation of an AI-enhanced voting system.

**Technologies Used:**
- FastAPI
- React
- MongoDB
- DeepFace
- TensorFlow
- TailwindCSS

---

## 🎯 Quick Reference Card

### Setup (One-time)
```powershell
.\setup.ps1
```

### Start Application
```powershell
.\start.ps1
```

### Stop Application
```powershell
.\start.ps1 stop
```

### Check Status
```powershell
.\start.ps1 status
```

### Reset Database
```powershell
python reset_database.py
```

### Access URLs
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Default Login
- Email: admin@voting.gov.in
- Password: admin123

---

**🎉 You're all set! Happy voting! 🗳️**
