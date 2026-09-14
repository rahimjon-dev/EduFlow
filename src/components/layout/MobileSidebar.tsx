import React from 'react';
import { X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import type { UserRole } from '../../types';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose, role }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 left-0 flex max-w-full">
        <div className="relative w-64 shadow-2xl flex flex-col bg-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 z-40"
          >
            <X className="w-5 h-5" />
          </button>
          <Sidebar
            role={role}
            collapsed={false}
            onToggleCollapse={() => {}}
            onCloseMobile={onClose}
          />
        </div>
      </div>
    </div>
  );
};
