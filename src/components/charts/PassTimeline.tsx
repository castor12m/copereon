// components/charts/PassTimeline.tsx

'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSatelliteStore } from '@/store/satelliteStore';
import { useUIStore } from '@/store/uiStore';
import { calculateSatellitePosition, calculateLookAngles } from '@/lib/satellite/calculator';
import { format } from 'date-fns';

export default function PassTimeline() {
  const satellites = useSatelliteStore((state) => state.satellites);
  const selectedGroundStationId = useSatelliteStore((state) => state.selectedGroundStationId);
  const groundStations = useSatelliteStore((state) => state.groundStations);
  const selectedSatelliteId = useSatelliteStore((state) => state.selectedSatelliteId);
  const currentTime = useUIStore((state) => state.currentTime);

  const selectedGroundStation = groundStations.find(
    gs => gs.id === selectedGroundStationId
  );

  // 다음 2시간 동안의 고도각 계산
  const timelineData = useMemo(() => {
    if (!selectedGroundStation) return [];

    const duration = 120; // 2시간
    const interval = 2; // 2분 간격
    const data = [];

    const satellitesToShow = selectedSatelliteId
      ? satellites.filter(s => s.id === selectedSatelliteId)
      : satellites.slice(0, 3); // 최대 3개

    for (let i = 0; i <= duration; i += interval) {
      const time = new Date(currentTime.getTime() + i * 60 * 1000);
      const dataPoint: any = {
        time: format(time, 'HH:mm'),
        timestamp: time.getTime()
      };

      satellitesToShow.forEach(satellite => {
        const position = calculateSatellitePosition(satellite, time);
        if (position) {
          const lookAngles = calculateLookAngles(position, selectedGroundStation);
          const minElevation = selectedGroundStation.minElevation || 0;
          
          // 최소 고도각 이상일 때만 표시
          dataPoint[satellite.name] = lookAngles.elevation >= minElevation 
            ? lookAngles.elevation 
            : null;
        }
      });

      data.push(dataPoint);
    }

    return data;
  }, [satellites, selectedGroundStation, selectedSatelliteId, currentTime]);

  // 다음 패스 찾기
  const nextPasses = useMemo(() => {
    if (!selectedGroundStation) return [];

    const satellitesToShow = selectedSatelliteId
      ? satellites.filter(s => s.id === selectedSatelliteId)
      : satellites.slice(0, 3);

    return satellitesToShow.map(satellite => {
      // 다음 24시간 검색
      for (let i = 0; i < 1440; i += 1) { // 1분 간격
        const time = new Date(currentTime.getTime() + i * 60 * 1000);
        const position = calculateSatellitePosition(satellite, time);
        
        if (position) {
          const lookAngles = calculateLookAngles(position, selectedGroundStation);
          const minElevation = selectedGroundStation.minElevation || 0;
          
          if (lookAngles.elevation >= minElevation) {
            // 패스 시작 찾음
            let maxElevation = lookAngles.elevation;
            let duration = 0;
            
            // 패스 지속 시간 계산
            for (let j = i; j < 1440; j += 1) {
              const futureTime = new Date(currentTime.getTime() + j * 60 * 1000);
              const futurePosition = calculateSatellitePosition(satellite, futureTime);
              
              if (futurePosition) {
                const futureAngles = calculateLookAngles(futurePosition, selectedGroundStation);
                
                if (futureAngles.elevation < minElevation) {
                  break;
                }
                
                maxElevation = Math.max(maxElevation, futureAngles.elevation);
                duration = j - i;
              }
            }
            
            return {
              satellite,
              startTime: time,
              duration,
              maxElevation
            };
          }
        }
      }
      
      return null;
    }).filter(Boolean);
  }, [satellites, selectedGroundStation, selectedSatelliteId, currentTime]);

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

  const colors = ['#3b82f6', '#ef4444', '#10b981'];

  return (
    <div className="w-full bg-gray-900 p-4">
      <div className="space-y-4 max-w-7xl mx-auto">
        {/* 타임라인 차트 */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-4">
            2시간 가시성 예측 - {selectedGroundStation.name}
          </h3>
          
          <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                  label={{ value: '고도각 (°)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                  domain={[0, 90]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '0.5rem'
                  }}
                  formatter={(value: any) => [`${value?.toFixed(1)}°`, '고도각']}
                />
                <Legend />
                
                {satellites.slice(0, 3).map((satellite, index) => (
                  <Line
                    key={satellite.id}
                    type="monotone"
                    dataKey={satellite.name}
                    stroke={colors[index]}
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 다음 패스 정보 */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-4">다음 패스</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {nextPasses.map((pass: any, index: number) => (
              <div 
                key={pass.satellite.id}
                className="p-3 bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="font-bold text-sm">{pass.satellite.name}</span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">시작:</span>
                    <span className="font-mono">
                      {format(pass.startTime, 'HH:mm:ss')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">지속:</span>
                    <span className="font-mono">{pass.duration}분</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">최대 고도:</span>
                    <span className="font-mono">{pass.maxElevation.toFixed(1)}°</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {nextPasses.length === 0 && (
            <div className="text-center text-gray-400 py-4">
              향후 24시간 내 가시 패스 없음
            </div>
          )}
        </div>
      </div>
    </div>
  );
}