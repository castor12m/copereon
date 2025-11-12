// components/map/MapView.tsx

'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useSatelliteStore } from '@/store/satelliteStore';
import { useSatelliteUpdater } from '@/lib/hooks/useSatelliteUpdater';
import SatelliteMarker from './SatelliteMarker';
import GroundTrack from './GroundTrack';
import GroundStationMarker from './GroundStationMarker';

/**
 * 선택된 위성으로 지도 중심 이동
 */
function MapController() {
  const map = useMap();
  const selectedSatelliteId = useSatelliteStore((state) => state.selectedSatelliteId);
  const satellitePositions = useSatelliteStore((state) => state.satellitePositions);

  useEffect(() => {
    if (selectedSatelliteId) {
      const position = satellitePositions.get(selectedSatelliteId);
      if (position) {
        map.setView(
          [position.geographic.latitude, position.geographic.longitude],
          4,
          { animate: true }
        );
      }
    }
  }, [selectedSatelliteId, satellitePositions, map]);

  return null;
}

export default function MapView() {
  const satellites = useSatelliteStore((state) => state.satellites);
  const satellitePositions = useSatelliteStore((state) => state.satellitePositions);
  const groundStations = useSatelliteStore((state) => state.groundStations);
  const selectedSatelliteId = useSatelliteStore((state) => state.selectedSatelliteId);

  // 실시간 위성 위치 업데이트
  useSatelliteUpdater();

  return (
    <div className="w-full h-full">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={10}
        className="w-full h-full"
        zoomControl={true}
        worldCopyJump={true}
      >
        {/* 타일 레이어 - 다크 테마 */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          noWrap={false}
        />

        {/* 지도 컨트롤러 */}
        <MapController />

        {/* 위성 마커 및 Ground Track */}
        {satellites.map((satellite) => {
          const position = satellitePositions.get(satellite.id);
          if (!position) return null;

          const isSelected = satellite.id === selectedSatelliteId;

          return (
            <div key={satellite.id}>
              {/* 위성 마커 */}
              <SatelliteMarker
                satellite={satellite}
                position={position}
                isSelected={isSelected}
              />

              {/* Ground Track (선택된 위성만) */}
              {isSelected && (
                <GroundTrack
                  satellite={satellite}
                  currentPosition={position}
                />
              )}
            </div>
          );
        })}

        {/* 지상국 마커 */}
        {groundStations.map((station) => (
          <GroundStationMarker key={station.id} station={station} />
        ))}
      </MapContainer>

      {/* 범례 */}
      <div className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-90 p-4 rounded-lg shadow-lg z-[1000]">
        <h3 className="text-sm font-bold mb-2">범례</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>일반 위성</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span>선택된 위성</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>지상국</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-yellow-400"></div>
            <span>Ground Track</span>
          </div>
        </div>
      </div>
    </div>
  );
}
