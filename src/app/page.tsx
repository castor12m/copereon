// app/page.tsx

'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSatelliteStore } from '@/store/satelliteStore';
import { useUIStore } from '@/store/uiStore';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import TimeControl from '@/components/ui/TimeControl';
import tleData from '@/data/tle-data.json';

// Dynamic imports for code splitting
const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-lg">Loading Map...</div>
    </div>
  )
});

const GlobeView = dynamic(() => import('@/components/globe/GlobeView'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-lg">Loading 3D View...</div>
    </div>
  )
});

const ChartView = dynamic(() => import('@/components/charts/ChartView'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-lg">Loading Charts...</div>
    </div>
  )
});

type ViewMode = '2d' | '3d' | 'chart';

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('2d');
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const setSatellites = useSatelliteStore((state) => state.setSatellites);
  const setGroundStations = useSatelliteStore((state) => state.setGroundStations);

  // 초기 데이터 로드
  useEffect(() => {
    setSatellites(tleData.satellites);
    setGroundStations(tleData.groundStations);
  }, [setSatellites, setGroundStations]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <Header viewMode={viewMode} setViewMode={setViewMode} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {isSidebarOpen && (
          <aside className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto flex-shrink-0">
            <Sidebar />
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* View Content */}
          <div className="flex-1 overflow-hidden">
            {viewMode === '2d' && <MapView />}
            {viewMode === '3d' && <GlobeView />}
            {viewMode === 'chart' && <ChartView />}
          </div>

          {/* Time Control - 항상 표시 */}
          <div className="flex-shrink-0">
            <TimeControl />
          </div>
        </main>
      </div>
    </div>
  );
}
