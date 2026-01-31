import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Camera, X, UserPlus, Landmark } from 'lucide-react';
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
  const [formData, setFormData] = useState({
    name: '',
    aadhaar: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
    } catch (error) {
      toast.error('Camera access denied. Please allow camera access.');
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageData);
      
      // Stop camera
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setShowCamera(false);
      toast.success('Photo captured successfully!');
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.aadhaar || !formData.email || !formData.password) {
      toast.error('Please fill all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!capturedImage) {
      toast.error('Please capture your photo for face registration');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/register`, {
        name: formData.name,
        aadhaar: formData.aadhaar,
        email: formData.email,
        password: formData.password,
        face_image: capturedImage
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Registration successful! Welcome to SmartBallot.');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe] py-12 px-4" data-testid="register-page">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Landmark className="w-10 h-10 text-[#1e3a8a]" />
            <h1 className="text-3xl md:text-4xl font-bold text-[#1e3a8a]" style={{ fontFamily: 'Merriweather, serif' }}>
              SmartBallot
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Register as a Voter</p>
        </div>

        <Card className="border-t-4 border-t-[#1e3a8a]">
          <CardHeader>
            <CardTitle className="text-2xl">Create Your Voter Account</CardTitle>
            <CardDescription>Complete all steps including face capture for secure registration</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    data-testid="input-name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="aadhaar">Aadhaar Number *</Label>
                  <Input
                    id="aadhaar"
                    data-testid="input-aadhaar"
                    placeholder="12-digit Aadhaar number"
                    value={formData.aadhaar}
                    onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                    maxLength={12}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    data-testid="input-email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    data-testid="input-password"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    data-testid="input-confirm-password"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Face Capture */}
              <div className="border-t pt-6">
                <Label className="text-lg mb-3 block">Face Registration *</Label>
                <p className="text-sm text-gray-600 mb-4">
                  Your face will be used for secure authentication during voting
                </p>

                {!showCamera && !capturedImage && (
                  <Button
                    type="button"
                    onClick={startCamera}
                    data-testid="start-camera-btn"
                    className="w-full bg-[#059669] hover:bg-[#047857] text-white"
                  >
                    <Camera className="mr-2 w-5 h-5" />
                    Open Camera to Capture Face
                  </Button>
                )}

                {showCamera && (
                  <div className="space-y-4">
                    <div className="webcam-container relative">
                      <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
                      <div className="scan-line"></div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        onClick={capturePhoto}
                        data-testid="capture-photo-btn"
                        className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
                      >
                        Capture Photo
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          if (stream) {
                            stream.getTracks().forEach(track => track.stop());
                          }
                          setShowCamera(false);
                        }}
                        variant="outline"
                        data-testid="cancel-camera-btn"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                )}

                {capturedImage && (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden border-4 border-[#059669]">
                      <img src={capturedImage} alt="Captured face" className="w-full" data-testid="captured-image" />
                    </div>
                    <Button
                      type="button"
                      onClick={retakePhoto}
                      data-testid="retake-photo-btn"
                      variant="outline"
                      className="w-full"
                    >
                      Retake Photo
                    </Button>
                  </div>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading || !capturedImage}
                data-testid="register-submit-btn"
                className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white py-6 text-lg"
              >
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <UserPlus className="mr-2 w-5 h-5" />
                    Complete Registration
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-[#1e3a8a] font-semibold hover:underline"
                  data-testid="login-link"
                >
                  Login here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default UserRegister;
