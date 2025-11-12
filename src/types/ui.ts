// types/ui.ts

/**
 * 뷰 모드
 */
export type ViewMode = '2d' | '3d';

/**
 * 시간 제어 모드
 */
export type TimeControlMode = 'realtime' | 'simulation';

/**
 * 시뮬레이션 속도
 */
export type SimulationSpeed = 0.5 | 1 | 2 | 5 | 10 | 50 | 100;

/**
 * 차트 타입
 */
export type ChartType = 'polar' | 'timeline' | 'altitude';

/**
 * 필터 옵션
 */
export interface SatelliteFilter {
  searchQuery: string;
  categories: string[];
  countries: string[];
  minAltitude?: number;
  maxAltitude?: number;
  onlyVisible?: boolean;
}

/**
 * 지도 설정
 */
export interface MapSettings {
  showGroundTracks: boolean;
  showFootprints: boolean;
  showGroundStations: boolean;
  groundTrackLength: number; // minutes
  updateInterval: number; // milliseconds
}

/**
 * 3D 설정
 */
export interface GlobeSettings {
  showOrbits: boolean;
  showOrbitHistory: boolean;
  showSunlight: boolean;
  orbitSegments: number;
  rotationSpeed: number;
}

/**
 * 알림 타입
 */
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

/**
 * 알림
 */
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: Date;
  duration?: number; // milliseconds
}

/**
 * 테마
 */
export type Theme = 'light' | 'dark' | 'auto';
