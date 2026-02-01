# 🚀 SmartBallot - One-Page Quick Reference

## ⚡ FASTEST SETUP (40 Minutes Total)

### 1. Install Prerequisites (20 min)
```
✅ Python 3.8+     → https://python.org/downloads
✅ Node.js 16+     → https://nodejs.org
✅ MongoDB 5.0+    → https://mongodb.com/try/download/community
```

### 2. Copy Project Files (5 min)
```
Copy entire folder to: D:\Projects\AI-Enchanced-Voting-System
```

### 3. Run Setup (15 min)
```powershell
cd D:\Projects\AI-Enchanced-Voting-System
.\setup.ps1
```

### 4. Start Application (1 min)
```powershell
.\start.ps1
```

### 5. Access & Login
```
URL: http://localhost:3000
Email: admin@voting.gov.in
Password: admin123
```

---

## 📋 Essential Commands

| Command | Purpose |
|---------|---------|
| `.\setup.ps1` | First-time setup (run once) |
| `.\start.ps1` | Start all services |
| `.\start.ps1 status` | Check service status |
| `.\start.ps1 stop` | Stop all services |
| `python reset_database.py` | Reset database |

---

## 🌐 Access URLs

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:8000 |
| **API Docs** | http://localhost:8000/docs |
| **Admin Login** | http://localhost:3000/admin/login |

---

## 🔧 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| MongoDB not running | `net start MongoDB` |
| Port already in use | `.\start.ps1 stop` |
| Setup script won't run | `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| Backend slow to start | Normal! AI models take 30-60s to load |

---

## 📊 System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **RAM** | 8 GB | 16 GB |
| **CPU** | i5/Ryzen 5 | i7/Ryzen 7 |
| **Storage** | 5 GB | 10 GB SSD |
| **Webcam** | Required for face auth | HD 720p+ |

---

## 🎯 Success Checklist

- [ ] Python installed (`python --version`)
- [ ] Node.js installed (`node --version`)
- [ ] MongoDB running (`net start MongoDB`)
- [ ] Project files copied
- [ ] Setup completed (`.\setup.ps1`)
- [ ] Application started (`.\start.ps1`)
- [ ] Can access http://localhost:3000
- [ ] Admin login works

---

## 📁 What Gets Installed

| Component | Size | Count |
|-----------|------|-------|
| Python packages | ~2 GB | 170+ |
| Node.js packages | ~800 MB | 1400+ |
| Total project | ~3.5 GB | - |

---

## 🔐 Default Credentials

