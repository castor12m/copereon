// components/globe/OrbitLine.tsx

'use client';

import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { Satellite, SatellitePosition } from '@/types/satellite';
import { calculateGroundTrack } from '@/lib/satellite/calculator';

interface OrbitLineProps {
  satellite: Satellite;
  currentPosition: SatellitePosition;
}

/**
 * Geographic 좌표를 3D 카테시안 좌표로 변환
 */
function geographicToCartesian(
  latitude: number,
  longitude: number,
  altitude: number
): [number, number, number] {
  const earthRadius = 1;
  const altitudeScale = 6371; // 지구 반지름 (km)
  
  const phi = (90 - latitude) * (Math.PI / 180);
  const theta = (longitude + 180) * (Math.PI / 180);
  
  const radius = earthRadius + (altitude / altitudeScale) * 0.3;
  
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return [x, y, z];
}

export default function OrbitLine({ satellite, currentPosition }: OrbitLineProps) {
  // 궤도 포인트 계산
  const orbitPoints = useMemo(() => {
    const durationMinutes = 180; // 3시간 (약 2궤도)
    const startDate = new Date(currentPosition.timestamp.getTime() - 90 * 60 * 1000);
    
    const track = calculateGroundTrack(satellite, startDate, durationMinutes, 20);
    
    return track.map(point => 
      geographicToCartesian(point.latitude, point.longitude, currentPosition.geographic.altitude)
    );
  }, [satellite, currentPosition]);

  if (orbitPoints.length === 0) return null;

  return (
    <Line
      points={orbitPoints}
      color="#facc15"
      lineWidth={1.5}
      opacity={0.6}
      transparent
    />
  );
}
