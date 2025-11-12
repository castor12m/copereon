// components/globe/Earth.tsx

'use client';

import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

/**
 * 3D 지구 컴포넌트
 */
export default function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);

  // 지구 텍스처 로드
  // 주의: 실제 프로젝트에서는 public/textures/ 폴더에 이미지 파일이 필요합니다
  // 여기서는 간단한 색상으로 대체
  
  // 지구 회전 애니메이션
  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05; // 천천히 회전
    }
  });

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
