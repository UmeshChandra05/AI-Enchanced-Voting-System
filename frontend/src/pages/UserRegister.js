import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Camera, X, UserPlus, Landmark, ScanFace, CheckCircle2, AlertCircle, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const UserRegister = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    aadhaar: '',
    gender: 'Male',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isTTSActive, setIsTTSActive] = useState(true);

  // Text-to-speech function
  const speak = (text) => {
    if (isTTSActive && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Welcome message
    if (!showCamera && !capturedImage) {
      speak("Welcome to the Secure Voter Registration Portal. Please enter your details.");
    }
  }, []);

  useEffect(() => {
    if (showCamera && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play().catch(e => console.error("Error playing video:", e));
        // Small delay to ensure smooth transition
        setTimeout(() => setVideoReady(true), 500);
        speak("Camera is active. Please look at the camera and capture your photo.");
      };
    }
  }, [showCamera, stream]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setVideoReady(false);
      setShowCamera(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      setStream(mediaStream);
      setCapturedImage(null);
    } catch (error) {
      console.error('Camera error:', error);
      toast.error('Camera access denied. You can still register without a photo.');
      setShowCamera(false);
      speak("Camera access failed. You can proceed with registration using credentials only.");
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      if (!videoReady || video.videoWidth === 0) {
        toast.error('Camera still preparing. Please wait...');
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      // Mirror for selfie feel
      ctx.setTransform(-1, 0, 0, 1, canvas.width, 0);
      ctx.drawImage(video, 0, 0);
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const imageData = canvas.toDataURL('image/jpeg', 0.9);

      // Basic check for empty capture
      if (imageData.length < 100) {
        toast.error('Capture failed. Please try again.');
        return;
      }

      setCapturedImage(imageData);

      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      setShowCamera(false);
      toast.success('Face registered successfully!');
      speak("Photo captured successfully. Your face biometric is now registered.");
    }
  };

  const skipFaceCapture = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    setCapturedImage(null);
    setVideoReady(false);
    toast.info('Face registration skipped.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.aadhaar.length !== 12) {
      toast.error('Aadhaar number must be exactly 12 digits');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Safety: if camera is open but nothing captured, warn the user
    if (showCamera && !capturedImage) {
      toast.warning('Please capture your photo or click Skip before completing registration.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/register`, {
        name: formData.name,
        aadhaar: formData.aadhaar,
        email: formData.email,
        password: formData.password,
        face_image: capturedImage || null
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Registration successful! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data);
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 relative">
          <div className="absolute top-0 right-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newState = !isTTSActive;
                setIsTTSActive(newState);
                if (newState) speak("Text to speech enabled");
                else window.speechSynthesis.cancel();
              }}
              className="text-[#1e3a8a] border border-[#1e3a8a]/20"
            >
              {isTTSActive ? <Volume2 className="w-5 h-5 mr-2" /> : <VolumeX className="w-5 h-5 mr-2" />}
              {isTTSActive ? "Voice On" : "Voice Off"}
            </Button>
          </div>
          <Landmark className="w-16 h-16 text-[#1e3a8a] mx-auto mb-4 p-3 bg-white rounded-2xl shadow-lg border border-[#1e3a8a]/10" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight mb-2">
            AI-Enhanced Digital Voting System
            <span className="block text-xl font-medium text-[#059669] mt-1 italic">
              with Secure Face Authentication
            </span>
          </h1>
          <p className="text-gray-600 font-medium">Secure Voter Registration Portal</p>
        </div>

        <Card className="glass border-t-4 border-t-[#1e3a8a] shadow-2xl overflow-hidden hover-card">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    placeholder="E.g. John Doe"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Aadhaar Number</Label>
                  <Input
                    placeholder="123456789012"
                    value={formData.aadhaar}
                    onChange={e => setFormData({ ...formData, aadhaar: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                    maxLength={12}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Face Capture Section */}
              <div className="pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ScanFace className="w-5 h-5 text-[#1e3a8a]" />
                    Face Biometrics (Optional)
                  </h3>
                  {capturedImage && <CheckCircle2 className="text-green-500 w-6 h-6" />}
                </div>

                {!showCamera && !capturedImage && (
                  <div className="space-y-3">
                    <Button type="button" onClick={startCamera} className="w-full bg-[#059669] hover:bg-[#047857] py-6 rounded-xl">
                      <Camera className="mr-2" /> Open Camera & Secure Face
                    </Button>
                    <p className="text-xs text-center text-gray-500">
                      You can also skip this and register with credentials only.
                    </p>
                  </div>
                )}

                {showCamera && (
                  <div className="space-y-4 animate-scale-in">
                    <div className="relative bg-black rounded-xl overflow-hidden aspect-video flex items-center justify-center border-2 border-[#1e3a8a]/20 shadow-inner">
                      <video
                        ref={videoRef} onCanPlay={() => setVideoReady(true)}
                        autoPlay playsInline muted
                        className={`w-full h-full object-cover ${videoReady ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
                      />
                      {!videoReady && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-3">
                          <div className="spinner"></div>
                          <p className="text-sm font-medium animate-pulse">Initializing Camera...</p>
                        </div>
                      )}
                      {videoReady && <div className="scan-line"></div>}
                    </div>
                    <div className="flex gap-3">
                      <Button type="button" onClick={capturePhoto} disabled={!videoReady} className="flex-1 bg-[#1e3a8a] py-6 shadow-lg active:scale-95 transition-all">
                        {videoReady ? 'Capture Photo' : 'Wait...'}
                      </Button>
                      <Button type="button" onClick={skipFaceCapture} variant="outline" className="py-6 px-6">
                        Skip / Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {capturedImage && (
                  <div className="relative group animate-scale-in">
                    <img src={capturedImage} alt="Face" className="w-full rounded-xl border-4 border-[#059669] shadow-lg" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 rounded-xl">
                      <Button
                        type="button" variant="destructive"
                        className="rounded-full w-12 h-12 p-0 flex items-center justify-center"
                        onClick={() => setCapturedImage(null)}
                      >
                        <X className="w-6 h-6" />
                      </Button>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      <p className="text-white text-xs bg-black/50 py-1 rounded-full backdrop-blur-sm">Click the X to retake</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4">
                {showCamera && !capturedImage && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3 text-amber-800 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>Camera is active. Please capture your photo or click "Skip" to register without biometrics.</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1e3a8a] py-8 text-xl font-bold shadow-xl hover:bg-[#1e40af] transition-all"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="spinner border-2 w-5 h-5"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-6 h-6" />
                      <span>Complete Secure Registration</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center pt-6 border-t font-medium text-gray-500">
              Already have an account? {' '}
              <button
                onClick={() => navigate('/login')}
                className="text-[#1e3a8a] border-b-2 border-transparent hover:border-[#1e3a8a] transition-all pb-1"
              >
                Login here
              </button>
            </div>
          </CardContent>
        </Card>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default UserRegister;