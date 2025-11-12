// components/ui/TimeControl.tsx

'use client';

import { useUIStore } from '@/store/uiStore';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';
import { format } from 'date-fns';

export default function TimeControl() {
  const timeControlMode = useUIStore((state) => state.timeControlMode);
  const simulationSpeed = useUIStore((state) => state.simulationSpeed);
  const currentTime = useUIStore((state) => state.currentTime);
  const setTimeControlMode = useUIStore((state) => state.setTimeControlMode);
  const setSimulationSpeed = useUIStore((state) => state.setSimulationSpeed);
  const setCurrentTime = useUIStore((state) => state.setCurrentTime);

  const speeds = [0.5, 1, 2, 5, 10, 50, 100] as const;

  const togglePlayPause = () => {
    setTimeControlMode(timeControlMode === 'realtime' ? 'simulation' : 'realtime');
  };

  const resetTime = () => {
    setCurrentTime(new Date());
    setTimeControlMode('realtime');
  };

  return (
    <div className="bg-gray-800 border-t border-gray-700 p-3">
      <div className="flex items-center justify-between gap-4">
        {/* 시간 표시 */}
        <div className="flex-1">
          <div className="text-xs text-gray-400">현재 시간</div>
          <div className="text-lg font-mono font-bold">
            {format(currentTime, 'yyyy-MM-dd HH:mm:ss')}
          </div>
        </div>

        {/* 제어 버튼 */}
        <div className="flex items-center gap-2">
          {/* 재생/일시정지 */}
          <button
            onClick={togglePlayPause}
            className={`p-2 rounded-lg transition-colors ${
              timeControlMode === 'simulation'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={timeControlMode === 'simulation' ? '실시간으로 전환' : '시뮬레이션 시작'}
          >
            {timeControlMode === 'simulation' ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>

          {/* 초기화 */}
          <button
            onClick={resetTime}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            title="현재 시간으로 초기화"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* 속도 선택 */}
        <div className="flex items-center gap-2">
          <FastForward className="w-4 h-4 text-gray-400" />
          <div className="flex gap-1">
            {speeds.map(speed => (
              <button
                key={speed}
                onClick={() => setSimulationSpeed(speed)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  simulationSpeed === speed
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                disabled={timeControlMode === 'realtime'}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* 모드 표시 */}
        <div className="text-sm">
          <span className={`px-3 py-1 rounded ${
            timeControlMode === 'realtime'
              ? 'bg-green-600'
              : 'bg-blue-600'
          }`}>
            {timeControlMode === 'realtime' ? '실시간' : '시뮬레이션'}
          </span>
        </div>
      </div>
    </div>
  );
}