```
Admin Account:
Email: admin@voting.gov.in
Password: admin123

⚠️ Change password after first login!
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **QUICK_START.md** | Fast transfer guide |
| **COMPLETE_SETUP_GUIDE.md** | Full documentation |
| **REQUIREMENTS.md** | Technical specs |
| **VISUAL_GUIDE.md** | Visual flowcharts |
| **README.md** | Project overview |

---

## 🎓 For Complete Beginners

**Just follow these 4 steps:**

1. **Install** Python, Node.js, MongoDB
2. **Copy** project folder to new laptop
3. **Run** `.\setup.ps1` in PowerShell
4. **Start** `.\start.ps1`

**That's it!** Browser opens automatically.

---

## ⏱️ Time Breakdown

| Step | Time |
|------|------|
| Install Python | 5 min |
| Install Node.js | 5 min |
| Install MongoDB | 10 min |
| Copy files | 5 min |
| Run setup | 15 min |
| **Total** | **40 min** |

---

## 🔄 Daily Usage

**Start working:**
```powershell
.\start.ps1
```

**Stop working:**
```powershell
.\start.ps1 stop
```

**Check status:**
```powershell
.\start.ps1 status
```

---

## 🆘 Emergency Help

**If nothing works:**

1. Check MongoDB is running:
   ```cmd
   net start MongoDB
   ```

2. Re-run setup:
   ```powershell
   .\setup.ps1
   ```

3. Check documentation:
   - Read `COMPLETE_SETUP_GUIDE.md`
   - Read `VISUAL_GUIDE.md`

---

## 📞 Quick Support

**Common Issues:**

| Issue | Fix |
|-------|-----|
| "Python not found" | Add Python to PATH, restart PowerShell |
| "MongoDB not detected" | Run `net start MongoDB` |
| "Port 3000 in use" | Run `.\start.ps1 stop` first |
| Setup takes long | Normal! Installing 1500+ packages |

---

## 🎯 What This Project Does

**SmartBallot** is an AI-enhanced digital voting system with:

✅ Aadhaar-based voter registration  
✅ AI face authentication (DeepFace)  
✅ Multi-factor authentication  
✅ ML fraud detection  
✅ Real-time vote counting  
✅ Admin dashboard with analytics  
✅ Text-to-speech accessibility  

---

## 🏗️ Technology Stack

**Backend:**
- Python + FastAPI
- MongoDB
- TensorFlow + DeepFace
- JWT Authentication

**Frontend:**
- React 19
- TailwindCSS
- Radix UI
- Axios

---

## 📊 Ports Used

```
Frontend  → Port 3000
Backend   → Port 8000
MongoDB   → Port 27017
```

Make sure these ports are not blocked by firewall.

---

## ✅ Verification Steps

After setup, verify:

1. ✅ Backend API: http://localhost:8000/docs
2. ✅ Frontend UI: http://localhost:3000
3. ✅ Admin login works
4. ✅ Can register new voter
5. ✅ Can cast vote

---

## 🎉 Success!

If you can:
- ✅ Access http://localhost:3000
- ✅ Login as admin
- ✅ See the dashboard

**You're done! Project is working perfectly!**

---

## 📖 Need More Details?

**Read these files in order:**

1. **QUICK_START.md** ← Start here
2. **VISUAL_GUIDE.md** ← See flowcharts
3. **COMPLETE_SETUP_GUIDE.md** ← Full details
4. **REQUIREMENTS.md** ← Technical specs

---

## 🔑 Key Points to Remember

1. **First time setup takes 15 minutes** (installing packages)
2. **Backend startup takes 30-60 seconds** (loading AI models)
3. **MongoDB must be running** before starting the app
4. **Change admin password** after first login
5. **Face authentication is optional** (but requires webcam)

---

## 💡 Pro Tips

- Use SSD for faster performance
- 16 GB RAM recommended for smooth operation
- Keep MongoDB running as Windows Service
- Bookmark http://localhost:3000 for quick access
- Use `.\start.ps1 status` to check if services are running

---

## 🎯 Transfer to Another Laptop

**Simple 3-step process:**

1. Copy entire project folder
2. Install Python, Node.js, MongoDB on new laptop
3. Run `.\setup.ps1` then `.\start.ps1`

**Done!** Same project, different laptop.

---

## 📦 What to Copy

**Option 1: Copy Everything** (3.5 GB)
- Faster to run on new laptop
- Includes all dependencies

**Option 2: Copy Source Only** (50 MB)
- Faster to transfer
- Need to run setup again

**Recommended:** Option 2 (copy source, run setup)

---

## 🔄 Database Backup (Optional)

**Export database:**
```bash
mongodump --db smartballot --out ./backup
```

**Import database:**
```bash
mongorestore --db smartballot ./backup/smartballot
```

---

## 🌟 Features Overview

| Feature | Status |
|---------|--------|
| Voter Registration | ✅ Working |
| Face Authentication | ✅ Working |
| Admin Dashboard | ✅ Working |
| Vote Casting | ✅ Working |
| Fraud Detection | ✅ Working |
| Real-time Results | ✅ Working |
| Accessibility | ✅ Working |

---

## 🎓 Learning Resources

**Want to understand the code?**

- Backend: `backend/server.py`
- Frontend: `frontend/src/App.js`
- Database: MongoDB Compass (GUI tool)
- API: http://localhost:8000/docs

---

## 🔐 Security Features

- ✅ Password hashing (bcrypt)
- ✅ JWT authentication
- ✅ Vote encryption
- ✅ Voter anonymity
- ✅ Audit logging
- ✅ Face data privacy

---

## 📈 Performance

| Metric | Value |
|--------|-------|
| Backend startup | 30-60s |
| Frontend startup | 10-15s |
| API response time | <100ms |
| Face recognition | 2-3s |
| Vote processing | <1s |

---

## 🎯 Final Checklist

**Before handing over to another person:**

- [ ] All documentation files included
- [ ] setup.ps1 and start.ps1 scripts present
- [ ] README.md updated
- [ ] Default admin credentials documented
- [ ] Prerequisites list provided
- [ ] Troubleshooting guide included

---

## 🎉 You're All Set!

**Everything you need is in this project folder.**

**To start using:**
```powershell
.\start.ps1
```

**To stop:**
```powershell
.\start.ps1 stop
```

**Happy Voting! 🗳️**

---

**📄 Print this page for quick reference!**
