// src/layouts/OrganizerLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Organizer from '../pages/organizerPage/Organizer';

const OrganizerLayout = () => {
  return (
    <div className="flex">
      <Organizer />
      <main className="p-4 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default OrganizerLayout;
