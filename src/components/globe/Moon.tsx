// components/globe/Moon.tsx

'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useUIStore } from '@/store/uiStore';
import { getMoon3DPosition } from '@/lib/utils/astronomy';

export default function Moon() {
  const moonRef = useRef<THREE.Mesh>(null);
  const currentTime = useUIStore((state) => state.currentTime);

  // 실제 시간 기반 달 위치 계산
  useEffect(() => {
    const moonPos = getMoon3DPosition(currentTime);
    
    if (moonRef.current) {
      moonRef.current.position.set(moonPos.x, moonPos.y, moonPos.z);
      // 지구를 향하도록 회전 (조석 고정)
      moonRef.current.lookAt(0, 0, 0);
    }
  }, [currentTime]);

  return (
    <mesh ref={moonRef}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial
        color="#C0C0C0"
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}
