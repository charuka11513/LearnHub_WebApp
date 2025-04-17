import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const provider = window.location.pathname.includes('google') ? 'google' : 'github';
        const res = await fetch(`http://localhost:8080/api/auth/login/oauth2/code/${provider}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('OAuth callback failed');
        const data = await res.json();
        if (data.success) {
          const userData = {
            id: data.id,
            name: data.name,
            email: data.email,
            avatarUrl: `https://i.pravatar.cc/150?u=${data.email}`,
          };
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('token', data.token);
          navigate('/home');
        } else {
          navigate('/login?error=true');
        }
      } catch (err) {
        navigate('/login?error=true');
      }
    };

    handleCallback();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;