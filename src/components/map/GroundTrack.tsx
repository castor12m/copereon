// components/map/GroundTrack.tsx

'use client';

import { useMemo } from 'react';
import { Polyline } from 'react-leaflet';
import type { Satellite, SatellitePosition } from '@/types/satellite';
import { useUIStore } from '@/store/uiStore';
import { calculateGroundTrack } from '@/lib/satellite/calculator';
import type { LatLngExpression } from 'leaflet';

interface GroundTrackProps {
  satellite: Satellite;
  currentPosition: SatellitePosition;
}

/**
 * 국제 날짜 변경선을 처리하여 선을 분할
 */
function splitTrackAtDateline(points: [number, number][]): [number, number][][] {
  const segments: [number, number][][] = [];
  let currentSegment: [number, number][] = [];

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    
    if (i > 0) {
      const prevPoint = points[i - 1];
      const lonDiff = Math.abs(point[1] - prevPoint[1]);
      
      // 국제 날짜 변경선을 넘는 경우 (180도 점프)
      if (lonDiff > 180) {
        if (currentSegment.length > 0) {
          segments.push(currentSegment);
          currentSegment = [];
        }
      }
    }
    
    currentSegment.push(point);
  }

  if (currentSegment.length > 0) {
    segments.push(currentSegment);
  }

  return segments;
}

export default function GroundTrack({ satellite, currentPosition }: GroundTrackProps) {
  const groundTrackLength = useUIStore((state) => state.mapSettings.groundTrackLength);

  // Ground Track 계산 (과거 + 미래)
  const trackSegments = useMemo(() => {
    const pastMinutes = groundTrackLength / 2;
    const futureMinutes = groundTrackLength / 2;

    // 과거 궤적
    const pastStart = new Date(currentPosition.timestamp.getTime() - pastMinutes * 60 * 1000);
    const pastTrack = calculateGroundTrack(satellite, pastStart, pastMinutes, 30);

    // 미래 궤적
    const futureStart = currentPosition.timestamp;
    const futureTrack = calculateGroundTrack(satellite, futureStart, futureMinutes, 30);

    // 과거 + 현재 + 미래 결합
    const allPoints = [
      ...pastTrack.map(p => [p.latitude, p.longitude] as [number, number]),
      [currentPosition.geographic.latitude, currentPosition.geographic.longitude] as [number, number],
      ...futureTrack.slice(1).map(p => [p.latitude, p.longitude] as [number, number])
    ];

    // 국제 날짜 변경선 처리
    return splitTrackAtDateline(allPoints);
  }, [satellite, currentPosition, groundTrackLength]);

  return (
    <>
      {trackSegments.map((segment, index) => (
        <Polyline
          key={`track-${index}`}
          positions={segment as LatLngExpression[]}
          pathOptions={{
            color: '#facc15',
            weight: 2,
            opacity: 0.7,
            dashArray: '5, 10'
          }}
        />
      ))}
    </>
  );
}
