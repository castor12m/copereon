// components/layout/Header.tsx

'use client';

import { useUIStore } from '@/store/uiStore';
import ModeToggle from './ModeToggle';
import { Menu, Satellite } from 'lucide-react';

export default function Header() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2">
          <Satellite className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-xl font-bold">위성 추적 시스템</h1>
            <p className="text-xs text-gray-400">Satellite Tracker</p>
          </div>
        </div>
      </div>

      {/* Center Section */}
      <div className="flex-1 flex justify-center">
        <ModeToggle />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <div className="text-sm text-gray-400">
          {new Date().toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </div>
      </div>
    </header>
  );
}
