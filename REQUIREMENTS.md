# 📋 SmartBallot - System Requirements & Dependencies

## 🖥️ Hardware Requirements

### Minimum Specifications
| Component | Requirement |
|-----------|-------------|
| **Processor** | Intel Core i5 / AMD Ryzen 5 or equivalent |
| **RAM** | 8 GB |
| **Storage** | 5 GB free space |
| **Internet** | Stable connection (for initial setup) |
| **Webcam** | Required for face authentication |
| **Display** | 1366x768 minimum resolution |

### Recommended Specifications
| Component | Requirement |
|-----------|-------------|
| **Processor** | Intel Core i7 / AMD Ryzen 7 or better |
| **RAM** | 16 GB |
| **Storage** | 10 GB free space (SSD preferred) |
| **Internet** | Broadband connection |
| **Webcam** | HD webcam (720p or higher) |
| **Display** | 1920x1080 or higher |

---

## 💻 Software Requirements

### Operating System
- **Windows**: Windows 10 (64-bit) or Windows 11
- **macOS**: macOS 10.15 (Catalina) or later
- **Linux**: Ubuntu 20.04 LTS or later (Debian-based distributions)

---

## 🔧 Prerequisites (Must Install)

### 1. Python
- **Version**: 3.8 or higher (3.11 recommended)
- **Download**: https://www.python.org/downloads/
- **Installation Note**: Add Python to PATH during installation
- **Verify**: `python --version`

### 2. Node.js
- **Version**: 16.x or higher (18.x LTS recommended)
- **Download**: https://nodejs.org/
- **Includes**: npm (Node Package Manager)
- **Verify**: 
  ```bash
  node --version
  npm --version
  ```

### 3. MongoDB
- **Version**: 5.0 or higher (6.0 recommended)
- **Download**: https://www.mongodb.com/try/download/community
- **Installation**: Install as Windows Service (recommended)
- **Alternative**: Docker container
- **Verify**: 
  ```bash
  mongod --version
  # Or check service status
  net start MongoDB
  ```

---

## 📦 Backend Dependencies (Python)

### Core Framework
```
fastapi==0.110.1          # Web framework
uvicorn==0.25.0           # ASGI server
motor==3.3.1              # Async MongoDB driver
pymongo==4.5.0            # MongoDB driver
```

### Authentication & Security
```
python-jose==3.5.0        # JWT token handling
passlib==1.7.4            # Password hashing
bcrypt==4.1.3             # Bcrypt hashing
cryptography==46.0.3      # Cryptographic functions
PyJWT==2.10.1             # JWT implementation
```

### AI & Machine Learning
```
tensorflow==2.20.0        # Deep learning framework
deepface==0.0.98          # Face recognition
opencv-python==4.13.0.90  # Computer vision
scikit-learn==1.8.0       # ML algorithms
numpy==2.4.1              # Numerical computing
pandas==2.3.3             # Data manipulation
scipy==1.17.0             # Scientific computing
```

### Face Recognition Models
```
mtcnn==1.0.0              # Face detection
retina-face==0.0.17       # Face detection
keras==3.13.2             # Neural networks
```

### Image Processing
```
pillow==12.1.0            # Image manipulation
opencv-python-headless==4.13.0.90  # OpenCV without GUI
```

### API & Validation
```
pydantic==2.12.5          # Data validation
email-validator==2.3.0    # Email validation
python-multipart==0.0.21  # File uploads
```

### Utilities
```
python-dotenv==1.2.1      # Environment variables
requests==2.32.5          # HTTP client
aiohttp==3.13.3           # Async HTTP
```

### Total Backend Packages: **170+**

---

## 🎨 Frontend Dependencies (Node.js)

### Core Framework
```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-scripts": "5.0.1"
}
```

### Routing
```json
{
  "react-router-dom": "^7.5.1"
}
```

