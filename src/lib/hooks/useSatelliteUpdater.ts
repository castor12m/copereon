// lib/hooks/useSatelliteUpdater.ts

import { useEffect, useRef } from 'react';
import { useSatelliteStore } from '@/store/satelliteStore';
import { useUIStore } from '@/store/uiStore';
import { calculateMultipleSatellitePositions } from '@/lib/satellite/calculator';

/**
 * 위성 위치를 실시간으로 업데이트하는 Hook
 */
export function useSatelliteUpdater() {
  const satellites = useSatelliteStore((state) => state.satellites);
  const updateMultipleSatellitePositions = useSatelliteStore(
    (state) => state.updateMultipleSatellitePositions
  );
  const currentTime = useUIStore((state) => state.currentTime);
  const setCurrentTime = useUIStore((state) => state.setCurrentTime);
  const timeControlMode = useUIStore((state) => state.timeControlMode);
  const simulationSpeed = useUIStore((state) => state.simulationSpeed);
  const updateInterval = useUIStore((state) => state.mapSettings.updateInterval);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 초기 위치 계산
    if (satellites.length > 0) {
      const positions = calculateMultipleSatellitePositions(satellites, currentTime);
      updateMultipleSatellitePositions(positions);
    }

    // 업데이트 인터벌 설정
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const now = timeControlMode === 'realtime' 
        ? new Date()
        : new Date(currentTime.getTime() + (1000 * simulationSpeed));

      setCurrentTime(now);

      if (satellites.length > 0) {
        const positions = calculateMultipleSatellitePositions(satellites, now);
        updateMultipleSatellitePositions(positions);
      }
    }, updateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    satellites,
    currentTime,
    timeControlMode,
    simulationSpeed,
    updateInterval,
    updateMultipleSatellitePositions,
    setCurrentTime
  ]);
}
