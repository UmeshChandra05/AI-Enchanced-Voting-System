# SmartBallot - AI Enhanced Digital Voting System

## 🚀 Quick Start

### First Time Setup (Run Once)
```cmd
setup.bat
```
This will:
- ✅ Check Python, Node.js, MongoDB
- ✅ Create Python virtual environment
- ✅ Install all backend dependencies (170+ packages)
- ✅ Install all frontend dependencies (1400+ packages)
- ✅ Create configuration files

**⏱️ Setup takes 10-15 minutes** depending on your internet speed.

### Start Application (After Setup)
```cmd
start.bat
```
This starts MongoDB, Backend (port 8000), and Frontend (port 3000).

## 📍 Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Admin Login**: http://localhost:3000/admin/login

## 👤 Default Admin Credentials
Auto-created on first backend startup:
- **Email**: admin@voting.gov.in
- **Password**: admin123

⚠️ **Change password after first login!**

## 📋 Available Commands

### Setup Script (`setup.bat`)
```cmd
setup.bat          # Run first-time setup
```

### Start Script (`start.bat`)
```cmd
start.bat          # Start all services (default)
start.bat status   # Check service status  
start.bat stop     # Stop all services
start.bat backend  # Start MongoDB + Backend only
start.bat frontend # Start Frontend only
```

## 📦 Prerequisites
- **Python 3.8+** with pip ([Download](https://python.org))
- **Node.js 16+** with npm ([Download](https://nodejs.org))
- **MongoDB** - Choose one:
  - Install locally: [MongoDB Community](https://www.mongodb.com/try/download/community)
  - Or use Docker: `docker run -d -p 27017:27017 --name mongodb mongo`

## Features
✅ Aadhaar voter registration
✅ AI face authentication (DeepFace)
✅ Multi-factor authentication
✅ ML fraud detection (Isolation Forest)
✅ Text-to-speech accessibility
✅ Real-time vote counting
✅ Admin dashboard with analytics

## Troubleshooting
- **MongoDB**: Ensure running on port 27017
- **Backend**: AI models take 30-60s to load
- **Frontend**: Run `npm install --legacy-peer-deps` if errors

## Testing
```bash
python backend_test.py
```
