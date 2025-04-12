import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import VideoPage from './pages/VideoPage';
import PostVideoPage from './pages/PostVideoPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="videos" element={<VideoPage />} />
            <Route path="post/:postId/videos" element={<PostVideoPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setError } = useContext(AuthContext);

  React.useEffect(() => {
    console.log('Fetching /api/users/current');
    fetch('http://localhost:8080/api/users/current', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        console.log('Response status:', response.status);
        console.log('Response headers:', [...response.headers.entries()]);
        return response.text().then((text) => {
          console.log('Response text:', text || 'Empty response');
          if (!text) {
            return null; // Handle empty response
          }
          try {
            return JSON.parse(text);
          } catch (e) {
            console.error('JSON parse error:', e);
            throw new Error('Invalid JSON response');
          }
        });
      })
      .then((data) => {
        console.log('Parsed data:', data);
        if (data && data.id && data.email) {
          setUser(data);
          setError(null);
          console.log('User set, navigating to /');
          navigate('/');
        } else {
          console.log('No valid user data');
          throw new Error('No user data returned');
        }
      })
      .catch((error) => {
        console.error('Authentication error:', error);
        setError(error.message || 'Authentication failed');
        navigate('/login?error=auth_failed');
      });
  }, [navigate, setUser, setError]);

  return <div>Loading...</div>;
};