// components/Organizer.tsx or pages/Organizer.tsx
import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaFolder, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { X, Menu, LayoutDashboard } from 'lucide-react';
import axios from 'axios';
import { useEventContext } from '../../context/EventContext';

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  children: {
    subTitle: string;
    to: string;
  }[];
}

const Organizer: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number[]>([]);
  const { user, BASE_URL, getUserProfile, isSidebarVisible, setIsSidebarVisible } = useEventContext();
  const navigate = useNavigate();

  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  const sidebar: SidebarItem[] = [
    {
      title: 'Venue',
      icon: <FaMapMarkerAlt className="w-5 h-5" />,
      children: [
        { subTitle: 'Create Venue', to: 'create-venue' },
        { subTitle: 'Venue List', to: 'venue-list' },
      ],
    },
    {
      title: 'Category',
      icon: <FaFolder className="w-5 h-5" />,
      children: [
        { subTitle: 'Create Category', to: 'create-category' },
        { subTitle: 'Category List', to: 'category-list' },
      ],
    },
    {
      title: 'Event',
      icon: <FaCalendarAlt className="w-5 h-5" />,
      children: [
        { subTitle: 'Create Event', to: 'create-event' },
        { subTitle: 'Event List', to: 'event-list' },
      ],
    },
  ];

  const handleShowChildren = (index: number) => {
    setActiveIndex((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/users/logout`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        className={`h-screen fixed sm:left-0 top-0 w-64 border-r border-r-gray-200 z-10 bg-white overflow-hidden transition-all duration-300 ${
          isSidebarVisible ? 'left-0' : '-left-64'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 px-2 py-3">
            <X
              onClick={() => setIsSidebarVisible((prev: boolean) => !prev)}
              className="text-gray-600 cursor-pointer sm:hidden"
              size={24}
            />
            <FaUser className="hidden sm:block text-blue-600" size={26} />
            <span className="text-xl font-bold text-gray-800">Organizer</span>
          </div>
          <div className="px-1 bg-white pt-3">
            <div className="pl-2 py-1.5 hover:bg-gray-100 cursor-pointer flex gap-2 items-center">
              <LayoutDashboard className="text-indigo-600" size={20} />
              <Link
                onClick={() => setIsSidebarVisible((prev: boolean) => !prev)}
                to="/organizer/event-analytics"
                className="text-gray-800 font-medium"
              >
                Dashboard
              </Link>
            </div>

            {sidebar.map((side, index) => (
              <div key={index}>
                <div
                  onClick={() => handleShowChildren(index)}
                  className="py-1.5 rounded-sm pl-2 cursor-pointer hover:bg-gray-200 text-gray-800 font-medium flex items-center gap-1.5 text-md"
                >
                  {side.icon} {side.title}
                </div>
                {activeIndex.includes(index) && (
                  <div className="pl-7.5">
                    {side.children.map((child, i) => (
                      <div key={i} className="py-1 pl-2 rounded-sm text-sm">
                        <Link
                          onClick={() => setIsSidebarVisible((prev: boolean) => !prev)}
                          className="hover:text-blue-500 duration-150"
                          to={child.to}
                        >
                          {child.subTitle}
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between fixed top-0 left-64 right-0 px-4 py-3 border-b bg-white border-b-gray-200 z-10">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
            <img className="w-full h-full object-cover" src={`${BASE_URL}/uploads/${user?.image}`} alt="Profile" />
          </div>
          <div>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-gray-600 text-sm">{user?.email}</p>
          </div>
        </div>
        <div>
          {user?.email && (
            <button
              onClick={handleLogout}
              className="bg-blue-700 text-sm text-white rounded-sm px-4 py-1.5 hover:bg-blue-800 cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      <Outlet />
    </>
  );
};

export default Organizer;