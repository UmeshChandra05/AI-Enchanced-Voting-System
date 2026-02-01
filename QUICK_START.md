# 🚀 Quick Start Guide - Transfer to Another Laptop

## 📦 What You Need to Transfer

### Option 1: Transfer Entire Project Folder
Copy the entire project folder to the new laptop:
```
AI-Enchanced-Voting-System/
```

**Size**: ~3.5 GB (with all dependencies installed)

**What to Copy**:
- ✅ All source code files
- ✅ Configuration files (.env)
- ✅ Setup scripts (setup.ps1, start.ps1)
- ❌ `.venv` folder (will be recreated)
- ❌ `node_modules` folder (will be recreated)

### Option 2: Transfer Source Code Only
Copy only the essential files (recommended for faster transfer):

**Files to Copy**:
```
AI-Enchanced-Voting-System/
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   └── (other .py files)
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── (config files)
├── setup.ps1
├── start.ps1
├── reset_database.py
├── README.md
├── COMPLETE_SETUP_GUIDE.md
└── REQUIREMENTS.md
```

**Size**: ~50 MB (much faster to transfer)

---

## 🔄 Transfer Methods

### Method 1: USB Drive
1. Copy project folder to USB drive
2. Plug USB into new laptop
3. Copy folder to desired location (e.g., `D:\Projects\`)

### Method 2: Cloud Storage
1. Upload to Google Drive / OneDrive / Dropbox
2. Download on new laptop
3. Extract to desired location

### Method 3: Network Share
1. Share folder on network
2. Access from new laptop
3. Copy to local drive

### Method 4: Git Repository (If using Git)
```bash
# On old laptop
git add .
git commit -m "Project backup"
git push origin main

# On new laptop
git clone <repository-url>
cd AI-Enchanced-Voting-System
```

---

## ⚡ Step-by-Step Setup on New Laptop

### Step 1: Install Prerequisites (15-20 minutes)

#### 1.1 Install Python 3.8+
1. Download from: https://www.python.org/downloads/
2. **IMPORTANT**: Check "Add Python to PATH" during installation
3. Verify:
   ```cmd
   python --version
   ```

#### 1.2 Install Node.js 16+
1. Download from: https://nodejs.org/ (LTS version)
2. Install with default settings
3. Verify:
   ```cmd
   node --version
   npm --version
   ```

#### 1.3 Install MongoDB
1. Download from: https://www.mongodb.com/try/download/community
2. Choose "Complete" installation
3. Install as Windows Service
4. Verify:
   ```cmd
   net start MongoDB
   ```

---

### Step 2: Copy Project Files (5-10 minutes)

1. Copy the project folder to new laptop
2. Place in a location like:
   - `C:\Projects\AI-Enchanced-Voting-System`
   - `D:\Projects\AI-Enchanced-Voting-System`
   - `C:\Users\YourName\Documents\AI-Enchanced-Voting-System`

---

### Step 3: Run Setup Script (10-15 minutes)

1. Open PowerShell as Administrator
2. Navigate to project folder:
   ```powershell
   cd D:\Projects\AI-Enchanced-Voting-System
   ```

3. If you get execution policy error:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

4. Run setup:
   ```powershell
   .\setup.ps1
   ```

**What the setup does:**
- ✅ Checks Python, Node.js, MongoDB
- ✅ Creates Python virtual environment (`.venv`)
- ✅ Installs 170+ Python packages
- ✅ Installs 1400+ Node.js packages
- ✅ Creates configuration files
- ✅ Generates JWT secret

**Expected output:**
```
=========================================
   SmartBallot - First Time Setup
   AI Enhanced Voting System
=========================================

[STEP 1/6] Checking prerequisites...
[OK] Python 3.11.x
[OK] Node v18.x.x
[OK] npm detected

[STEP 2/6] Checking MongoDB...
[OK] MongoDB detected on port 27017

[STEP 3/6] Virtual environment...
[OK] venv created

[STEP 4/6] Installing backend deps...
[OK] Backend ready

[STEP 5/6] Installing frontend deps...
[OK] Frontend ready

[STEP 6/6] Creating config...

=========================================
        Setup Complete!
=========================================

Default Admin:
admin@voting.gov.in / admin123

Start app using:
start.ps1
```

---

### Step 4: Start Application (1 minute)

```powershell
.\start.ps1
```

**Expected output:**
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

Browser will open automatically to: http://localhost:3000

---

### Step 5: Verify Everything Works (2 minutes)

#### 5.1 Check Backend
Open: http://localhost:8000/docs
- Should see API documentation

#### 5.2 Check Frontend
Open: http://localhost:3000
- Should see SmartBallot homepage

#### 5.3 Test Admin Login
1. Go to: http://localhost:3000/admin/login
2. Login with:
   - Email: `admin@voting.gov.in`
   - Password: `admin123`
3. Should see admin dashboard

✅ **Success! Project is running on new laptop!**

---

## 📋 Complete Checklist

### Before Transfer
- [ ] Backup project folder
- [ ] Note any custom configurations
- [ ] Export database (if needed)

### On New Laptop
- [ ] Install Python 3.8+
- [ ] Install Node.js 16+
- [ ] Install MongoDB
- [ ] Copy project files
- [ ] Run `setup.ps1`
- [ ] Run `start.ps1`
- [ ] Test admin login
- [ ] Test voter registration
- [ ] Test voting process

---

## 🔧 Troubleshooting

### Issue: "Python not found"
**Solution:**
- Reinstall Python
- Check "Add Python to PATH" during installation
- Restart PowerShell

### Issue: "MongoDB not detected"
**Solution:**
```cmd
# Start MongoDB service
net start MongoDB

# Or check services
services.msc
# Find "MongoDB" and start it
```

### Issue: "Port already in use"
**Solution:**
```powershell
# Stop existing services
.\start.ps1 stop

# Or kill specific port
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: Setup script won't run
**Solution:**
```powershell
# Enable script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then run setup
.\setup.ps1
```

---

## 🎯 Quick Reference

### Essential Commands

```powershell
# First-time setup (run once)
.\setup.ps1

# Start application
.\start.ps1

# Check status
.\start.ps1 status

# Stop application
.\start.ps1 stop

# Reset database
python reset_database.py
```

### Access URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Admin Login | http://localhost:3000/admin/login |

### Default Credentials

```
Email: admin@voting.gov.in
Password: admin123
```

---

## ⏱️ Total Time Estimate

| Step | Time |
|------|------|
| Install Python | 5 min |
| Install Node.js | 5 min |
| Install MongoDB | 10 min |
| Copy project files | 5 min |
| Run setup script | 15 min |
| Start application | 1 min |
| **Total** | **~40 minutes** |

---

## 💾 Database Transfer (Optional)

If you want to transfer existing data:

### Export Database (Old Laptop)
```bash
mongodump --db smartballot --out ./backup
```

### Copy Backup Folder
Copy the `backup` folder to new laptop

### Import Database (New Laptop)
```bash
mongorestore --db smartballot ./backup/smartballot
```

---

## 📁 Folder Structure After Setup

```
AI-Enchanced-Voting-System/
├── .venv/                     # Python virtual environment (auto-created)
├── backend/
│   ├── .env                   # Backend config (auto-created)
│   ├── server.py
│   ├── requirements.txt
│   └── captured_images/       # Face auth images
├── frontend/
│   ├── .env                   # Frontend config (auto-created)
│   ├── node_modules/          # Node packages (auto-created)
│   ├── src/
│   ├── public/
│   └── package.json
├── .setup_complete            # Setup marker (auto-created)
├── setup.ps1
├── start.ps1
├── reset_database.py
├── README.md
├── COMPLETE_SETUP_GUIDE.md
├── REQUIREMENTS.md
└── QUICK_START.md (this file)
```

---

## 🎓 For First-Time Users

If the person receiving this project has never used it:

1. **Read this file first** (QUICK_START.md)
2. **Install prerequisites** (Python, Node.js, MongoDB)
3. **Run setup script** (`.\setup.ps1`)
4. **Start application** (`.\start.ps1`)
5. **Read full guide** (COMPLETE_SETUP_GUIDE.md)

---

## 📞 Need Help?

### Documentation Files
- **QUICK_START.md** - This file (fast setup)
- **COMPLETE_SETUP_GUIDE.md** - Detailed guide
- **REQUIREMENTS.md** - All dependencies
- **README.md** - Project overview

### Common Issues
- MongoDB not running → `net start MongoDB`
- Port conflicts → `.\start.ps1 stop`
- Setup failed → Check Python/Node.js installation

---

## ✅ Success Criteria

You'll know everything is working when:

1. ✅ Setup script completes without errors
2. ✅ Start script shows "RUNNING" for all services
3. ✅ http://localhost:3000 shows homepage
4. ✅ http://localhost:8000/docs shows API docs
5. ✅ Admin login works
6. ✅ Can register new voter
7. ✅ Can cast vote

---

## 🎉 You're Done!

The project is now running on the new laptop with the same functionality!

**Next Steps:**
- Change admin password
- Create test voter accounts
- Explore admin dashboard
- Test voting process

**For detailed information, see:**
- `COMPLETE_SETUP_GUIDE.md` - Full documentation
- `REQUIREMENTS.md` - Technical specifications

---

**Happy Voting! 🗳️**
