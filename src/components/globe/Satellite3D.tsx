// components/globe/Satellite3D.tsx

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Satellite, SatellitePosition } from '@/types/satellite';
import { useSatelliteStore } from '@/store/satelliteStore';

interface Satellite3DProps {
  satellite: Satellite;
  position: SatellitePosition;
  isSelected: boolean;
}

/**
 * Geographic 좌표를 3D 카테시안 좌표로 변환
 * 지구 반지름 = 1 단위
 */
function geographicToCartesian(
  latitude: number,
  longitude: number,
  altitude: number
): THREE.Vector3 {
  const earthRadius = 1;
  const altitudeScale = 6371; // 지구 반지름 (km)
  
  // 위도/경도를 라디안으로 변환
  const phi = (90 - latitude) * (Math.PI / 180);
  const theta = (longitude + 180) * (Math.PI / 180);
  
  // 고도를 스케일에 맞게 조정
  const radius = earthRadius + (altitude / altitudeScale) * 0.3;
  
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return new THREE.Vector3(x, y, z);
}

export default function Satellite3D({ satellite, position, isSelected }: Satellite3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const selectSatellite = useSatelliteStore((state) => state.selectSatellite);

  // 위성의 3D 위치 계산
  const satellitePosition = useMemo(() => {
    return geographicToCartesian(
      position.geographic.latitude,
      position.geographic.longitude,
      position.geographic.altitude
    );
  }, [position]);

  // 선택된 위성은 펄스 애니메이션
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      meshRef.current.scale.setScalar(scale);
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1);
    }
  });

  return (
    <group position={satellitePosition}>
      {/* 위성 구체 */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          selectSatellite(isSelected ? null : satellite.id);
        }}
      >
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshStandardMaterial
          color={isSelected ? '#facc15' : '#3b82f6'}
          emissive={isSelected ? '#fef08a' : '#60a5fa'}
          emissiveIntensity={isSelected ? 0.5 : 0.3}
        />
      </mesh>

      {/* HTML 라벨 (선택된 위성만) */}
      {isSelected && (
        <Html
          position={[0, 0.05, 0]}
          center
          distanceFactor={0.5}
          style={{
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          <div className="bg-gray-900 bg-opacity-90 text-white px-2 py-1 rounded text-xs whitespace-nowrap border border-yellow-400">
            {satellite.name}
          </div>
        </Html>
      )}
    </group>
  );
}
