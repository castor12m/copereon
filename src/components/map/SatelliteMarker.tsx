// components/map/SatelliteMarker.tsx

'use client';

import { CircleMarker, Popup, Tooltip } from 'react-leaflet';
import type { Satellite, SatellitePosition } from '@/types/satellite';
import { useSatelliteStore } from '@/store/satelliteStore';
import { calculateSatelliteSpeed } from '@/lib/satellite/calculator';

interface SatelliteMarkerProps {
  satellite: Satellite;
  position: SatellitePosition;
  isSelected: boolean;
}

export default function SatelliteMarker({
  satellite,
  position,
  isSelected
}: SatelliteMarkerProps) {
  const selectSatellite = useSatelliteStore((state) => state.selectSatellite);

  const speed = calculateSatelliteSpeed(position.velocity);
  const { latitude, longitude, altitude } = position.geographic;

  return (
    <CircleMarker
      center={[latitude, longitude]}
      radius={isSelected ? 8 : 5}
      pathOptions={{
        fillColor: isSelected ? '#facc15' : '#3b82f6',
        fillOpacity: isSelected ? 0.9 : 0.7,
        color: isSelected ? '#fef08a' : '#60a5fa',
        weight: isSelected ? 3 : 2
      }}
      eventHandlers={{
        click: () => {
          selectSatellite(isSelected ? null : satellite.id);
        }
      }}
    >
      {/* 호버 툴팁 */}
      <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
        <div className="text-xs">
          <div className="font-bold">{satellite.name}</div>
        </div>
      </Tooltip>

      {/* 클릭 팝업 */}
      <Popup>
        <div className="text-sm space-y-2 min-w-[200px]">
          <div className="font-bold text-base border-b border-gray-600 pb-2">
            {satellite.name}
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">NORAD ID:</span>
              <span className="font-mono">{satellite.noradId}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">위도:</span>
              <span className="font-mono">{latitude.toFixed(4)}°</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">경도:</span>
              <span className="font-mono">{longitude.toFixed(4)}°</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">고도:</span>
              <span className="font-mono">{altitude.toFixed(1)} km</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">속도:</span>
              <span className="font-mono">{speed.toFixed(2)} km/s</span>
            </div>
          </div>

          {satellite.category && (
            <div className="pt-2 border-t border-gray-600">
              <span className="inline-block px-2 py-1 bg-blue-600 rounded text-xs">
                {satellite.category}
              </span>
              {satellite.country && (
                <span className="inline-block ml-2 px-2 py-1 bg-gray-600 rounded text-xs">
                  {satellite.country}
                </span>
              )}
            </div>
          )}
        </div>
      </Popup>
    </CircleMarker>
  );
}
