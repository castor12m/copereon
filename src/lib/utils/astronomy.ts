// lib/utils/astronomy.ts

/**
 * 천문학적 계산 유틸리티
 */

/**
 * 율리우스 날짜 계산
 */
export function getJulianDate(date: Date): number {
  const time = date.getTime();
  return (time / 86400000) + 2440587.5;
}

/**
 * 그리니치 항성시(GMST) 계산
 */
export function getGMST(date: Date): number {
  const jd = getJulianDate(date);
  const t = (jd - 2451545.0) / 36525.0;
  
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 
             0.000387933 * t * t - t * t * t / 38710000.0;
  
  // 0-360도로 정규화
  gmst = gmst % 360;
  if (gmst < 0) gmst += 360;
  
  return gmst;
}

/**
 * 태양의 적경/적위 계산 (간단한 버전)
 */
export function getSunPosition(date: Date) {
  const jd = getJulianDate(date);
  const n = jd - 2451545.0; // J2000.0 기준일로부터의 일수
  
  // 평균 황경
  const L = (280.460 + 0.9856474 * n) % 360;
  
  // 평균 근점 이각
  const g = (357.528 + 0.9856003 * n) % 360;
  const gRad = g * Math.PI / 180;
  
  // 황경
  const lambda = L + 1.915 * Math.sin(gRad) + 0.020 * Math.sin(2 * gRad);
  const lambdaRad = lambda * Math.PI / 180;
  
  // 황도 경사
  const epsilon = 23.439 - 0.0000004 * n;
  const epsilonRad = epsilon * Math.PI / 180;
  
  // 적경 (Right Ascension)
  const ra = Math.atan2(
    Math.cos(epsilonRad) * Math.sin(lambdaRad),
    Math.cos(lambdaRad)
  ) * 180 / Math.PI;
  
  // 적위 (Declination)
  const dec = Math.asin(
    Math.sin(epsilonRad) * Math.sin(lambdaRad)
  ) * 180 / Math.PI;
  
  return { rightAscension: ra, declination: dec };
}

/**
 * 태양의 3D 위치 계산 (지구 중심, Three.js 좌표계)
 */
export function getSun3DPosition(date: Date, distance: number = 15) {
  const sunPos = getSunPosition(date);
  const gmst = getGMST(date);
  
  // 시간각 = GMST - 적경
  const hourAngle = (gmst - sunPos.rightAscension) * Math.PI / 180;
  const dec = sunPos.declination * Math.PI / 180;
  
  // 3D 직교 좌표로 변환
  const x = distance * Math.cos(dec) * Math.cos(hourAngle);
  const y = distance * Math.sin(dec);
  const z = distance * Math.cos(dec) * Math.sin(hourAngle);
  
  return { x, y, z };
}

/**
 * 달의 위치 계산 (간단한 버전)
 */
export function getMoonPosition(date: Date) {
  const jd = getJulianDate(date);
  const t = (jd - 2451545.0) / 36525.0;
  
  // 달의 평균 황경
  const L = (218.316 + 13.176396 * (jd - 2451545.0)) % 360;
  
  // 달의 평균 근점이각
  const M = (134.963 + 13.064993 * (jd - 2451545.0)) % 360;
  const MRad = M * Math.PI / 180;
  
  // 황경 (간단한 섭동 포함)
  const lambda = L + 6.289 * Math.sin(MRad);
  const lambdaRad = lambda * Math.PI / 180;
  
  // 황위
  const beta = 5.128 * Math.sin((93.272 + 13.229350 * (jd - 2451545.0)) * Math.PI / 180);
  const betaRad = beta * Math.PI / 180;
  
  // 지구로부터의 거리 (km)
  const distance = 385000 - 20905 * Math.cos(MRad);
  
  // 황도 경사
  const epsilon = 23.439 - 0.0000004 * (jd - 2451545.0);
  const epsilonRad = epsilon * Math.PI / 180;
  
  // 적경/적위로 변환
  const ra = Math.atan2(
    Math.sin(lambdaRad) * Math.cos(epsilonRad) - Math.tan(betaRad) * Math.sin(epsilonRad),
    Math.cos(lambdaRad)
  );
  
  const dec = Math.asin(
    Math.sin(betaRad) * Math.cos(epsilonRad) + 
    Math.cos(betaRad) * Math.sin(epsilonRad) * Math.sin(lambdaRad)
  );
  
  return { 
    rightAscension: ra * 180 / Math.PI, 
    declination: dec * 180 / Math.PI,
    distance: distance / 100000 // Three.js 스케일로 조정
  };
}

/**
 * 달의 3D 위치 계산 (지구 중심, Three.js 좌표계)
 */
export function getMoon3DPosition(date: Date) {
  const moonPos = getMoonPosition(date);
  const gmst = getGMST(date);
  
  // 시간각
  const hourAngle = (gmst - moonPos.rightAscension) * Math.PI / 180;
  const dec = moonPos.declination * Math.PI / 180;
  const distance = moonPos.distance * 3; // 가시성을 위해 3배 확대
  
  // 3D 직교 좌표로 변환
  const x = distance * Math.cos(dec) * Math.cos(hourAngle);
  const y = distance * Math.sin(dec);
  const z = distance * Math.cos(dec) * Math.sin(hourAngle);
  
  return { x, y, z };
}

/**
 * 지구 자전각 계산 (도 단위)
 */
export function getEarthRotation(date: Date): number {
  const gmst = getGMST(date);
  return -gmst; // Three.js는 Y축 기준 반시계방향이 양수이므로 음수
}
