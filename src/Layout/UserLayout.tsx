// src/layouts/UserLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UserLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16"> {/* pt-16 to offset fixed navbar */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;