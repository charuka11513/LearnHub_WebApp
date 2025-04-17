import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
const Layout: React.FC = () => {
  return <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6 max-w-5xl">
        <Outlet />
      </main>
    </div>;
};
export default Layout;