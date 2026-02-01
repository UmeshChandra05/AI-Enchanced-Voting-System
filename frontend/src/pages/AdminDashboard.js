import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ShieldCheck, LogOut, Users, TrendingUp, Vote, AlertTriangle, PlusCircle, Trash2, BarChart3, CheckCircle2, Camera, X } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({});
  const [elections, setElections] = useState([]);
  const [voters, setVoters] = useState([]);
  const [fraudData, setFraudData] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fraudMetrics, setFraudMetrics] = useState(null);

  // Form states
  const [electionForm, setElectionForm] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: ''
  });

  const [candidateForm, setCandidateForm] = useState({
    name: '',
    party: '',
    election_id: '',
    image_url: '',
    description: ''
  });
  const [candidateImage, setCandidateImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('admin');

    if (!token || !adminData) {
      navigate('/admin/login');
      return;
    }

    setAdmin(JSON.parse(adminData));
    fetchAllData(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchAllData = async (token) => {
    try {
      await Promise.all([
        fetchStats(token),
        fetchElections(token),
        fetchVoters(token)
      ]);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (token) => {
    try {
      const response = await axios.get(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Stats fetch error:', error);
    }
  };

  const fetchElections = async (token) => {
    try {
      const response = await axios.get(`${API}/admin/elections`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setElections(response.data.elections || []);
    } catch (error) {
      console.error('Elections fetch error:', error);
    }
  };

  const fetchVoters = async (token) => {
    try {
      const response = await axios.get(`${API}/admin/voters`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVoters(response.data.voters || []);
    } catch (error) {
      console.error('Voters fetch error:', error);
    }
  };

  const fetchCandidates = async (electionId, token) => {
    try {
      const response = await axios.get(`${API}/elections/${electionId}/candidates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidates(response.data.candidates || []);
    } catch (error) {
      toast.error('Failed to fetch candidates');
    }
  };

  const fetchResults = async (electionId, token) => {
    try {
      const response = await axios.get(`${API}/admin/results/${electionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(response.data);
    } catch (error) {
      toast.error('Failed to fetch results');
    }
  };

  const fetchFraudData = async (token) => {
    try {
      const response = await axios.get(`${API}/admin/fraud/detect`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFraudData(response.data.suspicious_votes || []);
      setFraudMetrics(response.data.analysis_metrics || null);
    } catch (error) {
      toast.error('Failed to fetch fraud data');
    }
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const response = await axios.post(
        `${API}/admin/elections`,
        electionForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Election created successfully!');
        setElectionForm({ title: '', description: '', start_date: '', end_date: '' });
        fetchElections(token);
      }
    } catch (error) {
      toast.error('Failed to create election');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }

      setCandidateImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setCandidateForm({ ...candidateForm, image_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setCandidateImage(null);
    setImagePreview(null);
    setCandidateForm({ ...candidateForm, image_url: '' });
  };

  const handleCreateCandidate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    if (!candidateForm.election_id) {
      toast.error('Please select an election');
      return;
    }

    try {
      const response = await axios.post(
        `${API}/admin/candidates`,
        candidateForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Candidate added successfully!');
        setCandidateForm({ name: '', party: '', election_id: '', image_url: '', description: '' });
        setCandidateImage(null);
        setImagePreview(null);
        if (selectedElection) {
          fetchCandidates(selectedElection, token);
        }
      }
    } catch (error) {
      toast.error('Failed to add candidate');
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    const token = localStorage.getItem('adminToken');

    if (!window.confirm('Are you sure you want to delete this candidate?')) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API}/admin/candidates/${candidateId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Candidate deleted');
        if (selectedElection) {
          fetchCandidates(selectedElection, token);
        }
      }
    } catch (error) {
      toast.error('Failed to delete candidate');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-dashboard">
      {/* Header */}
      <div className="bg-[#1e3a8a] text-white py-6 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: 'Merriweather, serif' }}>Admin Dashboard</h1>
              <p className="text-blue-200 text-sm">Election Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold">{admin?.name}</p>
              <p className="text-sm text-blue-200">{admin?.email}</p>
            </div>
            <Button
              onClick={handleLogout}
              data-testid="admin-logout-btn"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card data-testid="stat-users">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Voters</p>
                  <p className="text-3xl font-bold text-[#1e3a8a]">{stats.total_users || 0}</p>
                </div>
                <Users className="w-12 h-12 text-[#1e3a8a] opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-elections">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Elections</p>
                  <p className="text-3xl font-bold text-[#059669]">{stats.total_elections || 0}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-[#059669] opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-active">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Elections</p>
                  <p className="text-3xl font-bold text-[#ea580c]">{stats.active_elections || 0}</p>
                </div>
                <Vote className="w-12 h-12 text-[#ea580c] opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-votes">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Votes</p>
                  <p className="text-3xl font-bold text-[#1e3a8a]">{stats.total_votes || 0}</p>
                </div>
                <BarChart3 className="w-12 h-12 text-[#1e3a8a] opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gender Stats */}
        {stats.gender_stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Object.entries(stats.gender_stats).map(([gender, count]) => (
              <Card key={gender} className="border-l-4 border-l-[#1e3a8a]/40 bg-white/50 backdrop-blur-sm">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">{gender} Voters</p>
                    <p className="text-2xl font-bold text-gray-800">{count}</p>
                  </div>
                  <div className="p-3 bg-[#1e3a8a]/5 rounded-xl">
                    <Users className="w-6 h-6 text-[#1e3a8a]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="elections" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border rounded-lg p-1">
            <TabsTrigger value="elections" data-testid="tab-elections">Elections</TabsTrigger>
            <TabsTrigger value="candidates" data-testid="tab-candidates">Candidates</TabsTrigger>
            <TabsTrigger value="voters" data-testid="tab-voters">Voters</TabsTrigger>
            <TabsTrigger value="results" data-testid="tab-results">Results</TabsTrigger>
            <TabsTrigger value="fraud" data-testid="tab-fraud">Fraud Detection</TabsTrigger>
          </TabsList>

          {/* Elections Tab */}
          <TabsContent value="elections">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-t-4 border-t-[#1e3a8a]">
                <CardHeader>
                  <CardTitle>Create New Election</CardTitle>
                  <CardDescription>Add a new election to the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateElection} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Election Title *</Label>
                      <Input
                        id="title"
                        data-testid="election-title-input"
                        placeholder="e.g., General Elections 2025"
                        value={electionForm.title}
                        onChange={(e) => setElectionForm({ ...electionForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        data-testid="election-description-input"
                        placeholder="Election description"
                        value={electionForm.description}
                        onChange={(e) => setElectionForm({ ...electionForm, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="start_date">Start Date *</Label>
                      <Input
                        id="start_date"
                        type="date"
                        data-testid="election-start-input"
                        value={electionForm.start_date}
                        onChange={(e) => setElectionForm({ ...electionForm, start_date: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="end_date">End Date *</Label>
                      <Input
                        id="end_date"
                        type="date"
                        data-testid="election-end-input"
                        value={electionForm.end_date}
                        onChange={(e) => setElectionForm({ ...electionForm, end_date: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" data-testid="create-election-btn" className="w-full bg-[#1e3a8a] hover:bg-[#1e40af]">
                      <PlusCircle className="mr-2 w-4 h-4" />
                      Create Election
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>All Elections</CardTitle>
                  <CardDescription>{elections.length} election(s) in system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {elections.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No elections created yet</p>
                    ) : (
                      elections.map((election) => (
                        <div
                          key={election.id}
                          className="border rounded-lg p-4 hover:bg-gray-50"
                          data-testid={`election-item-${election.id}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-lg">{election.title}</h4>
                              <p className="text-sm text-gray-600">{election.description}</p>
                              <div className="mt-2 text-xs text-gray-500">
                                <p>Start: {new Date(election.start_date).toLocaleDateString()}</p>
                                <p>End: {new Date(election.end_date).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${election.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                              }`}>
                              {election.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Candidates Tab */}
          <TabsContent value="candidates">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-t-4 border-t-[#059669]">
                <CardHeader>
                  <CardTitle>Add Candidate</CardTitle>
                  <CardDescription>Add a candidate to an election</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateCandidate} className="space-y-4">
                    <div>
                      <Label htmlFor="candidate_name">Candidate Name *</Label>
                      <Input
                        id="candidate_name"
                        data-testid="candidate-name-input"
                        placeholder="Full name"
                        value={candidateForm.name}
                        onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="party">Party *</Label>
                      <Input
                        id="party"
                        data-testid="candidate-party-input"
                        placeholder="Political party"
                        value={candidateForm.party}
                        onChange={(e) => setCandidateForm({ ...candidateForm, party: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="election_select">Select Election *</Label>
                      <select
                        id="election_select"
                        data-testid="candidate-election-select"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={candidateForm.election_id}
                        onChange={(e) => {
                          setCandidateForm({ ...candidateForm, election_id: e.target.value });
                          setSelectedElection(e.target.value);
                          if (e.target.value) {
                            fetchCandidates(e.target.value, localStorage.getItem('adminToken'));
                          }
                        }}
                        required
                      >
                        <option value="">Choose election</option>
                        {elections.map((election) => (
                          <option key={election.id} value={election.id}>
                            {election.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="candidate_image">Candidate Symbol/Photo *</Label>
                      <div className="space-y-3">
                        {imagePreview ? (
                          <div className="relative inline-block">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-32 h-32 object-cover rounded-xl border-2 border-[#059669] shadow-md"
                            />
                            <button
                              type="button"
                              onClick={clearImage}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#059669] transition-colors cursor-pointer">
                            <input
                              type="file"
                              id="candidate_image"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                            <label htmlFor="candidate_image" className="cursor-pointer">
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                  <Camera className="w-6 h-6 text-gray-400" />
                                </div>
                                <p className="text-sm font-medium text-gray-700">Upload Candidate Image</p>
                                <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                              </div>
                            </label>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 italic">Or enter image URL below:</p>
                        <Input
                          id="image_url"
                          placeholder="https://example.com/image.jpg"
                          value={candidateImage ? '' : candidateForm.image_url}
                          onChange={(e) => setCandidateForm({ ...candidateForm, image_url: e.target.value })}
                          disabled={!!candidateImage}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Candidate Note / bio (Optional)</Label>
                      <Textarea
                        id="description"
                        placeholder="Additional info about candidate"
                        value={candidateForm.description}
                        onChange={(e) => setCandidateForm({ ...candidateForm, description: e.target.value })}
                      />
                    </div>
                    <Button type="submit" data-testid="add-candidate-btn" className="w-full bg-[#059669] hover:bg-[#047857]">
                      <PlusCircle className="mr-2 w-4 h-4" />
                      Add Candidate
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Candidates List</CardTitle>
                  <CardDescription>
                    {selectedElection ? `${candidates.length} candidate(s)` : 'Select an election to view candidates'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {!selectedElection ? (
                      <p className="text-gray-500 text-center py-8">Select an election from the form</p>
                    ) : candidates.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No candidates added yet</p>
                    ) : (
                      candidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50"
                          data-testid={`candidate-item-${candidate.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={candidate.image_url}
                              alt={candidate.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <h4 className="font-semibold">{candidate.name}</h4>
                              <p className="text-sm text-gray-600">{candidate.party}</p>
                              {candidate.description && (
                                <p className="text-xs text-blue-600 mt-1 italic">Note: {candidate.description}</p>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={() => handleDeleteCandidate(candidate.id)}
                            data-testid={`delete-candidate-${candidate.id}`}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Voters Tab */}
          <TabsContent value="voters">
            <Card>
              <CardHeader>
                <CardTitle>Registered Voters</CardTitle>
                <CardDescription>{voters.length} voter(s) registered</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full" data-testid="voters-table">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Name</th>
                        <th className="text-left p-3 font-semibold">Gender</th>
                        <th className="text-left p-3 font-semibold">Email</th>
                        <th className="text-left p-3 font-semibold">Aadhaar</th>
                        <th className="text-left p-3 font-semibold">Status</th>
                        <th className="text-left p-3 font-semibold">Voted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {voters.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-8 text-gray-500">
                            No voters registered yet
                          </td>
                        </tr>
                      ) : (
                        voters.map((voter) => (
                          <tr key={voter.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium text-gray-900">{voter.name}</td>
                            <td className="p-3">
                              <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold uppercase ring-1 ring-slate-200">
                                {voter.gender || 'Other'}
                              </span>
                            </td>
                            <td className="p-3">{voter.email}</td>
                            <td className="p-3">{voter.aadhaar.slice(0, 4)}****{voter.aadhaar.slice(-4)}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${voter.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {voter.status}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${voter.voted
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                                }`}>
                                {voter.voted ? 'Yes' : 'No'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Election Results</CardTitle>
                <CardDescription>View vote counts and winners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="results_election">Select Election</Label>
                    <select
                      id="results_election"
                      data-testid="results-election-select"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      onChange={(e) => {
                        if (e.target.value) {
                          fetchResults(e.target.value, localStorage.getItem('adminToken'));
                        } else {
                          setResults(null);
                        }
                      }}
                    >
                      <option value="">Choose election</option>
                      {elections.map((election) => (
                        <option key={election.id} value={election.id}>
                          {election.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {results && (
                    <div className="space-y-4 mt-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          <strong>Total Votes Cast:</strong> {results.total_votes}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {results.candidates.map((candidate, index) => (
                          <div
                            key={candidate.id}
                            className={`border rounded-lg p-4 ${index === 0 ? 'border-[#059669] bg-green-50' : ''
                              }`}
                            data-testid={`result-candidate-${candidate.id}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {index === 0 && <span className="text-2xl">🏆</span>}
                                {candidate.image_url ? (
                                  <img
                                    src={candidate.image_url}
                                    alt={candidate.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                    No Img
                                  </div>
                                )}
                                <div>
                                  <h4 className="font-semibold text-lg">{candidate.name}</h4>
                                  <p className="text-sm text-gray-600">{candidate.party}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-3xl font-bold text-[#1e3a8a]">
                                  {candidate.vote_count}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {results.total_votes > 0
                                    ? `${((candidate.vote_count / results.total_votes) * 100).toFixed(1)}%`
                                    : '0%'
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!results && (
                    <p className="text-gray-500 text-center py-8">Select an election to view results</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fraud Detection Tab */}
          <TabsContent value="fraud">
            <Card className="border-t-4 border-t-[#ea580c]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-[#ea580c]" />
                  Fraud Detection System
                </CardTitle>
                <CardDescription>ML-based anomaly detection using Isolation Forest</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => fetchFraudData(localStorage.getItem('adminToken'))}
                  data-testid="run-fraud-detection-btn"
                  className="mb-6 bg-[#ea580c] hover:bg-[#c2410c]"
                >
                  <AlertTriangle className="mr-2 w-4 h-4" />
                  Run Fraud Detection
                </Button>

                <div className="space-y-4">
                  {fraudMetrics && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 bg-white border rounded-xl shadow-sm text-center">
                        <p className="text-xs text-gray-500 uppercase font-black mb-1">Total Analyzed</p>
                        <p className="text-2xl font-bold text-[#1e3a8a]">{fraudMetrics.total_analyzed}</p>
                      </div>
                      <div className="p-4 bg-white border rounded-xl shadow-sm text-center">
                        <p className="text-xs text-gray-500 uppercase font-black mb-1">Anomalies</p>
                        <p className="text-2xl font-bold text-[#ea580c]">{fraudMetrics.anomalies_found}</p>
                      </div>
                      <div className="p-4 bg-[#059669]/5 border border-[#059669]/20 rounded-xl shadow-sm text-center">
                        <p className="text-xs text-[#059669] uppercase font-black mb-1">Accuracy Score</p>
                        <p className="text-2xl font-black text-[#059669]">{fraudMetrics.accuracy_score}</p>
                      </div>
                      <div className="p-4 bg-[#1e3a8a]/5 border border-[#1e3a8a]/20 rounded-xl shadow-sm text-center">
                        <p className="text-xs text-[#1e3a8a] uppercase font-black mb-1">Confidence</p>
                        <p className="text-2xl font-black text-[#1e3a8a]">{fraudMetrics.confidence_level}</p>
                      </div>
                    </div>
                  )}

                  {fraudData.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                      <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
                      <p className="text-gray-600 font-medium">No suspicious activity detected</p>
                      <p className="text-sm text-gray-400 mt-1">System is monitoring all transactions in real-time</p>
                    </div>
                  ) : (
                    <div>
                      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 flex items-center gap-4 animate-pulse">
                        <div className="p-3 bg-red-100 rounded-full">
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <p className="text-red-900 font-bold text-lg">
                            Critical Alert: {fraudData.length} suspicious vote(s) detected
                          </p>
                          <p className="text-red-700 text-sm">Immediate review recommended for identified anomalies</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                        {fraudData.map((vote, index) => (
                          <div
                            key={index}
                            className="border border-red-100 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
                            data-testid={`fraud-item-${index}`}
                          >
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                            <div className="flex items-center justify-between relative z-10">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-black uppercase rounded">Anomaly #{index + 1}</span>
                                  <span className="text-gray-300">|</span>
                                  <span className="text-xs text-gray-500">{new Date(vote.timestamp).toLocaleString()}</span>
                                </div>
                                <p className="font-bold text-gray-900">User UID: {vote.user_id}</p>
                                <p className="text-sm text-gray-600 mt-1 font-mono bg-gray-50 p-1 rounded">SID: {vote.session_id || 'N/A'}</p>
                              </div>
                              <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
