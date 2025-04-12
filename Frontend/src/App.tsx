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
    // Check if OAuth flow completed by fetching user data
    fetch('http://localhost:8080/api/users/oauth-callback', {
      method: 'GET',
      credentials: 'include', // Include cookies/session
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('OAuth authentication failed');
        }
        return response.json();
      })
      .then((data) => {
        setUser(data); // Store user in AuthContext
        navigate('/');
      })
      .catch((error) => {
        console.error('OAuth callback error:', error);
        navigate('/login?error=oauth_failed');
      });
  }, [navigate, setUser]);

  return <div>Loading...</div>;
};