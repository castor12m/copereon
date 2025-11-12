// lib/satellite/calculator.ts

import * as satellite from 'satellite.js';
import type {
  Satellite,
  SatellitePosition,
  GeographicCoordinates,
  ECEFCoordinates,
  ECICoordinates,
  VelocityVector,
  LookAngles,
  GroundStation,
  GroundTrackPoint
} from '@/types/satellite';

/**
 * TLE 데이터로부터 위성 레코드 생성
 */
export function parseTLE(tle1: string, tle2: string) {
  try {
    return satellite.twoline2satrec(tle1, tle2);
  } catch (error) {
    console.error('TLE parsing error:', error);
    return null;
  }
}

/**
 * 특정 시간의 위성 위치 계산
 */
export function calculateSatellitePosition(
  sat: Satellite,
  date: Date
): SatellitePosition | null {
  const satrec = parseTLE(sat.tle.line1, sat.tle.line2);
  if (!satrec) return null;

  // SGP4 전파 계산
  const positionAndVelocity = satellite.propagate(satrec, date);

  if (!positionAndVelocity.position || typeof positionAndVelocity.position === 'boolean') {
    return null;
  }

  const positionEci = positionAndVelocity.position as satellite.EciVec3<number>;
  const velocityEci = positionAndVelocity.velocity as satellite.EciVec3<number>;

  // GMST 계산 (Greenwich Mean Sidereal Time)
  const gmst = satellite.gstime(date);

  // ECI to Geographic 변환
  const positionGd = satellite.eciToGeodetic(positionEci, gmst);

  // 위도, 경도, 고도 추출
  const geographic: GeographicCoordinates = {
    latitude: satellite.degreesLat(positionGd.latitude),
    longitude: satellite.degreesLong(positionGd.longitude),
    altitude: positionGd.height
  };

  // ECI 좌표
  const eci: ECICoordinates = {
    x: positionEci.x,
    y: positionEci.y,
    z: positionEci.z
  };

  // ECEF 좌표 (ECI to ECEF)
  const positionEcf = satellite.eciToEcf(positionEci, gmst);
  const ecef: ECEFCoordinates = {
    x: positionEcf.x,
    y: positionEcf.y,
    z: positionEcf.z
  };

  // 속도 벡터
  const velocity: VelocityVector = {
    x: velocityEci.x,
    y: velocityEci.y,
    z: velocityEci.z
  };

  return {
    satelliteId: sat.id,
    timestamp: date,
    geographic,
    ecef,
    eci,
    velocity
  };
}

/**
 * 여러 위성의 위치를 한 번에 계산
 */
export function calculateMultipleSatellitePositions(
  satellites: Satellite[],
  date: Date
): SatellitePosition[] {
  return satellites
    .map(sat => calculateSatellitePosition(sat, date))
    .filter((pos): pos is SatellitePosition => pos !== null);
}

/**
 * Ground Track 포인트 계산 (과거/미래 궤적)
 */
export function calculateGroundTrack(
  sat: Satellite,
  startDate: Date,
  durationMinutes: number,
  stepSeconds: number = 10
): GroundTrackPoint[] {
  const satrec = parseTLE(sat.tle.line1, sat.tle.line2);
  if (!satrec) return [];

  const points: GroundTrackPoint[] = [];
  const steps = (durationMinutes * 60) / stepSeconds;

  for (let i = 0; i <= steps; i++) {
    const currentDate = new Date(startDate.getTime() + i * stepSeconds * 1000);
    const positionAndVelocity = satellite.propagate(satrec, currentDate);

    if (!positionAndVelocity.position || typeof positionAndVelocity.position === 'boolean') {
      continue;
    }

    const positionEci = positionAndVelocity.position as satellite.EciVec3<number>;
    const gmst = satellite.gstime(currentDate);
    const positionGd = satellite.eciToGeodetic(positionEci, gmst);

    points.push({
      latitude: satellite.degreesLat(positionGd.latitude),
      longitude: satellite.degreesLong(positionGd.longitude),
      timestamp: currentDate
    });
  }

  return points;
}

/**
 * 지상국에서 위성까지의 Look Angles 계산
 */
export function calculateLookAngles(
  satellitePosition: SatellitePosition,
  groundStation: GroundStation
): LookAngles {
  const observerGd: satellite.GeodeticLocation = {
    latitude: satellite.degreesToRadians(groundStation.latitude),
    longitude: satellite.degreesToRadians(groundStation.longitude),
    height: groundStation.altitude / 1000 // meters to km
  };

  const positionEcf = {
    x: satellitePosition.ecef.x,
    y: satellitePosition.ecef.y,
    z: satellitePosition.ecef.z
  };

  const lookAngles = satellite.ecfToLookAngles(observerGd, positionEcf);

  return {
    azimuth: lookAngles.azimuth * (180 / Math.PI), // 라디안을 degree로 변환
    elevation: lookAngles.elevation * (180 / Math.PI), // 라디안을 degree로 변환
    range: lookAngles.rangeSat
  };
}

/**
 * 위성이 지상국에서 보이는지 확인
 */
export function isSatelliteVisible(
  satellitePosition: SatellitePosition,
  groundStation: GroundStation
): boolean {
  const lookAngles = calculateLookAngles(satellitePosition, groundStation);
  const minElevation = groundStation.minElevation || 0;
  return lookAngles.elevation >= minElevation;
}

/**
 * 위성 속도 계산 (km/s)
 */
export function calculateSatelliteSpeed(velocity: VelocityVector): number {
  return Math.sqrt(
    velocity.x * velocity.x +
    velocity.y * velocity.y +
    velocity.z * velocity.z
  );
}

/**
 * 위성 궤도 주기 계산 (분)
 */
export function calculateOrbitalPeriod(sat: Satellite): number | null {
  const satrec = parseTLE(sat.tle.line1, sat.tle.line2);
  if (!satrec || !satrec.no) return null;

  // Mean motion (revolutions per day) to period (minutes)
  const meanMotion = satrec.no * 60 / (2 * Math.PI); // Convert to rev/min
  return 1 / meanMotion; // Period in minutes
}
