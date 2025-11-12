// components/charts/PolarChart.tsx

'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSatelliteStore } from '@/store/satelliteStore';
import { useUIStore } from '@/store/uiStore';
import { calculateSatellitePosition, calculateLookAngles } from '@/lib/satellite/calculator';

export default function PolarChart() {
  const satellites = useSatelliteStore((state) => state.satellites);
  const selectedGroundStationId = useSatelliteStore((state) => state.selectedGroundStationId);
  const groundStations = useSatelliteStore((state) => state.groundStations);
  const selectedSatelliteId = useSatelliteStore((state) => state.selectedSatelliteId);
  const currentTime = useUIStore((state) => state.currentTime);

  // 강제 리렌더링을 위한 state
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // currentTime이 변경될 때마다 강제 리렌더링
  useEffect(() => {
    console.log('🔄 PolarChart: currentTime changed:', currentTime.toISOString());
    setUpdateTrigger(prev => prev + 1);
  }, [currentTime]);

  const selectedGroundStation = groundStations.find(
    gs => gs.id === selectedGroundStationId
  );

  // 위성별 전체 패스 궤적 계산 (부드러운 곡선을 위해 간격 단축)
  const passTrajectories = useMemo(() => {
    if (!selectedGroundStation) return [];

    const satellitesToShow = selectedSatelliteId
      ? satellites.filter(s => s.id === selectedSatelliteId)
      : satellites.slice(0, 5);

    return satellitesToShow.map(satellite => {
      const trajectory = [];
      const duration = 120; // 2시간
      const interval = 0.5; // 30초 간격으로 변경 (더 부드러운 곡선)

      for (let i = -duration/2; i <= duration/2; i += interval) {
        const time = new Date(currentTime.getTime() + i * 60 * 1000);
        const position = calculateSatellitePosition(satellite, time);

        if (position) {
          const lookAngles = calculateLookAngles(position, selectedGroundStation);
          const minElevation = selectedGroundStation.minElevation || 0;

          if (lookAngles.elevation >= minElevation) {
            trajectory.push({
              azimuth: lookAngles.azimuth,
              elevation: lookAngles.elevation,
              range: lookAngles.range,
              time: time
            });
          }
        }
      }

      // 현재 위치 계산 - currentTime 기준으로 직접 계산
      const currentPosition = calculateSatellitePosition(satellite, currentTime);
      let currentLookAngles = null;
      
      if (currentPosition) {
        currentLookAngles = calculateLookAngles(currentPosition, selectedGroundStation);
      }

      return {
        satellite,
        trajectory,
        currentPosition: currentLookAngles
      };
    }).filter(item => item.trajectory.length > 0 || item.currentPosition !== null);
  }, [satellites, selectedGroundStation, selectedSatelliteId, currentTime, updateTrigger]);

  // Catmull-Rom 스플라인으로 부드러운 곡선 생성
  const createSmoothPath = (points: {azimuth: number, elevation: number}[]) => {
    if (points.length < 2) return '';
    
    const polarToCartesian = (azimuth: number, elevation: number) => {
      const radius = 180 * (1 - elevation / 90);
      const angleRad = (azimuth - 90) * Math.PI / 180;
      return {
        x: 200 + radius * Math.cos(angleRad),
        y: 200 + radius * Math.sin(angleRad)
      };
    };

    const cartesianPoints = points.map(p => polarToCartesian(p.azimuth, p.elevation));
    
    if (cartesianPoints.length < 4) {
      // 포인트가 적으면 일반 라인으로
      return cartesianPoints.map((p, i) => 
        `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
      ).join(' ');
    }

    // Catmull-Rom 스플라인
    let path = `M ${cartesianPoints[0].x} ${cartesianPoints[0].y}`;
    
    for (let i = 0; i < cartesianPoints.length - 1; i++) {
      const p0 = cartesianPoints[Math.max(0, i - 1)];
      const p1 = cartesianPoints[i];
      const p2 = cartesianPoints[i + 1];
      const p3 = cartesianPoints[Math.min(cartesianPoints.length - 1, i + 2)];
      
      // 제어점 계산
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    
    return path;
  };

  // 현재 위성들의 Look Angles (테이블용) - currentTime 기준으로 직접 계산
  const currentLookAngles = useMemo(() => {
    if (!selectedGroundStation) return [];

    const satellitesToShow = selectedSatelliteId
      ? satellites.filter(s => s.id === selectedSatelliteId)
      : satellites.slice(0, 5);

    return satellitesToShow.map(satellite => {
      const position = calculateSatellitePosition(satellite, currentTime);
      if (!position) return null;

      const lookAngles = calculateLookAngles(position, selectedGroundStation);
      const isVisible = lookAngles.elevation >= (selectedGroundStation.minElevation || 0);

      return {
        satellite,
        lookAngles,
        isVisible
      };
    }).filter(Boolean);
  }, [satellites, selectedGroundStation, selectedSatelliteId, currentTime, updateTrigger]);

  if (!selectedGroundStation) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-400">
        <div className="text-center">
          <p className="text-lg mb-2">지상국을 선택하세요</p>
          <p className="text-sm">2D 지도에서 초록색 마커를 클릭</p>
        </div>
      </div>
    );
  }

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="w-full h-full bg-gray-900 p-4 overflow-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ height: 'calc(100% - 1rem)' }}>
        {/* 극좌표 차트 */}
        <div className="bg-gray-800 rounded-lg p-4 flex flex-col" style={{ maxHeight: '100%' }}>
          <h3 className="text-lg font-bold mb-4 flex-shrink-0">
            극좌표 차트 - {selectedGroundStation.name}
          </h3>
          
          <div className="flex-1 min-h-0">
            <svg viewBox="0 0 400 400" className="w-full h-full">
              {/* 중심점 */}
              <circle cx="200" cy="200" r="180" fill="none" stroke="#374151" strokeWidth="1" />
              <circle cx="200" cy="200" r="120" fill="none" stroke="#374151" strokeWidth="1" />
              <circle cx="200" cy="200" r="60" fill="none" stroke="#374151" strokeWidth="1" />
              
              {/* 방위각 선 */}
              <line x1="200" y1="20" x2="200" y2="380" stroke="#4b5563" strokeWidth="1" />
              <line x1="20" y1="200" x2="380" y2="200" stroke="#4b5563" strokeWidth="1" />
              
              {/* 방위각 레이블 */}
              <text x="200" y="15" textAnchor="middle" fill="#9ca3af" fontSize="12">N (0°)</text>
              <text x="385" y="205" textAnchor="start" fill="#9ca3af" fontSize="12">E (90°)</text>
              <text x="200" y="395" textAnchor="middle" fill="#9ca3af" fontSize="12">S (180°)</text>
              <text x="15" y="205" textAnchor="end" fill="#9ca3af" fontSize="12">W (270°)</text>
              
              {/* 고도각 레이블 */}
              <text x="205" y="80" fill="#9ca3af" fontSize="11">60°</text>
              <text x="205" y="140" fill="#9ca3af" fontSize="11">30°</text>
              
              {/* 위성 궤적 그리기 (부드러운 곡선) */}
              {passTrajectories.map((item, index) => {
                const color = colors[index % colors.length];
                const pathData = createSmoothPath(item.trajectory);

                return (
                  <g key={item.satellite.id}>
                    {/* 궤적 선 */}
                    {pathData && (
                      <path
                        d={pathData}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        strokeOpacity="0.7"
                      />
                    )}
                    
                    {/* 현재 위치 점 - 항상 표시 */}
                    {item.currentPosition && (
                      (() => {
                        const radius = 180 * (1 - item.currentPosition.elevation / 90);
                        const angleRad = (item.currentPosition.azimuth - 90) * Math.PI / 180;
                        const x = 200 + radius * Math.cos(angleRad);
                        const y = 200 + radius * Math.sin(angleRad);
                        
                        const isVisible = item.currentPosition.elevation >= (selectedGroundStation.minElevation || 0);
                        
                        return (
                          <>
                            {/* 메인 점 */}
                            <circle cx={x} cy={y} r="6" fill={color} opacity="0.9" />
                            {/* 중심 하이라이트 */}
                            <circle cx={x} cy={y} r="3" fill="#ffffff" opacity="0.8" />
                            {/* 펄스 효과 (가시일 때만) */}
                            {isVisible && (
                              <circle cx={x} cy={y} r="8" fill="none" stroke={color} strokeWidth="2" opacity="0.5">
                                <animate attributeName="r" from="8" to="14" dur="1.5s" repeatCount="indefinite" />
                                <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                              </circle>
                            )}
                            {/* 위성 이름 라벨 */}
                            <text 
                              x={x} 
                              y={y - 12} 
                              textAnchor="middle" 
                              fill={color} 
                              fontSize="10" 
                              fontWeight="bold"
                            >
                              {item.satellite.name}
                            </text>
                          </>
                        );
                      })()
                    )}
                  </g>
                );
              })}
              
              {/* 범례 */}
              {passTrajectories.map((item, index) => (
                <g key={`legend-${item.satellite.id}`} transform={`translate(10, ${320 + index * 20})`}>
                  <line x1="0" y1="0" x2="20" y2="0" stroke={colors[index % colors.length]} strokeWidth="2" />
                  <text x="25" y="4" fill="#e5e7eb" fontSize="12">{item.satellite.name}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* 위성 정보 테이블 */}
        <div className="bg-gray-800 rounded-lg p-4 flex flex-col overflow-hidden" style={{ maxHeight: '100%' }}>
          <h3 className="text-lg font-bold mb-4 flex-shrink-0">위성 가시성</h3>
          
          <div className="space-y-3 overflow-y-auto flex-1 pr-2">
            {currentLookAngles.map((item: any, index: number) => (
              <div 
                key={item.satellite.id}
                className={`p-3 rounded-lg ${
                  item.isVisible ? 'bg-green-900 bg-opacity-30 border border-green-600' : 'bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="font-bold">{item.satellite.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.isVisible ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    {item.isVisible ? '가시' : '비가시'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-gray-400 text-xs">방위각</div>
                    <div className="font-mono">{item.lookAngles.azimuth.toFixed(1)}°</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs">고도각</div>
                    <div className="font-mono">{item.lookAngles.elevation.toFixed(1)}°</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs">거리</div>
                    <div className="font-mono">{item.lookAngles.range.toFixed(0)} km</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {currentLookAngles.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              위성을 선택하거나<br />데이터를 기다리는 중...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
