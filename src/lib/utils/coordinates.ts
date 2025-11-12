// lib/utils/coordinates.ts

import * as THREE from 'three';

/**
 * 지구 상수
 */
export const EARTH_RADIUS_KM = 6371;
export const EARTH_RADIUS_3D = 1; // 3D 씬에서의 지구 반지름

/**
 * Geographic 좌표를 3D 카테시안 좌표로 변환
 * @param latitude - 위도 (degrees)
 * @param longitude - 경도 (degrees)
 * @param altitude - 고도 (km)
 * @returns THREE.Vector3
 */
export function geographicToCartesian(
  latitude: number,
  longitude: number,
  altitude: number
): THREE.Vector3 {
  // 위도/경도를 라디안으로 변환
  const phi = (90 - latitude) * (Math.PI / 180);
  const theta = (longitude + 180) * (Math.PI / 180);
  
  // 고도를 스케일에 맞게 조정
  const radius = EARTH_RADIUS_3D + (altitude / EARTH_RADIUS_KM) * 0.3;
  
  // 구면 좌표를 카테시안 좌표로 변환
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return new THREE.Vector3(x, y, z);
}

/**
 * 카테시안 좌표를 Geographic 좌표로 변환
 * @param position - THREE.Vector3
 * @returns { latitude, longitude, altitude }
 */
export function cartesianToGeographic(position: THREE.Vector3): {
  latitude: number;
  longitude: number;
  altitude: number;
} {
  const radius = position.length();
  
  // 고도 계산
  const altitude = (radius - EARTH_RADIUS_3D) / 0.3 * EARTH_RADIUS_KM;
  
  // 위도 계산
  const latitude = 90 - Math.acos(position.y / radius) * (180 / Math.PI);
  
  // 경도 계산
  let longitude = Math.atan2(position.z, position.x) * (180 / Math.PI) - 180;
  
  // 경도를 -180 ~ 180 범위로 정규화
  if (longitude < -180) longitude += 360;
  if (longitude > 180) longitude -= 360;
  
  return { latitude, longitude, altitude };
}

/**
 * 두 지점 간의 거리 계산 (Haversine formula)
 * @param lat1 - 첫 번째 지점의 위도
 * @param lon1 - 첫 번째 지점의 경도
 * @param lat2 - 두 번째 지점의 위도
 * @param lon2 - 두 번째 지점의 경도
 * @returns 거리 (km)
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = EARTH_RADIUS_KM;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}
