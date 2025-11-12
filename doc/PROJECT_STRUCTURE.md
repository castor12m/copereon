# 위성 추적 시스템 - 프로젝트 구조

```
satellite-tracker/
├── app/
│   ├── layout.tsx                 # 루트 레이아웃
│   ├── page.tsx                   # 메인 페이지
│   ├── globals.css                # 전역 스타일
│   └── providers.tsx              # React Query Provider
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx             # 상단 헤더
│   │   ├── Sidebar.tsx            # 사이드바 (위성 목록)
│   │   └── ModeToggle.tsx         # 2D/3D 전환 버튼
│   │
│   ├── map/
│   │   ├── MapView.tsx            # Leaflet 지도 컨테이너
│   │   ├── SatelliteMarker.tsx    # 위성 마커
│   │   ├── GroundTrack.tsx        # Ground track 라인
│   │   └── GroundStation.tsx      # 지상국 마커
│   │
│   ├── globe/
│   │   ├── GlobeView.tsx          # 3D 캔버스 컨테이너
│   │   ├── Earth.tsx              # 3D 지구 모델
│   │   ├── SatelliteOrbit.tsx     # 위성 궤도
│   │   └── CameraControls.tsx     # 카메라 컨트롤
│   │
│   ├── charts/
│   │   ├── PolarChart.tsx         # 극좌표 차트
│   │   └── VisibilityCone.tsx     # 가시성 원뿔
│   │
│   └── ui/
│       ├── SatelliteList.tsx      # 위성 목록
│       ├── SatelliteInfo.tsx      # 위성 상세 정보
│       └── TimeControl.tsx        # 시간 제어
│
├── lib/
│   ├── satellite/
│   │   ├── calculator.ts          # 위성 위치 계산
│   │   ├── tle-parser.ts          # TLE 파싱
│   │   └── propagator.ts          # SGP4 계산
│   │
│   ├── utils/
│   │   ├── coordinates.ts         # 좌표 변환
│   │   ├── visibility.ts          # 가시성 계산
│   │   └── formatting.ts          # 데이터 포맷팅
│   │
│   └── workers/
│       └── satellite.worker.ts    # Web Worker
│
├── store/
│   ├── satelliteStore.ts          # 위성 상태 관리
│   ├── uiStore.ts                 # UI 상태
│   └── timeStore.ts               # 시간 제어 상태
│
├── types/
│   ├── satellite.ts               # 위성 관련 타입
│   ├── coordinates.ts             # 좌표 타입
│   └── ui.ts                      # UI 타입
│
├── data/
│   └── tle-data.json              # 샘플 TLE 데이터
│
└── public/
    └── textures/
        ├── earth-day.jpg          # 지구 텍스처
        └── earth-night.jpg        # 야간 지구 텍스처
```

## 주요 디렉토리 설명

### `/app`
- Next.js 14 App Router 기반
- 페이지 라우팅 및 레이아웃

### `/components`
- **layout**: 공통 레이아웃 컴포넌트
- **map**: 2D 지도 관련 컴포넌트
- **globe**: 3D 시각화 컴포넌트
- **charts**: 차트 및 그래프
- **ui**: 재사용 가능한 UI 컴포넌트

### `/lib`
- **satellite**: 위성 궤도 계산 로직
- **utils**: 유틸리티 함수
- **workers**: Web Worker 스크립트

### `/store`
- Zustand 기반 상태 관리

### `/types`
- TypeScript 타입 정의

### `/data`
- 정적 데이터 (TLE, 지상국 정보)
```
