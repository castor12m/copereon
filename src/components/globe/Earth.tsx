// components/globe/Earth.tsx

'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useUIStore } from '@/store/uiStore';
import { getEarthRotation } from '@/lib/utils/astronomy';

/**
 * 3D 지구 컴포넌트 - 실제 자전 반영
 */
export default function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const currentTime = useUIStore((state) => state.currentTime);

  // 실제 시간 기반 지구 자전
  useEffect(() => {
    if (earthRef.current) {
      const rotation = getEarthRotation(currentTime);
      earthRef.current.rotation.y = rotation * (Math.PI / 180);
    }
  }, [currentTime]);

  return (
    <mesh ref={earthRef} position={[0, 0, 0]}>
      {/* 지구 구체 */}
      <sphereGeometry args={[1, 64, 64]} />
      
      {/* 기본 파란색-녹색 지구 (텍스처 대신) */}
      <meshStandardMaterial
        color="#2563eb"
        roughness={0.7}
        metalness={0.1}
      />
      
      {/* 대기권 효과 */}
      <mesh scale={1.01}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#4da6ff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </mesh>
  );
}
