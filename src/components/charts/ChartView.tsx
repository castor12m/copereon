// components/charts/ChartView.tsx

'use client';

import { useState } from 'react';
import PolarChart from './PolarChart';
import PassTimeline from './PassTimeline';
import { BarChart3, Clock } from 'lucide-react';

type ChartTab = 'polar' | 'timeline';

export default function ChartView() {
  const [activeTab, setActiveTab] = useState<ChartTab>('polar');

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 overflow-hidden">
      {/* 탭 헤더 */}
      <div className="bg-gray-800 border-b border-gray-700 p-2 flex-shrink-0">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('polar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'polar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>극좌표 차트</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'timeline'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>패스 타임라인</span>
          </button>
        </div>
      </div>

      {/* 차트 컨텐츠 */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'polar' ? <PolarChart /> : <PassTimeline />}
      </div>
    </div>
  );
}
