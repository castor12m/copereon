// store/uiStore.ts

import { create } from 'zustand';
import { 
  ViewMode, 
  TimeControlMode, 
  SimulationSpeed, 
  MapSettings, 
  GlobeSettings,
  Theme,
  Notification
} from '@/types/ui';

interface UIStore {
  // 뷰 모드
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  
  // 사이드바
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  
  // 시간 제어
  timeControlMode: TimeControlMode;
  simulationSpeed: SimulationSpeed;
  currentTime: Date;
  setTimeControlMode: (mode: TimeControlMode) => void;
  setSimulationSpeed: (speed: SimulationSpeed) => void;
  setCurrentTime: (time: Date) => void;
  
  // 지도 설정
  mapSettings: MapSettings;
  updateMapSettings: (settings: Partial<MapSettings>) => void;
  
  // 3D 설정
  globeSettings: GlobeSettings;
  updateGlobeSettings: (settings: Partial<GlobeSettings>) => void;
  
  // 테마
  theme: Theme;
  setTheme: (theme: Theme) => void;
  
  // 알림
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // 로딩 상태
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const defaultMapSettings: MapSettings = {
  showGroundTracks: true,
  showFootprints: false,
  showGroundStations: true,
  groundTrackLength: 90, // 90 minutes
  updateInterval: 1000 // 1 second
};

const defaultGlobeSettings: GlobeSettings = {
  showOrbits: true,
  showOrbitHistory: true,
  showSunlight: true,
  orbitSegments: 128,
  rotationSpeed: 1
};

export const useUIStore = create<UIStore>((set) => ({
  // 초기 상태
  viewMode: '2d',
  isSidebarOpen: true,
  timeControlMode: 'realtime',
  simulationSpeed: 1,
  currentTime: new Date(),
  mapSettings: defaultMapSettings,
  globeSettings: defaultGlobeSettings,
  theme: 'dark',
  notifications: [],
  isLoading: false,
  
  // 뷰 모드
  setViewMode: (mode) => set({ viewMode: mode }),
  
  // 사이드바
  toggleSidebar: () => set((state) => ({ 
    isSidebarOpen: !state.isSidebarOpen 
  })),
  
  // 시간 제어
  setTimeControlMode: (mode) => set({ timeControlMode: mode }),
  
  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
  
  setCurrentTime: (time) => set({ currentTime: time }),
  
  // 설정
  updateMapSettings: (settings) => set((state) => ({
    mapSettings: { ...state.mapSettings, ...settings }
  })),
  
  updateGlobeSettings: (settings) => set((state) => ({
    globeSettings: { ...state.globeSettings, ...settings }
  })),
  
  // 테마
  setTheme: (theme) => set({ theme }),
  
  // 알림
  addNotification: (notification) => set((state) => ({
    notifications: [
      ...state.notifications,
      {
        ...notification,
        id: Math.random().toString(36).substring(7),
        timestamp: new Date()
      }
    ]
  })),
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  clearNotifications: () => set({ notifications: [] }),
  
  // 로딩
  setLoading: (loading) => set({ isLoading: loading })
}));
