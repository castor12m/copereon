// components/layout/Sidebar.tsx

'use client';

import { useSatelliteStore } from '@/store/satelliteStore';
import { Search, Radio } from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
  const satellites = useSatelliteStore((state) => state.satellites);
  const selectedSatelliteId = useSatelliteStore((state) => state.selectedSatelliteId);
  const selectSatellite = useSatelliteStore((state) => state.selectSatellite);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSatellites = satellites.filter(sat =>
    sat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="위성 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                     text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                     focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Satellite List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {filteredSatellites.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              검색 결과가 없습니다
            </div>
          ) : (
            filteredSatellites.map((satellite) => (
              <button
                key={satellite.id}
                onClick={() => selectSatellite(
                  selectedSatelliteId === satellite.id ? null : satellite.id
                )}
                className={`
                  w-full p-3 mb-2 rounded-lg text-left transition-all
                  ${selectedSatelliteId === satellite.id
                    ? 'bg-blue-600 shadow-lg'
                    : 'bg-gray-700 hover:bg-gray-600'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <Radio className={`
                    w-5 h-5 mt-0.5 flex-shrink-0
                    ${selectedSatelliteId === satellite.id ? 'text-white' : 'text-gray-400'}
                  `} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{satellite.name}</div>
                    <div className="text-sm text-gray-300 mt-1">
                      NORAD: {satellite.noradId}
                    </div>
                    <div className="flex gap-2 mt-2">
                      {satellite.category && (
                        <span className="text-xs px-2 py-1 bg-gray-800 rounded">
                          {satellite.category}
                        </span>
                      )}
                      {satellite.country && (
                        <span className="text-xs px-2 py-1 bg-gray-800 rounded">
                          {satellite.country}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
        총 {satellites.length}개의 위성
      </div>
    </div>
  );
}
