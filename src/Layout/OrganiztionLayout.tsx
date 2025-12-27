// src/layouts/OrganizerLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Organizer from '../pages/organizerPage/Organizer'; // Your sidebar layout

const OrganizerLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <Organizer /> {/* This already includes sidebar */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default OrganizerLayout;