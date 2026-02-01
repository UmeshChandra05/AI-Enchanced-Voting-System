"""
Database Reset Utility for AI-Enhanced Voting System
Keeps admin accounts intact
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
load_dotenv(dotenv_path=Path(__file__).parent / "backend" / ".env", override=True)

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "smartballot")

async def reset_database():
    """Reset database while keeping admin accounts"""
    
    print("\n" + "="*50)
    print("  PARTIAL DATABASE RESET")
    print("="*50)
    print("\nThis will delete:")
    print("  - All registered voters")
    print("  - All candidates")
    print("  - All votes")
    print("  - All elections")
    print("\nThis will KEEP:")
    print("  - Admin accounts (you can still login)")
    print()
    
    confirmation = input("Continue with partial reset? (yes/no): ")
    
    if confirmation.lower() != "yes":
        print("\nReset cancelled.")
        return
    
    print("\nConnecting to MongoDB...")
    
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]
        
        # Test connection
        await db.command('ping')
        print("✓ Connected to MongoDB")
        
        print("\nResetting data...")
        
        # Delete collections
        result_users = await db.users.delete_many({})
        print(f"✓ Deleted {result_users.deleted_count} voters")
        
        result_candidates = await db.candidates.delete_many({})
        print(f"✓ Deleted {result_candidates.deleted_count} candidates")
        
        result_votes = await db.votes.delete_many({})
        print(f"✓ Deleted {result_votes.deleted_count} votes")
        
        result_elections = await db.elections.delete_many({})
        print(f"✓ Deleted {result_elections.deleted_count} elections")
        
        # Count remaining documents
        user_count = await db.users.count_documents({})
        candidate_count = await db.candidates.count_documents({})
        vote_count = await db.votes.count_documents({})
        election_count = await db.elections.count_documents({})
        admin_count = await db.admins.count_documents({})
        
        print("\n" + "="*50)
        print("  RESET COMPLETE!")
        print("="*50)
        print("\nRemaining documents:")
        print(f"  Users: {user_count}")
        print(f"  Candidates: {candidate_count}")
        print(f"  Votes: {vote_count}")
        print(f"  Elections: {election_count}")
        print(f"  Admins: {admin_count} (preserved)")
        
        print("\nYou can now:")
        print("1. Login with your existing admin account")
        print("2. Create new elections")
        print("3. Register new voters")
        print()
        
        client.close()
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        print("\nMake sure MongoDB is running!")
        print("To start MongoDB: mongod")
        print()

if __name__ == "__main__":
    asyncio.run(reset_database())
