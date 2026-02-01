import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Vote, Landmark, LogOut, CheckCircle2, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const VoterDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votedElections, setVotedElections] = useState([]);
  const [isTTSActive, setIsTTSActive] = useState(true);

  const speak = (text) => {
    if (isTTSActive && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      speak(`Welcome ${user.name} to the voting dashboard. You can see active elections here.`);
    }
  }, [loading, user]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchElections(token);
  }, [navigate]);

  const fetchElections = async (token) => {
    try {
      const response = await axios.get(`${API}/elections/active`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setElections(response.data.elections || []);

      // Check vote status for each election
      const statuses = await Promise.all(
        response.data.elections.map(async (election) => {
          try {
            const statusRes = await axios.get(
              `${API}/vote/status/${election.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return { electionId: election.id, hasVoted: statusRes.data.has_voted };
          } catch {
            return { electionId: election.id, hasVoted: false };
          }
        })
      );

      const votedIds = statuses.filter(s => s.hasVoted).map(s => s.electionId);
      setVotedElections(votedIds);
    } catch (error) {
      toast.error('Failed to fetch elections');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const hasVoted = (electionId) => votedElections.includes(electionId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe]" data-testid="voter-dashboard">
      {/* Header */}
      <div className="bg-[#1e3a8a] text-white py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Landmark className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold leading-tight" style={{ fontFamily: 'Merriweather, serif' }}>
                AI-Enhanced Voting System
              </h1>
              <p className="text-blue-200 text-xs italic">with Secure Face Authentication</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newState = !isTTSActive;
                setIsTTSActive(newState);
                if (newState) speak("Voice guidance enabled");
                else window.speechSynthesis.cancel();
              }}
              className="text-white hover:bg-white/10"
            >
              {isTTSActive ? <Volume2 className="w-5 h-5 mx-1" /> : <VolumeX className="w-5 h-5 mx-1" />}
              <span className="text-xs hidden md:inline">{isTTSActive ? "Voice On" : "Voice Off"}</span>
            </Button>
            <div className="text-right">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-blue-200">{user?.email}</p>
            </div>
            <Button
              onClick={handleLogout}
              data-testid="logout-btn"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#1e3a8a] mb-2" style={{ fontFamily: 'Merriweather, serif' }}>
            Active Elections
          </h2>
          <p className="text-gray-600">Select an election to cast your vote</p>
        </div>

        {elections.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Vote className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 text-lg">No active elections at the moment</p>
              <p className="text-gray-500 text-sm mt-2">Check back later for upcoming elections</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {elections.map((election) => (
              <Card
                key={election.id}
                className="border-t-4 border-t-[#1e3a8a] hover:shadow-lg transition-shadow"
                data-testid={`election-card-${election.id}`}
              >
                <CardHeader>
                  <CardTitle className="text-xl">{election.title}</CardTitle>
                  <CardDescription>{election.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">{new Date(election.start_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-medium">{new Date(election.end_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                        {election.status}
                      </span>
                    </div>

                    {hasVoted(election.id) ? (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="font-semibold">You have already voted in this election</span>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => navigate(`/vote/${election.id}`)}
                        data-testid={`vote-btn-${election.id}`}
                        className="w-full mt-4 bg-[#059669] hover:bg-[#047857] text-white py-6"
                      >
                        <Vote className="mr-2 w-5 h-5" />
                        Cast Your Vote
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoterDashboard;
