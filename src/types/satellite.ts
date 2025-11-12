// types/satellite.ts

/**
 * TLE (Two-Line Element) 데이터 구조
 */
export interface TLEData {
  name: string;
  line1: string;
  line2: string;
}

/**
 * 위성 정보
 */
export interface Satellite {
  id: string;
  name: string;
  noradId: number;
  tle: TLEData;
  category?: string;
  country?: string;
}

/**
 * 지리 좌표 (위도, 경도, 고도)
 */
export interface GeographicCoordinates {
  latitude: number;  // degrees
  longitude: number; // degrees
  altitude: number;  // km
}

/**
 * 지심 좌표계 (ECEF - Earth-Centered, Earth-Fixed)
 */
export interface ECEFCoordinates {
  x: number; // km
  y: number; // km
  z: number; // km
}

/**
 * 지심 관성 좌표계 (ECI - Earth-Centered Inertial)
 */
export interface ECICoordinates {
  x: number; // km
  y: number; // km
  z: number; // km
}

/**
 * 속도 벡터
 */
export interface VelocityVector {
  x: number; // km/s
  y: number; // km/s
  z: number; // km/s
}

/**
 * 위성 위치 정보 (시간별)
 */
export interface SatellitePosition {
  satelliteId: string;
  timestamp: Date;
  geographic: GeographicCoordinates;
  ecef: ECEFCoordinates;
  eci: ECICoordinates;
  velocity: VelocityVector;
}

/**
 * 방위각/고도각 (Look Angles)
 */
export interface LookAngles {
  azimuth: number;   // degrees (0-360)
  elevation: number; // degrees (-90 to 90)
  range: number;     // km
}

/**
 * 지상국 정보
 */
export interface GroundStation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  altitude: number; // meters
  minElevation?: number; // minimum elevation angle for visibility
}

/**
 * 위성 가시성 정보
 */
export interface VisibilityWindow {
  satelliteId: string;
  groundStationId: string;
  startTime: Date;
  endTime: Date;
  maxElevation: number;
  aos: Date; // Acquisition of Signal
  los: Date; // Loss of Signal
}

/**
 * Ground Track 포인트
 */
export interface GroundTrackPoint {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

/**
 * 궤도 요소
 */
export interface OrbitalElements {
  inclination: number;      // degrees
  eccentricity: number;     // 0-1
  semiMajorAxis: number;    // km
  meanMotion: number;       // revolutions per day
  period: number;           // minutes
  perigee: number;          // km
  apogee: number;           // km
  raan: number;             // Right Ascension of Ascending Node (degrees)
  argumentOfPerigee: number; // degrees
  meanAnomaly: number;      // degrees
}
