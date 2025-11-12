// components/globe/CameraController.tsx

'use client';

import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useSatelliteStore } from '@/store/satelliteStore';

/**
 * Geographic 좌표를 3D 카테시안 좌표로 변환
 */
function geographicToCartesian(
  latitude: number,
  longitude: number,
  altitude: number
): THREE.Vector3 {
  const earthRadius = 1;
  const altitudeScale = 6371;
  
  const phi = (90 - latitude) * (Math.PI / 180);
  const theta = (longitude + 180) * (Math.PI / 180);
  
  const radius = earthRadius + (altitude / altitudeScale) * 0.3;
  
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return new THREE.Vector3(x, y, z);
}

export default function CameraController() {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  
  const selectedSatelliteId = useSatelliteStore((state) => state.selectedSatelliteId);
  const satellitePositions = useSatelliteStore((state) => state.satellitePositions);

  // 선택된 위성으로 카메라 이동
  useEffect(() => {
    if (selectedSatelliteId && controlsRef.current) {
      const position = satellitePositions.get(selectedSatelliteId);
      if (position) {
        const target = geographicToCartesian(
          position.geographic.latitude,
          position.geographic.longitude,
          position.geographic.altitude
        );

        // 부드러운 카메라 이동
        const startPosition = camera.position.clone();
        const startTarget = controlsRef.current.target.clone();
        
        const duration = 1000; // 1초
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // easeInOutCubic
          const t = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

          // 카메라 위치 보간
          const direction = target.clone().sub(startTarget).normalize();
          const distance = 0.5;
          const newPosition = target.clone().add(direction.multiplyScalar(distance));
          
          camera.position.lerpVectors(startPosition, newPosition, t);
          controlsRef.current.target.lerpVectors(startTarget, target, t);
          controlsRef.current.update();

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        animate();
      }
    }
  }, [selectedSatelliteId, satellitePositions, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      rotateSpeed={0.5}
      zoomSpeed={0.8}
      minDistance={1.5}
      maxDistance={10}
      enablePan={true}
    />
  );
}
