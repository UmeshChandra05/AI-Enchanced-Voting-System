import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { ShieldCheck, Landmark } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/admin/login`, {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('admin', JSON.stringify(response.data.admin));
        toast.success('Admin login successful!');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      }
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] to-[#059669] py-12 px-4" data-testid="admin-login-page">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8 text-white">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShieldCheck className="w-12 h-12" />
            <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Merriweather, serif' }}>
              Admin Portal
            </h1>
          </div>
          <p className="text-blue-100 text-lg">Election Management System</p>
        </div>

        <Card className="border-t-4 border-t-[#ea580c]">
          <CardHeader>
            <CardTitle className="text-2xl">Administrator Login</CardTitle>
            <CardDescription>Access election management dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  data-testid="admin-email"
                  placeholder="admin@voting.gov.in"
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
                  data-testid="admin-password"
                  placeholder="Enter admin password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                data-testid="admin-login-submit"
                className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white py-6 text-lg"
              >
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 w-5 h-5" />
                    Login as Administrator
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Default credentials: admin@voting.gov.in / admin123
              </p>
              <button
                onClick={() => navigate('/')}
                className="text-[#1e3a8a] font-semibold hover:underline mt-2"
                data-testid="back-home-link"
              >
                Back to Home
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
