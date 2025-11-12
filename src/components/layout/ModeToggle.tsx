// components/layout/ModeToggle.tsx

'use client';

import { useUIStore } from '@/store/uiStore';
import { Map, Globe } from 'lucide-react';

export default function ModeToggle() {
  const viewMode = useUIStore((state) => state.viewMode);
  const setViewMode = useUIStore((state) => state.setViewMode);

  return (
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
    </div>
  );
}
