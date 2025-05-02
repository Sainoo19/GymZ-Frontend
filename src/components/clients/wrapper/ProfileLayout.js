import React, { useState } from 'react';
import SidebarProfile from '../layouts/SidebarProfile';
import { FaBars } from 'react-icons/fa';

function ProfileLayout({ children }) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleMobileSidebar = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Mobile Sidebar Toggle Button */}
            <div className="md:hidden bg-white p-4 shadow-sm sticky top-0 z-30">
                <button
                    onClick={toggleMobileSidebar}
                    className="flex items-center text-gray-700 hover:text-primary"
                >
                    <FaBars className="mr-2" />
                    <span>Menu</span>
                </button>
            </div>

            <div className="flex flex-col md:flex-row flex-grow">
                {/* Sidebar */}
                <SidebarProfile
                    isMobileOpen={isMobileOpen}
                    toggleMobileSidebar={toggleMobileSidebar}
                />

                {/* Overlay when sidebar is open on mobile */}
                {isMobileOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                        onClick={toggleMobileSidebar}
                    ></div>
                )}

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default ProfileLayout;