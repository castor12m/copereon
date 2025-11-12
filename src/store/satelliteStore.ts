// store/satelliteStore.ts

import { create } from 'zustand';
import { Satellite, SatellitePosition, GroundStation } from '@/types/satellite';

interface SatelliteStore {
  // 위성 데이터
  satellites: Satellite[];
  selectedSatelliteId: string | null;
  satellitePositions: Map<string, SatellitePosition>;
  
  // 지상국
  groundStations: GroundStation[];
  selectedGroundStationId: string | null;
  
  // 액션
  setSatellites: (satellites: Satellite[]) => void;
  addSatellite: (satellite: Satellite) => void;
  removeSatellite: (id: string) => void;
  selectSatellite: (id: string | null) => void;
  
  updateSatellitePosition: (position: SatellitePosition) => void;
  updateMultipleSatellitePositions: (positions: SatellitePosition[]) => void;
  
  setGroundStations: (stations: GroundStation[]) => void;
  selectGroundStation: (id: string | null) => void;
  
  // 유틸리티
  getSelectedSatellite: () => Satellite | null;
  getSelectedGroundStation: () => GroundStation | null;
  getSatellitePosition: (id: string) => SatellitePosition | null;
}

export const useSatelliteStore = create<SatelliteStore>((set, get) => ({
  // 초기 상태
  satellites: [],
  selectedSatelliteId: null,
  satellitePositions: new Map(),
  groundStations: [],
  selectedGroundStationId: null,
  
  // 위성 관리
  setSatellites: (satellites) => set({ satellites }),
  
  addSatellite: (satellite) => set((state) => ({
    satellites: [...state.satellites, satellite]
  })),
  
  removeSatellite: (id) => set((state) => ({
    satellites: state.satellites.filter(s => s.id !== id),
    selectedSatelliteId: state.selectedSatelliteId === id ? null : state.selectedSatelliteId
  })),
  
  selectSatellite: (id) => set({ selectedSatelliteId: id }),
  
  // 위성 위치 업데이트
  updateSatellitePosition: (position) => set((state) => {
    const newPositions = new Map(state.satellitePositions);
    newPositions.set(position.satelliteId, position);
    return { satellitePositions: newPositions };
  }),
  
  updateMultipleSatellitePositions: (positions) => set((state) => {
    const newPositions = new Map(state.satellitePositions);
    positions.forEach(pos => {
      newPositions.set(pos.satelliteId, pos);
    });
    return { satellitePositions: newPositions };
  }),
  
  // 지상국 관리
  setGroundStations: (stations) => set({ groundStations: stations }),
  
  selectGroundStation: (id) => set({ selectedGroundStationId: id }),
  
  // 유틸리티 메서드
  getSelectedSatellite: () => {
    const { satellites, selectedSatelliteId } = get();
    return satellites.find(s => s.id === selectedSatelliteId) || null;
  },
  
  getSelectedGroundStation: () => {
    const { groundStations, selectedGroundStationId } = get();
    return groundStations.find(s => s.id === selectedGroundStationId) || null;
  },
  
  getSatellitePosition: (id) => {
    return get().satellitePositions.get(id) || null;
  }
}));
