// components/map/GroundStationMarker.tsx

'use client';

import { CircleMarker, Popup, Tooltip } from 'react-leaflet';
import type { GroundStation } from '@/types/satellite';
import { useSatelliteStore } from '@/store/satelliteStore';

interface GroundStationMarkerProps {
  station: GroundStation;
}

export default function GroundStationMarker({ station }: GroundStationMarkerProps) {
  const selectGroundStation = useSatelliteStore((state) => state.selectGroundStation);
  const selectedGroundStationId = useSatelliteStore((state) => state.selectedGroundStationId);

  const isSelected = station.id === selectedGroundStationId;

  return (
    <CircleMarker
      center={[station.latitude, station.longitude]}
      radius={isSelected ? 10 : 6}
      pathOptions={{
        fillColor: '#22c55e',
        fillOpacity: isSelected ? 1 : 0.7,
        color: '#86efac',
        weight: isSelected ? 3 : 2
      }}
      eventHandlers={{
        click: () => {
          selectGroundStation(isSelected ? null : station.id);
        }
      }}
    >
      {/* 호버 툴팁 */}
      <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
        <div className="text-xs">
          <div className="font-bold">{station.name}</div>
        </div>
      </Tooltip>

      {/* 클릭 팝업 */}
      <Popup>
        <div className="text-sm space-y-2 min-w-[200px]">
          <div className="font-bold text-base border-b border-gray-600 pb-2">
            📡 {station.name}
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">위도:</span>
              <span className="font-mono">{station.latitude.toFixed(4)}°</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">경도:</span>
              <span className="font-mono">{station.longitude.toFixed(4)}°</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">고도:</span>
              <span className="font-mono">{station.altitude} m</span>
            </div>

            {station.minElevation !== undefined && (
              <div className="flex justify-between">
                <span className="text-gray-400">최소 고도각:</span>
                <span className="font-mono">{station.minElevation}°</span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-gray-600">
            <span className="inline-block px-2 py-1 bg-green-600 rounded text-xs">
              Ground Station
            </span>
          </div>
        </div>
      </Popup>
    </CircleMarker>
  );
}
