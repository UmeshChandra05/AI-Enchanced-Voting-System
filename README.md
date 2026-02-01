# 🗳️ SmartBallot - AI Enhanced Digital Voting System

> A complete AI-powered voting system with face authentication, fraud detection, and real-time analytics.

---

## 📚 Documentation

**Choose your guide based on your needs:**

| Document | Purpose | Best For |
|----------|---------|----------|
| **[ONE_PAGE_REFERENCE.md](ONE_PAGE_REFERENCE.md)** | Quick reference card | Fast lookup |
| **[QUICK_START.md](QUICK_START.md)** | Transfer to new laptop | Setup on new machine |
| **[VISUAL_GUIDE.md](VISUAL_GUIDE.md)** | Visual flowcharts & diagrams | Visual learners |
| **[COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)** | Comprehensive guide | Detailed instructions |
| **[REQUIREMENTS.md](REQUIREMENTS.md)** | Technical specifications | System requirements |
| **README.md** | This file | Quick overview |

---

## ⚡ Quick Start (3 Steps)

### 1️⃣ Install Prerequisites
- **Python 3.8+** → [Download](https://python.org/downloads)
- **Node.js 16+** → [Download](https://nodejs.org)
- **MongoDB 5.0+** → [Download](https://mongodb.com/try/download/community)

### 2️⃣ Run Setup (First Time Only)
```powershell
.\setup.ps1
```
⏱️ Takes 10-15 minutes (installs 1500+ packages)

### 3️⃣ Start Application
```powershell
.\start.ps1
```
🌐 Browser opens automatically to http://localhost:3000

---

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main user interface |
| **Backend API** | http://localhost:8000 | REST API server |
| **API Docs** | http://localhost:8000/docs | Interactive API documentation |
| **Admin Dashboard** | http://localhost:3000/admin/login | Admin panel |

---

## 🔐 Default Admin Credentials

```
Email: admin@voting.gov.in
Password: admin123
```

⚠️ **IMPORTANT**: Change password after first login!

---

## 📋 Essential Commands

| Command | Purpose |
|---------|---------|
| `.\setup.ps1` | First-time setup (run once) |
| `.\start.ps1` | Start all services |
| `.\start.ps1 status` | Check service status |
| `.\start.ps1 stop` | Stop all services |
| `.\start.ps1 backend` | Start backend only |
| `.\start.ps1 frontend` | Start frontend only |
| `python reset_database.py` | Reset database |

---

## ✨ Features

### Core Functionality
✅ **Aadhaar-based Registration** - 12-digit validation with duplicate prevention  
✅ **AI Face Authentication** - DeepFace integration for biometric verification  
✅ **Multi-Factor Authentication** - Password + OTP + optional face recognition  
✅ **ML Fraud Detection** - Isolation Forest algorithm for anomaly detection  
✅ **Real-time Vote Counting** - Live results and analytics  
✅ **Admin Dashboard** - Comprehensive election management  

### Accessibility
✅ **Text-to-Speech** - Voice assistance for visually impaired  
✅ **Keyboard Navigation** - Full keyboard support  
✅ **High Contrast Mode** - Enhanced visibility  

### Security
✅ **Password Hashing** - bcrypt with cost factor 12  
✅ **JWT Authentication** - Secure token-based sessions  
✅ **Vote Encryption** - Encrypted vote storage  
✅ **Voter Anonymity** - Privacy-focused design  
✅ **Audit Logging** - Complete activity tracking  

---

## 🏗️ Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB
- **AI/ML**: TensorFlow, DeepFace, scikit-learn
- **Authentication**: JWT, bcrypt

### Frontend
- **Framework**: React 19
- **UI**: Radix UI + TailwindCSS
- **Routing**: React Router v7
- **HTTP**: Axios

---

## 📦 System Requirements

### Minimum
- **RAM**: 8 GB
- **CPU**: Intel i5 / AMD Ryzen 5
- **Storage**: 5 GB free space
- **Webcam**: Required for face authentication

### Recommended
- **RAM**: 16 GB
- **CPU**: Intel i7 / AMD Ryzen 7
- **Storage**: 10 GB SSD
- **Webcam**: HD 720p or higher

---

## 🔧 Troubleshooting

### MongoDB Not Running
```cmd
net start MongoDB
```

### Port Already in Use
```powershell
.\start.ps1 stop
```

### Setup Script Won't Run
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup.ps1
```

### Backend Slow to Start
This is normal! AI models take 30-60 seconds to load on first startup.

**For more troubleshooting, see [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)**

---

## 🚀 Transferring to Another Laptop

**See [QUICK_START.md](QUICK_START.md) for detailed transfer instructions.**

**Quick steps:**
1. Install Python, Node.js, MongoDB on new laptop
2. Copy project folder
3. Run `.\setup.ps1`
4. Run `.\start.ps1`

---

## 📊 Project Structure

```
AI-Enchanced-Voting-System/
├── backend/              # Python FastAPI backend
│   ├── server.py        # Main API server
│   └── requirements.txt # Python dependencies
├── frontend/            # React frontend
│   ├── src/            # React source code
│   └── package.json    # Node.js dependencies
├── setup.ps1           # First-time setup script
├── start.ps1           # Application startup script
└── Documentation files (.md)
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend
..\.venv\Scripts\python.exe -m pytest

# Frontend tests
cd frontend
npm test
```

---

## 📖 Documentation Index

### For Setup & Installation
- **[QUICK_START.md](QUICK_START.md)** - Fast setup guide for new laptop
- **[COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)** - Comprehensive setup documentation
- **[VISUAL_GUIDE.md](VISUAL_GUIDE.md)** - Visual flowcharts and diagrams

### For Reference
- **[ONE_PAGE_REFERENCE.md](ONE_PAGE_REFERENCE.md)** - Quick reference card
- **[REQUIREMENTS.md](REQUIREMENTS.md)** - Detailed system requirements
- **[README.md](README.md)** - This file (project overview)

---

## 🎯 Quick Reference

### First Time Setup
```powershell
# Install Python, Node.js, MongoDB first
.\setup.ps1
```

### Daily Usage
```powershell
# Start
.\start.ps1

# Stop
.\start.ps1 stop

# Check status
.\start.ps1 status
```

### Access Application
```
Frontend: http://localhost:3000
Admin: admin@voting.gov.in / admin123
```

---

## 🆘 Need Help?

1. **Quick answers**: See [ONE_PAGE_REFERENCE.md](ONE_PAGE_REFERENCE.md)
2. **Setup issues**: See [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)
3. **Visual guides**: See [VISUAL_GUIDE.md](VISUAL_GUIDE.md)
4. **Requirements**: See [REQUIREMENTS.md](REQUIREMENTS.md)

---

## 📝 License

This project is an academic implementation of an AI-enhanced voting system.

---

## 🎉 Ready to Start?

**For first-time setup:**
```powershell
.\setup.ps1
```

**To start the application:**
```powershell
.\start.ps1
```

**For detailed instructions, see [QUICK_START.md](QUICK_START.md)**

---

**Happy Voting! 🗳️**
