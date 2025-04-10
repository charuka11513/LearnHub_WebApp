import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import VideoPage from './pages/VideoPage';
import PostVideoPage from './pages/PostVideoPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
export function App() {
  return <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute>
                <Layout />
              </ProtectedRoute>}>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="videos" element={<VideoPage />} />
            <Route path="post/:postId/videos" element={<PostVideoPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>;
}