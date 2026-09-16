import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { Navbar } from './Navbar';
import { useAuth } from '../../app/providers';

export const DashboardLayout: React.FC = () => {
  const { currentUser, setRole, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!currentUser) return null;

  return (
    <div 
      className="flex h-screen overflow-hidden text-slate-200 bg-cover bg-center relative"
      style={{ backgroundImage: 'url(/images/dashboard-bg.jpg)' }}
    >
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] z-0 pointer-events-none"></div>
      
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:flex shrink-0 z-10">
        <Sidebar
          role={currentUser.role}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile Slide-over Sidebar Drawer */}
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        role={currentUser.role}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden z-10">
        <Navbar
          currentUser={currentUser}
          onRoleChange={setRole}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onLogout={logout}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 dashboard-theme">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
