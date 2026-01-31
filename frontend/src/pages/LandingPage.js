import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ShieldCheck, Vote, UserCheck, ScanFace, Landmark, TrendingUp, Users, CheckCircle2 } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, elections: 0, votes: 0 });

  useEffect(() => {
    // Animate stats
    const interval = setInterval(() => {
      setStats(prev => ({
        users: Math.min(prev.users + 127, 15847),
        elections: Math.min(prev.elections + 1, 45),
        votes: Math.min(prev.votes + 234, 28934)
      }));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative min-h-screen flex items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1760872645959-98d5fdb49287)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e3a8a]/90 to-[#1e3a8a]/70"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <Landmark className="w-12 h-12" />
            <h1 className="text-5xl md:text-6xl font-bold" style={{ fontFamily: 'Merriweather, serif' }}>
              SmartBallot
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl mb-4 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            AI-Enhanced Digital Voting with Secure Face Authentication
          </p>
          
          <p className="text-base md:text-lg mb-12 text-blue-200 max-w-2xl mx-auto">
            One Person. One Vote. Powered by Multi-Factor Authentication, Facial Recognition, and ML-based Fraud Detection.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              onClick={() => navigate('/register')} 
              data-testid="get-started-btn"
              className="bg-[#059669] hover:bg-[#047857] text-white px-8 py-6 text-lg rounded-md shadow-lg font-medium"
            >
              <UserCheck className="mr-2 w-5 h-5" />
              Get Started - Register
            </Button>
            <Button 
              onClick={() => navigate('/login')} 
              data-testid="voter-login-btn"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-2 border-white/30 px-8 py-6 text-lg rounded-md font-medium"
            >
              <Vote className="mr-2 w-5 h-5" />
              Voter Login
            </Button>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 text-center" data-testid="stats-users">
              <Users className="w-10 h-10 mx-auto mb-3 text-green-300" />
              <div className="text-4xl font-bold mb-1">{stats.users.toLocaleString()}</div>
              <div className="text-blue-200">Registered Voters</div>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 text-center" data-testid="stats-elections">
              <TrendingUp className="w-10 h-10 mx-auto mb-3 text-green-300" />
              <div className="text-4xl font-bold mb-1">{stats.elections}</div>
              <div className="text-blue-200">Active Elections</div>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 text-center" data-testid="stats-votes">
              <Vote className="w-10 h-10 mx-auto mb-3 text-green-300" />
              <div className="text-4xl font-bold mb-1">{stats.votes.toLocaleString()}</div>
              <div className="text-blue-200">Votes Cast</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6 bg-white" data-testid="features-section">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#1e3a8a]" style={{ fontFamily: 'Merriweather, serif' }}>
            Secure, Transparent & Accessible
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto text-lg">
            Built with cutting-edge AI and security features to ensure every vote counts
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 border-t-4 border-t-[#1e3a8a] hover:shadow-xl transition-all duration-300" data-testid="feature-aadhaar">
              <ShieldCheck className="w-12 h-12 text-[#059669] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aadhaar Verification</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Secure identity verification linked to Aadhaar for authentic voter registration
              </p>
            </Card>

            <Card className="p-6 border-t-4 border-t-[#059669] hover:shadow-xl transition-all duration-300" data-testid="feature-face-auth">
              <ScanFace className="w-12 h-12 text-[#1e3a8a] mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Face Recognition</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                DeepFace-powered facial authentication prevents impersonation and duplicate voting
              </p>
            </Card>

            <Card className="p-6 border-t-4 border-t-[#ea580c] hover:shadow-xl transition-all duration-300" data-testid="feature-fraud">
              <CheckCircle2 className="w-12 h-12 text-[#ea580c] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fraud Detection</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                ML-based Isolation Forest detects suspicious patterns and anomalies in real-time
              </p>
            </Card>

            <Card className="p-6 border-t-4 border-t-[#059669] hover:shadow-xl transition-all duration-300" data-testid="feature-accessibility">
              <Vote className="w-12 h-12 text-[#059669] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Accessible Voting</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Text-to-speech support makes voting accessible for visually impaired citizens
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 px-6 bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe]" data-testid="how-it-works-section">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#1e3a8a]" style={{ fontFamily: 'Merriweather, serif' }}>
            How It Works
          </h2>

          <div className="space-y-8">
            <div className="flex gap-6 items-start" data-testid="step-1">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Register with Multi-Factor Authentication</h3>
                <p className="text-gray-600 leading-relaxed">
                  Create your account using Aadhaar number, email, password, and capture your face via webcam for biometric registration.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start" data-testid="step-2">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Login with Face Verification</h3>
                <p className="text-gray-600 leading-relaxed">
                  Access your account securely by verifying your identity through live facial recognition matching.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start" data-testid="step-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#ea580c] text-white flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Cast Your Vote Securely</h3>
                <p className="text-gray-600 leading-relaxed">
                  View candidates, verify your face again during voting, and submit your encrypted vote. One person, one vote enforced.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Section */}
      <div className="py-12 px-6 bg-[#1e3a8a] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4">Election Administrator?</h3>
          <p className="mb-6 text-blue-200">Manage elections, monitor voters, and detect fraud from the admin panel</p>
          <Button 
            onClick={() => navigate('/admin/login')} 
            data-testid="admin-login-link"
            className="bg-white text-[#1e3a8a] hover:bg-gray-100 px-6 py-3 rounded-md font-medium"
          >
            Admin Login
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-gray-300 text-center">
        <p>&copy; 2025 SmartBallot - AI-Enhanced Digital Voting System</p>
        <p className="text-sm mt-2">Powered by DeepFace, FastAPI, React & MongoDB</p>
      </footer>

      {/* TTS Button */}
      <button
        onClick={() => speak('SmartBallot - AI Enhanced Digital Voting System. Secure, transparent, and accessible voting for all citizens.')}
        className="tts-button"
        data-testid="tts-button"
        aria-label="Text to speech"
      >
        🔊
      </button>
    </div>
  );
};

export default LandingPage;
