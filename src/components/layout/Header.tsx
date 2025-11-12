// components/layout/Header.tsx

'use client';

import { useUIStore } from '@/store/uiStore';
import { Menu, Satellite, Map, Globe, BarChart3 } from 'lucide-react';

interface HeaderProps {
  viewMode: '2d' | '3d' | 'chart';
  setViewMode: (mode: '2d' | '3d' | 'chart') => void;
}

export default function Header({ viewMode, setViewMode }: HeaderProps) {
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

      {/* Center Section - View Mode Toggle */}
      <div className="flex-1 flex justify-center">
        <div className="flex bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode('2d')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md transition-all
              ${viewMode === '2d' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-300 hover:text-white'
              }
            `}
            aria-label="2D Map View"
          >
            <Map className="w-5 h-5" />
            <span className="font-medium">2D 지도</span>
          </button>

          <button
            onClick={() => setViewMode('3d')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md transition-all
              ${viewMode === '3d' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-300 hover:text-white'
              }
            `}
            aria-label="3D Globe View"
          >
            <Globe className="w-5 h-5" />
            <span className="font-medium">3D 지구</span>
          </button>

          <button
            onClick={() => setViewMode('chart')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md transition-all
              ${viewMode === 'chart' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-300 hover:text-white'
              }
            `}
            aria-label="Chart View"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">차트</span>
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <div className="text-sm text-gray-400" suppressHydrationWarning>
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
