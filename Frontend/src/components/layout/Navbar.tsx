import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, VideoIcon, UserIcon, LogOutIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
const Navbar: React.FC = () => {
  const {
    logout
  } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-blue-600">
            LearnShare
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex flex-col items-center text-gray-700 hover:text-blue-600">
              <HomeIcon size={24} />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link to="/videos" className="flex flex-col items-center text-gray-700 hover:text-blue-600">
              <VideoIcon size={24} />
              <span className="text-xs mt-1">Videos</span>
            </Link>
            <Link to="/profile" className="flex flex-col items-center text-gray-700 hover:text-blue-600">
              <UserIcon size={24} />
              <span className="text-xs mt-1">Profile</span>
            </Link>
            <button onClick={handleLogout} className="flex flex-col items-center text-gray-700 hover:text-blue-600">
              <LogOutIcon size={24} />
              <span className="text-xs mt-1">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>;
};
export default Navbar;