### UI Components (Radix UI)
```json
{
  "@radix-ui/react-accordion": "^1.2.8",
  "@radix-ui/react-alert-dialog": "^1.1.11",
  "@radix-ui/react-avatar": "^1.1.7",
  "@radix-ui/react-checkbox": "^1.2.3",
  "@radix-ui/react-dialog": "^1.1.11",
  "@radix-ui/react-dropdown-menu": "^2.1.12",
  "@radix-ui/react-label": "^2.1.4",
  "@radix-ui/react-popover": "^1.1.11",
  "@radix-ui/react-progress": "^1.1.4",
  "@radix-ui/react-select": "^2.2.2",
  "@radix-ui/react-tabs": "^1.1.9",
  "@radix-ui/react-toast": "^1.2.11",
  "@radix-ui/react-tooltip": "^1.2.4"
}
```

### Styling
```json
{
  "tailwindcss": "^3.4.17",
  "autoprefixer": "^10.4.20",
  "postcss": "^8.4.49",
  "tailwindcss-animate": "^1.0.7",
  "tailwind-merge": "^3.2.0",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1"
}
```

### HTTP & Data Fetching
```json
{
  "axios": "^1.8.4"
}
```

### Form Handling
```json
{
  "react-hook-form": "^7.56.2",
  "@hookform/resolvers": "^5.0.1",
  "zod": "^3.24.4"
}
```

### Charts & Visualization
```json
{
  "recharts": "^3.6.0"
}
```

### Icons
```json
{
  "lucide-react": "^0.507.0"
}
```

### Utilities
```json
{
  "date-fns": "^4.1.0",
  "sonner": "^2.0.3",
  "cmdk": "^1.1.1",
  "input-otp": "^1.4.2",
  "embla-carousel-react": "^8.6.0"
}
```

### Build Tools
```json
{
  "@craco/craco": "^7.1.0",
  "eslint": "9.23.0"
}
```

### Total Frontend Packages: **1400+** (including dependencies)

---

## 🗄️ Database Requirements

### MongoDB Configuration
- **Database Name**: `smartballot`
- **Port**: `27017` (default)
- **Connection String**: `mongodb://localhost:27017`
- **Storage Engine**: WiredTiger
- **Authentication**: Optional (recommended for production)

### Collections
1. **users** - Voter accounts
2. **admins** - Admin accounts
3. **candidates** - Election candidates
4. **votes** - Cast votes
5. **elections** - Election configurations

### Estimated Storage
- **Development**: ~100 MB
- **Production** (1000 voters): ~500 MB
- **Production** (10,000 voters): ~2 GB

---

## 🌐 Network Requirements

### Ports Used
| Service | Port | Protocol | Purpose |
|---------|------|----------|---------|
| Frontend | 3000 | HTTP | React development server |
| Backend | 8000 | HTTP | FastAPI server |
| MongoDB | 27017 | TCP | Database connection |

### Firewall Rules
For local development, ensure these ports are not blocked:
- Allow inbound: 3000, 8000, 27017
- Allow outbound: 80, 443 (for npm/pip downloads)

---

## 📊 Installation Size Breakdown

| Component | Size | Description |
|-----------|------|-------------|
| Python 3.11 | ~100 MB | Python runtime |
| Node.js 18 | ~50 MB | Node.js runtime |
| MongoDB | ~500 MB | Database server |
| Python venv | ~2 GB | Virtual environment + packages |
| node_modules | ~800 MB | Frontend dependencies |
| Project files | ~50 MB | Source code |
| **Total** | **~3.5 GB** | Complete installation |

---

## ⏱️ Installation Time Estimates

| Step | Time | Notes |
|------|------|-------|
| Python installation | 2-5 min | One-time |
| Node.js installation | 2-5 min | One-time |
| MongoDB installation | 5-10 min | One-time |
| Project setup script | 10-15 min | Depends on internet speed |
| **Total** | **20-35 min** | First-time setup |

---

## 🔄 Runtime Requirements

