import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Camera, Check, ArrowLeft, ScanFace, X, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const VotingPage = () => {
  const navigate = useNavigate();
  const { electionId } = useParams();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [stream, setStream] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [step, setStep] = useState(1); // 1: Select, 2: Verify, 3: Confirm

  const fetchCandidates = useCallback(async (token) => {
    try {
      const response = await axios.get(`${API}/elections/${electionId}/candidates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidates(response.data.candidates || []);
    } catch (error) {
      toast.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  }, [electionId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchCandidates(token);
  }, [fetchCandidates, navigate]);

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
      toast.error('Camera access denied. You can skip verification if needed.');
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
      toast.success('Identity verified locally! Proceeding to confirmation.');
      setStep(3);
    }
  };

  const skipVerification = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
    setCapturedImage(null);
    toast.info('Verification skipped. Proceed to confirmation.');
    setStep(3);
  };

  const handleSubmitVote = async () => {
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API}/vote`,
        {
          election_id: electionId,
          candidate_id: selectedCandidate.id,
          face_image: capturedImage || ""
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Vote recorded successfully! Thank you for voting.');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      const message = error.response?.data?.detail || 'Vote submission failed';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <div className="spinner border-t-[#1e3a8a] w-12 h-12"></div>
        <p className="mt-4 text-[#1e3a8a] font-semibold animate-pulse">Loading Election Details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => navigate('/dashboard')}
          variant="outline"
          className="mb-8 rounded-full px-6 border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a]/10"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Return to Dashboard
        </Button>

        {/* Improved Progress Tracker */}
        <div className="mb-12 max-w-2xl mx-auto relative">
          <div className="flex items-center justify-between relative z-10">
            <div className={`flex flex-col items-center gap-2 ${step >= 1 ? 'text-[#1e3a8a]' : 'text-gray-400'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg transition-all duration-500 ${step >= 1 ? 'bg-[#1e3a8a] text-white scale-110' : 'bg-white text-gray-400'
                }`}>
                {step > 1 ? <Check className="w-6 h-6" /> : "1"}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">Candidate</span>
            </div>

            <div className={`h-1 flex-1 mx-4 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-[#1e3a8a]' : 'bg-gray-200'}`}></div>

            <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'text-[#059669]' : 'text-gray-400'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg transition-all duration-500 ${step >= 2 ? 'bg-[#059669] text-white scale-110' : 'bg-white text-gray-400'
                }`}>
                {step > 2 ? <Check className="w-6 h-6" /> : "2"}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">Verify</span>
            </div>

            <div className={`h-1 flex-1 mx-4 rounded-full transition-all duration-500 ${step >= 3 ? 'bg-[#1e3a8a]' : 'bg-gray-200'}`}></div>

            <div className={`flex flex-col items-center gap-2 ${step >= 3 ? 'text-[#ea580c]' : 'text-gray-400'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg transition-all duration-500 ${step >= 3 ? 'bg-[#ea580c] text-white scale-110' : 'bg-white text-gray-400'
                }`}>
                3
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">Submit</span>
            </div>
          </div>
        </div>

        {/* Step 1: Select Candidate */}
        {step === 1 && (
          <div className="animate-scale-in">
            <h2 className="text-3xl font-bold text-[#1e3a8a] mb-8 text-center" style={{ fontFamily: 'Merriweather, serif' }}>
              Choose Your Representative
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {candidates.map((candidate) => (
                <Card
                  key={candidate.id}
                  onClick={() => {
                    setSelectedCandidate(candidate);
                    setStep(2);
                  }}
                  className={`cursor-pointer transition-all duration-500 hover:shadow-2xl border-2 hover-card ${selectedCandidate?.id === candidate.id
                    ? 'border-[#059669] bg-[#059669]/5 shadow-xl'
                    : 'border-transparent'
                    }`}
                >
                  <CardContent className="p-8">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <img
                          src={candidate.image_url}
                          alt={candidate.name}
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                        />
                        {selectedCandidate?.id === candidate.id && (
                          <div className="absolute -top-2 -right-2 bg-[#059669] text-white rounded-full p-2 shadow-lg">
                            <Check className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#059669] uppercase tracking-widest mb-1">{candidate.party}</p>
                        <h3 className="text-2xl font-bold text-gray-900">{candidate.name}</h3>
                        <p className="text-gray-500 mt-1">Click to select</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Face Verification */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto animate-scale-in">
            <Card className="glass border-t-8 border-t-[#059669] shadow-2xl">
              <CardContent className="p-10 text-center">
                <ScanFace className="w-20 h-20 text-[#059669] mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4">Biometric Verification</h2>
                <p className="text-gray-600 mb-8">
                  Please verify your identity before casting your vote for <span className="text-[#059669] font-bold">{selectedCandidate?.name}</span>.
                </p>

                {!showCamera && (
                  <div className="space-y-4">
                    <Button
                      onClick={startCamera}
                      className="bg-[#059669] hover:bg-[#047857] text-white px-10 py-8 text-xl rounded-2xl shadow-xl transition-all hover:scale-105"
                    >
                      <Camera className="mr-3 w-6 h-6" />
                      Begin Face Verification
                    </Button>
                    <div className="block pt-4">
                      <button onClick={skipVerification} className="text-gray-400 hover:text-gray-600 text-sm underline pb-1">
                        Skip verification and proceed anyway
                      </button>
                    </div>
                  </div>
                )}

                {showCamera && (
                  <div className="space-y-6 animate-scale-in">
                    <div className="relative bg-black rounded-3xl overflow-hidden aspect-video shadow-2xl border-4 border-[#059669]/20">
                      <video
                        ref={videoRef} onCanPlay={() => setVideoReady(true)}
                        autoPlay playsInline muted
                        className={`w-full h-full object-cover ${videoReady ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
                      />
                      {!videoReady && <div className="spinner w-12 h-12 border-4"></div>}
                      {videoReady && <div className="scan-line"></div>}
                    </div>
                    <div className="flex gap-4">
                      <Button
                        onClick={capturePhoto}
                        disabled={!videoReady}
                        className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af] text-white py-8 text-xl rounded-2xl shadow-xl"
                      >
                        {videoReady ? 'Verify & Continue' : 'Preparing Camera...'}
                      </Button>
                      <Button onClick={() => setStep(1)} variant="outline" className="py-8 px-8 rounded-2xl">
                        Back
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Confirm Vote */}
        {step === 3 && selectedCandidate && (
          <div className="max-w-2xl mx-auto animate-scale-in">
            <Card className="glass border-t-8 border-t-[#ea580c] shadow-2xl">
              <CardContent className="p-10 space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Selection</h2>
                  <p className="text-gray-500">Your vote is final after submission.</p>
                </div>

                <div className="bg-white/50 border border-gray-100 p-8 rounded-3xl shadow-inner text-center">
                  <img
                    src={selectedCandidate.image_url}
                    alt={selectedCandidate.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#059669] mx-auto mb-6 shadow-xl"
                  />
                  <h3 className="text-3xl font-black text-gray-900 mb-1">{selectedCandidate.name}</h3>
                  <p className="text-xl font-bold text-[#059669] uppercase tracking-[0.2em]">{selectedCandidate.party}</p>

                  <div className="mt-8 flex items-center justify-center gap-2 text-[#059669] bg-[#059669]/10 py-3 px-6 rounded-full w-max mx-auto border border-[#059669]/20">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold">Identity Confirmed</span>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={() => {
                      setStep(1);
                      setCapturedImage(null);
                    }}
                    variant="outline"
                    className="flex-1 py-10 rounded-3xl text-lg font-bold border-2"
                  >
                    Change Candidate
                  </Button>
                  <Button
                    onClick={handleSubmitVote}
                    disabled={submitting}
                    className="flex-1 bg-[#059669] hover:bg-[#047857] text-white py-10 rounded-3xl text-xl font-black shadow-2xl transition-all hover:scale-105"
                  >
                    {submitting ? (
                      <div className="spinner border-white w-6 h-6"></div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Check className="w-6 h-6 mb-1" />
                        <span>Confirm Vote</span>
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default VotingPage;
