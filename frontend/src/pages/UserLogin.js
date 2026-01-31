import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Camera, LogIn, Landmark, ScanFace, X, CheckCircle2 } from 'lucide-react';
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
  const [videoReady, setVideoReady] = useState(false);
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
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(e => console.error("Error playing video:", e));
          setVideoReady(true);
        };
      }
      setShowCamera(true);
      setVideoReady(false);
    } catch (error) {
      console.error('Camera error:', error);
      toast.error('Camera access denied. You can still login with credentials.');
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

      ctx.setTransform(-1, 0, 0, 1, canvas.width, 0);
      ctx.drawImage(video, 0, 0);
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageData);

      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setShowCamera(false);
      toast.success('Identity verified!');
    }
  };

  const skipFaceCapture = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
    setCapturedImage(null);
    toast.info('Proceeding with credentials only.');
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
        face_image: capturedImage || null
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success(`Welcome back, ${response.data.user.name}!`);
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

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 animate-fade-in">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Landmark className="w-12 h-12 text-[#1e3a8a] mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-[#1e3a8a]">SmartBallot</h1>
          <p className="text-gray-600">Voter Authentication Portal</p>
        </div>

        <Card className="glass border-t-4 border-t-[#1e3a8a] shadow-2xl overflow-hidden hover-card">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div className="pt-6 border-t font-semibold">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm flex items-center gap-2">
                    <ScanFace className="w-4 h-4 text-[#1e3a8a]" />
                    Face Identity (Secure Login)
                  </span>
                  {capturedImage && <CheckCircle2 className="text-green-500 w-5 h-5" />}
                </div>

                {!showCamera && !capturedImage && (
                  <Button
                    type="button"
                    onClick={startCamera}
                    className="w-full bg-[#059669] hover:bg-[#047857] py-6 rounded-xl shadow-md"
                  >
                    <Camera className="mr-2" /> Verify Face Identity
                  </Button>
                )}

                {showCamera && (
                  <div className="space-y-4 animate-scale-in">
                    <div className="relative bg-black rounded-xl overflow-hidden aspect-video flex items-center justify-center border-2 border-[#1e3a8a]/20 shadow-inner">
                      <video
                        ref={videoRef} onCanPlay={() => setVideoReady(true)}
                        autoPlay playsInline muted
                        className={`w-full h-full object-cover ${videoReady ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
                      />
                      {!videoReady && <div className="spinner"></div>}
                      {videoReady && <div className="scan-line"></div>}
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" onClick={capturePhoto} disabled={!videoReady} className="flex-1 bg-[#1e3a8a] py-6 rounded-xl font-bold">
                        {videoReady ? 'Verify Identity' : 'Initializing...'}
                      </Button>
                      <Button type="button" onClick={skipFaceCapture} variant="outline" className="py-6 rounded-xl">Skip</Button>
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
                  </div>
                )}
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-[#1e3a8a] py-8 text-xl font-bold shadow-xl hover:bg-[#1e40af] transition-all rounded-xl">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="spinner border-2 w-5 h-5"></div>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-6 h-6" />
                    <span>Login Securely</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center pt-6 border-t font-medium text-gray-500">
              Don't have an account? {' '}
              <button
                onClick={() => navigate('/register')}
                className="text-[#1e3a8a] border-b-2 border-transparent hover:border-[#1e3a8a] transition-all pb-1"
              >
                Register here
              </button>
            </div>
          </CardContent>
        </Card>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default UserLogin;