### Backend Startup
- **First startup**: 30-60 seconds (loading AI models)
- **Subsequent startups**: 10-20 seconds
- **Memory usage**: ~1.5 GB (TensorFlow models loaded)
- **CPU usage**: 10-30% (idle), 50-80% (during face recognition)

### Frontend Startup
- **First startup**: 20-30 seconds (compiling React)
- **Subsequent startups**: 10-15 seconds
- **Memory usage**: ~200 MB
- **CPU usage**: 5-15%

### MongoDB
- **Memory usage**: ~200-500 MB
- **CPU usage**: 1-5% (idle), 10-30% (under load)

---

## 🔐 Security Requirements

### SSL/TLS (Production)
- **Certificate**: Required for HTTPS
- **Recommended**: Let's Encrypt (free)

### Environment Variables
- **JWT_SECRET**: Auto-generated (32 characters)
- **MONGO_URL**: Connection string
- **DB_NAME**: Database name

### Permissions
- **MongoDB**: Read/write access to database
- **File system**: Read/write access to project directory
- **Camera**: Access for face authentication

---

## 🧪 Testing Requirements

### Optional Testing Tools
```bash
# Backend testing
pytest==9.0.2
black==25.12.0              # Code formatter
flake8==7.3.0               # Linter
mypy==1.19.1                # Type checker

# Frontend testing
@testing-library/react
@testing-library/jest-dom
```

---

## 📱 Browser Compatibility

### Supported Browsers
- ✅ Google Chrome 90+ (Recommended)
- ✅ Microsoft Edge 90+
- ✅ Mozilla Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

### Required Browser Features
- JavaScript enabled
- Cookies enabled
- LocalStorage enabled
- WebRTC (for camera access)
- WebAssembly support

---

## 🔌 Optional Dependencies

### Development Tools
- **Git**: Version control
- **VS Code**: Code editor (recommended)
- **MongoDB Compass**: Database GUI
- **Postman**: API testing

### Docker (Alternative Setup)
```yaml
# docker-compose.yml
version: '3.8'
services:
  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
```

---

## 📋 Pre-Installation Checklist

Before running setup, ensure:

- [ ] Python 3.8+ installed and in PATH
- [ ] Node.js 16+ installed
- [ ] npm available
- [ ] MongoDB installed and running
- [ ] 5 GB free disk space
- [ ] Stable internet connection
- [ ] Administrator/sudo privileges (for installations)
- [ ] Antivirus not blocking ports 3000, 8000, 27017
- [ ] Windows Firewall configured (if applicable)

---

## 🆘 Minimum vs Recommended Comparison

| Aspect | Minimum | Recommended |
|--------|---------|-------------|
| **RAM** | 8 GB | 16 GB |
| **CPU** | i5 / Ryzen 5 | i7 / Ryzen 7 |
| **Storage** | 5 GB HDD | 10 GB SSD |
| **Internet** | 2 Mbps | 10+ Mbps |
| **Python** | 3.8 | 3.11 |
| **Node.js** | 16.x | 18.x LTS |
| **MongoDB** | 5.0 | 6.0 |

---

## 📞 Dependency Update Policy

### Backend (Python)
```bash
# Check for updates
pip list --outdated

# Update specific package
pip install --upgrade <package-name>

# Update all (use with caution)
pip install --upgrade -r requirements.txt
```

### Frontend (Node.js)
```bash
# Check for updates
npm outdated

# Update specific package
npm update <package-name>

# Update all
npm update
```

---

## 🎯 Quick Requirements Summary

**Must Have:**
1. ✅ Python 3.8+
2. ✅ Node.js 16+
3. ✅ MongoDB 5.0+
4. ✅ 8 GB RAM
5. ✅ 5 GB storage
6. ✅ Webcam (for face auth)

**Good to Have:**
- 16 GB RAM
- SSD storage
- Fast internet
- Modern browser

**Run Setup:**
```powershell
.\setup.ps1
```

**Start Application:**
```powershell
.\start.ps1
```

---

**✅ All requirements documented!**
