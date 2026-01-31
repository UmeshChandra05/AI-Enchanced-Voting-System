import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Camera, Check, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const VotingPage = () => {
  const navigate = useNavigate();
  const { electionId } = useParams();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [stream, setStream] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Select, 2: Verify, 3: Confirm

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchCandidates(token);

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [electionId, navigate]);

  const fetchCandidates = async (token) => {
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
  };

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
      toast.success('Face verified! Proceed to confirm vote.');
      setStep(3);
    }
  };

  const handleSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setStep(2);
  };

  const handleStartVerification = () => {
    startCamera();
  };

  const handleSubmitVote = async () => {
    if (!selectedCandidate || !capturedImage) {
      toast.error('Please complete all steps');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API}/vote`,
        {
          election_id: electionId,
          candidate_id: selectedCandidate.id,
          face_image: capturedImage
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

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe] py-12 px-4" data-testid="voting-page">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/dashboard')}
          variant="outline"
          className="mb-6"
          data-testid="back-to-dashboard-btn"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Dashboard
        </Button>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#1e3a8a]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 1 ? 'bg-[#1e3a8a] text-white' : 'bg-gray-300'
              }`}>
                1
              </div>
              <span className="font-medium hidden sm:inline">Select Candidate</span>
            </div>
            <div className="w-12 h-1 bg-gray-300"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#059669]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 2 ? 'bg-[#059669] text-white' : 'bg-gray-300'
              }`}>
                2
              </div>
              <span className="font-medium hidden sm:inline">Verify Face</span>
            </div>
            <div className="w-12 h-1 bg-gray-300"></div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[#ea580c]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 3 ? 'bg-[#ea580c] text-white' : 'bg-gray-300'
              }`}>
                3
              </div>
              <span className="font-medium hidden sm:inline">Confirm Vote</span>
            </div>
          </div>
        </div>

        {/* Step 1: Select Candidate */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a] mb-6 text-center" style={{ fontFamily: 'Merriweather, serif' }}>
              Select Your Candidate
            </h2>
            
            {candidates.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-gray-600">No candidates available for this election</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {candidates.map((candidate) => (
                  <Card 
                    key={candidate.id}
                    onClick={() => handleSelectCandidate(candidate)}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
                      selectedCandidate?.id === candidate.id 
                        ? 'border-[#059669] ring-4 ring-[#059669]/20' 
                        : 'border-gray-200'
                    }`}
                    data-testid={`candidate-${candidate.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <img 
                          src={candidate.image_url} 
                          alt={candidate.name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                          <p className="text-gray-600">{candidate.party}</p>
                        </div>
                        {selectedCandidate?.id === candidate.id && (
                          <Check className="w-8 h-8 text-[#059669]" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Face Verification */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-t-4 border-t-[#059669]">
              <CardHeader>
                <CardTitle className="text-2xl">Face Verification Required</CardTitle>
                <CardDescription>
                  Verify your identity before casting your vote for <strong>{selectedCandidate?.name}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!showCamera && !capturedImage && (
                  <div className="text-center space-y-4">
                    <p className="text-gray-600">Click below to start face verification</p>
                    <Button
                      onClick={handleStartVerification}
                      data-testid="start-verification-btn"
                      className="bg-[#059669] hover:bg-[#047857] text-white px-8 py-6 text-lg"
                    >
                      <Camera className="mr-2 w-5 h-5" />
                      Start Face Verification
                    </Button>
                  </div>
                )}

                {showCamera && (
                  <div className="space-y-4">
                    <div className="webcam-container relative">
                      <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
                      <div className="scan-line"></div>
                    </div>
                    <Button
                      onClick={capturePhoto}
                      data-testid="verify-capture-btn"
                      className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white py-6 text-lg"
                    >
                      Capture & Verify
                    </Button>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1"
                    data-testid="back-to-select-btn"
                  >
                    Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Confirm Vote */}
        {step === 3 && selectedCandidate && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-t-4 border-t-[#ea580c]">
              <CardHeader>
                <CardTitle className="text-2xl">Confirm Your Vote</CardTitle>
                <CardDescription>Please review your selection before submitting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={selectedCandidate.image_url} 
                      alt={selectedCandidate.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-[#059669]"
                    />
                    <div>
                      <h3 className="text-2xl font-bold">{selectedCandidate.name}</h3>
                      <p className="text-gray-600 text-lg">{selectedCandidate.party}</p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex items-center gap-2 text-green-700">
                      <Check className="w-5 h-5" />
                      <span className="font-semibold">Face verification successful</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> Once submitted, your vote cannot be changed. Please confirm your selection.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setStep(1);
                      setCapturedImage(null);
                    }}
                    variant="outline"
                    className="flex-1"
                    data-testid="cancel-vote-btn"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitVote}
                    disabled={submitting}
                    data-testid="submit-vote-btn"
                    className="flex-1 bg-[#059669] hover:bg-[#047857] text-white py-6 text-lg"
                  >
                    {submitting ? (
                      <div className="spinner"></div>
                    ) : (
                      <>
                        <Check className="mr-2 w-5 h-5" />
                        Confirm & Submit Vote
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      {/* TTS Button */}
      <button
        onClick={() => speak('Voting page. Select a candidate and verify your face to cast your vote securely.')}
        className="tts-button"
        data-testid="voting-tts-button"
        aria-label="Text to speech"
      >
        🔊
      </button>
    </div>
  );
};

export default VotingPage;
