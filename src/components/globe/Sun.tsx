// components/globe/Sun.tsx

'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useUIStore } from '@/store/uiStore';
import { getSun3DPosition } from '@/lib/utils/astronomy';

export default function Sun() {
  const sunRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const currentTime = useUIStore((state) => state.currentTime);

  // 실제 시간 기반 태양 위치 계산
  useEffect(() => {
    const sunPos = getSun3DPosition(currentTime, 15);
    
    if (sunRef.current) {
      sunRef.current.position.set(sunPos.x, sunPos.y, sunPos.z);
    }
    if (glowRef.current) {
      glowRef.current.position.set(sunPos.x, sunPos.y, sunPos.z);
    }
    if (lightRef.current) {
      lightRef.current.position.set(sunPos.x, sunPos.y, sunPos.z);
    }
  }, [currentTime]);

  return (
    <>
      {/* 태양 본체 */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#FDB813" />
      </mesh>

      {/* 태양 광휘 (Glow) */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial
          color="#FDB813"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      {/* 태양 빛 */}
      <directionalLight
        ref={lightRef}
        intensity={1.5}
        castShadow
      />
    </>
  );
}
