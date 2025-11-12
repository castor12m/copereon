// components/globe/GlobeView.tsx

'use client';

import { Canvas } from '@react-three/fiber';
import { useSatelliteStore } from '@/store/satelliteStore';
import { useSatelliteUpdater } from '@/lib/hooks/useSatelliteUpdater';
import Earth from './Earth';
import Satellite3D from './Satellite3D';
import OrbitLine from './OrbitLine';
import CameraController from './CameraController';
import Stars from './Stars';

export default function GlobeView() {
  const satellites = useSatelliteStore((state) => state.satellites);
  const satellitePositions = useSatelliteStore((state) => state.satellitePositions);
  const selectedSatelliteId = useSatelliteStore((state) => state.selectedSatelliteId);

  // 실시간 위성 위치 업데이트
  useSatelliteUpdater();

  return (
    <div className="w-full h-full bg-black">
      <Canvas
        camera={{
          position: [3, 1.5, 3],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        gl={{ antialias: true }}
      >
        {/* 조명 */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 3, 5]}
          intensity={1}
          castShadow
        />
        <pointLight position={[-5, -3, -5]} intensity={0.3} />

        {/* 별 배경 */}
        <Stars />

        {/* 지구 */}
        <Earth />

        {/* 위성들 */}
        {satellites.map((satellite) => {
          const position = satellitePositions.get(satellite.id);
          if (!position) return null;

          const isSelected = satellite.id === selectedSatelliteId;

          return (
            <group key={satellite.id}>
              {/* 위성 마커 */}
              <Satellite3D
                satellite={satellite}
                position={position}
                isSelected={isSelected}
              />

              {/* 궤도 라인 (선택된 위성만) */}
              {isSelected && (
                <OrbitLine
                  satellite={satellite}
                  currentPosition={position}
                />
              )}
            </group>
          );
        })}

        {/* 카메라 컨트롤 */}
        <CameraController />
      </Canvas>

      {/* 컨트롤 안내 */}
      <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-90 p-4 rounded-lg shadow-lg z-10">
        <h3 className="text-sm font-bold mb-2">컨트롤</h3>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">마우스 드래그</span>
            <span>회전</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">마우스 휠</span>
            <span>줌</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">우클릭 드래그</span>
            <span>이동</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">위성 클릭</span>
            <span>선택</span>
          </div>
        </div>
      </div>

      {/* 범례 */}
      <div className="absolute top-20 right-4 bg-gray-800 bg-opacity-90 p-4 rounded-lg shadow-lg z-10">
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
            <div className="w-8 h-0.5 bg-yellow-400"></div>
            <span>궤도 라인</span>
          </div>
        </div>
      </div>

      {/* 위성 정보 패널 (선택된 위성) */}
      {selectedSatelliteId && (() => {
        const satellite = satellites.find(s => s.id === selectedSatelliteId);
        const position = satellitePositions.get(selectedSatelliteId);
        
        if (!satellite || !position) return null;

        return (
          <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-90 p-4 rounded-lg shadow-lg z-10 min-w-[250px]">
            <h3 className="text-base font-bold mb-3 border-b border-gray-600 pb-2">
              {satellite.name}
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">위도:</span>
                <span className="font-mono">{position.geographic.latitude.toFixed(4)}°</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">경도:</span>
                <span className="font-mono">{position.geographic.longitude.toFixed(4)}°</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">고도:</span>
                <span className="font-mono">{position.geographic.altitude.toFixed(1)} km</span>
              </div>

              {satellite.category && (
                <div className="pt-2 border-t border-gray-600">
                  <span className="inline-block px-2 py-1 bg-blue-600 rounded text-xs">
                    {satellite.category}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
