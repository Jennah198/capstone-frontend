// src/layouts/AdminLayout.tsx (optional)
import React from 'react';
import { Outlet } from 'react-router-dom';
import Admin from '../pages/adminPage/Admin';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <Admin />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;