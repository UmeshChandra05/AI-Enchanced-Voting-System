import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Camera, LogIn, Landmark } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const UserLogin = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      toast.error('Camera access denied');
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
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setShowCamera(false);
      toast.success('Face captured!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, {
        email: formData.email,
        password: formData.password,
        face_image: capturedImage || null  // Send null if no face captured
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Login successful! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const skipFaceVerification = () => {
    setCapturedImage(null);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
    toast.info('Face verification skipped. You can login with email and password only.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe] py-12 px-4" data-testid="login-page">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Landmark className="w-10 h-10 text-[#1e3a8a]" />
            <h1 className="text-3xl md:text-4xl font-bold text-[#1e3a8a]" style={{ fontFamily: 'Merriweather, serif' }}>
              SmartBallot
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Voter Login</p>
        </div>

        <Card className="border-t-4 border-t-[#1e3a8a]">
          <CardHeader>
            <CardTitle className="text-2xl">Secure Login</CardTitle>
            <CardDescription>Enter credentials and verify your face</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  data-testid="login-email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  data-testid="login-password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base">Face Verification (Optional)</Label>
                  <span className="text-xs text-gray-500">For enhanced security</span>
                </div>
                
                {!showCamera && !capturedImage && (
                  <div className="space-y-3">
                    <Button
                      type="button"
                      onClick={startCamera}
                      data-testid="login-start-camera-btn"
                      className="w-full bg-[#059669] hover:bg-[#047857] text-white"
                    >
                      <Camera className="mr-2 w-5 h-5" />
                      Verify Face to Login
                    </Button>
                    <p className="text-xs text-center text-gray-500">
                      Or skip and login with email/password only
                    </p>
                  </div>
                )}

                {showCamera && (
                  <div className="space-y-4">
                    <div className="webcam-container relative">
                      <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
                      <div className="scan-line"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        onClick={skipFaceVerification}
                        variant="outline"
                        className="w-full"
                      >
                        Skip
                      </Button>
                      <Button
                        type="button"
                        onClick={capturePhoto}
                        data-testid="login-capture-btn"
                        className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
                      >
                        Capture
                      </Button>
                    </div>
                  </div>
                )}

                {capturedImage && (
                  <div className="space-y-4">
                    <div className="rounded-lg overflow-hidden border-4 border-[#059669]">
                      <img src={capturedImage} alt="Captured" className="w-full" data-testid="login-captured-image" />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        onClick={() => {
                          setCapturedImage(null);
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        Remove
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setCapturedImage(null);
                          startCamera();
                        }}
                        data-testid="login-retake-btn"
                        variant="outline"
                        className="flex-1"
                      >
                        Retake
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                data-testid="login-submit-btn"
                className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white py-6 text-lg"
              >
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <LogIn className="mr-2 w-5 h-5" />
                    Login Securely
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-[#1e3a8a] font-semibold hover:underline"
                  data-testid="register-link"
                >
                  Register here
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

export default UserLogin;
