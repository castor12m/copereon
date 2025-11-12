# 위성 추적 시스템 - Phase 1 설치 가이드

## 🎯 Phase 1 목표

Next.js 14 + TypeScript 기반 위성 추적 시스템의 기본 구조를 구축하고, 핵심 UI 레이아웃을 완성합니다.

## 📦 1. 프로젝트 초기 설정

### 1.1 프로젝트 생성

```bash
# Next.js 14 프로젝트 생성
npx create-next-app@14 satellite-tracker --typescript --tailwind --app

cd satellite-tracker
```

### 1.2 의존성 설치

```bash
# 위성 계산
npm install satellite.js@5.0.0 date-fns@3.0.0

# 2D 지도 (React 18 호환 버전)
npm install leaflet@1.9.4 react-leaflet@4.2.1
npm install -D @types/leaflet@1.9.14

# 3D 시각화
npm install three@0.169.0 @react-three/fiber@8.17.10 @react-three/drei@9.114.3
npm install -D @types/three@0.169.0

# 차트
npm install recharts@2.13.3

# 상태 관리
npm install zustand@5.0.1 @tanstack/react-query@5.62.7

# 아이콘
npm install lucide-react@0.462.0
```

## 📁 2. 파일 구조 생성

제공된 파일들을 다음과 같이 배치하세요:

```
satellite-tracker/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   └── globals.css
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── ModeToggle.tsx
│   │   └── Sidebar.tsx
│   ├── map/
│   │   └── MapView.tsx
│   └── globe/
│       └── GlobeView.tsx
│
├── store/
│   ├── satelliteStore.ts
│   └── uiStore.ts
│
├── types/
│   ├── satellite.ts
│   └── ui.ts
│
├── data/
│   └── tle-data.json
│
└── tailwind.config.ts
```

## 🚀 3. 실행

```bash
# 개발 서버 시작
npm run dev

# 브라우저에서 열기
# http://localhost:3000
```

## ✨ 4. 현재 구현된 기능

### 4.1 UI 레이아웃
- ✅ **반응형 헤더**: 메뉴 토글, 로고, 실시간 시간 표시
- ✅ **사이드바**: 위성 목록, 검색, 선택 기능
- ✅ **2D/3D 모드 전환**: 코드 스플리팅으로 최적화
- ✅ **다크 테마**: 우주 느낌의 회색/파란색 계열

### 4.2 상태 관리
- ✅ **satelliteStore**: 위성 데이터, 선택 상태, 지상국 관리
- ✅ **uiStore**: 뷰 모드, 사이드바, 시간 제어, 알림

### 4.3 데이터
- ✅ **8개 샘플 위성**: ISS, Hubble, Starlink, GPS, NOAA, Tiangong, Galileo, Landsat
- ✅ **4개 지상국**: Seoul, Jeju, Wallops, Kourou

### 4.4 TypeScript 타입
- ✅ 완전한 타입 안정성
- ✅ 위성, 좌표, UI 상태 타입 정의

## 🎮 5. 사용 방법

### 5.1 위성 선택
1. 좌측 사이드바에서 위성을 클릭하여 선택
2. 선택된 위성은 파란색으로 하이라이트
3. 다시 클릭하면 선택 해제

### 5.2 위성 검색
- 사이드바 상단의 검색창에 위성 이름 입력
- 실시간으로 필터링됨

### 5.3 뷰 모드 전환
- 헤더 중앙의 "2D 지도" / "3D 지구" 버튼 클릭
- 현재는 플레이스홀더 화면 표시

### 5.4 사이드바 토글
- 헤더 좌측의 메뉴 아이콘 클릭
- 사이드바 열기/닫기

## 🔍 6. 코드 하이라이트

### 6.1 Zustand 스토어 사용 예시

```typescript
// 위성 목록 가져오기
const satellites = useSatelliteStore((state) => state.satellites);

// 위성 선택
const selectSatellite = useSatelliteStore((state) => state.selectSatellite);
selectSatellite('iss');

// 선택된 위성 가져오기
const selected = useSatelliteStore((state) => state.getSelectedSatellite());
```

### 6.2 Dynamic Import (코드 스플리팅)

```typescript
const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => <div>Loading Map...</div>
});
```

### 6.3 타입 활용

```typescript
import { Satellite, GeographicCoordinates } from '@/types/satellite';

const satellite: Satellite = {
  id: 'iss',
  name: 'ISS',
  noradId: 25544,
  tle: { ... }
};
```

## 🐛 7. 문제 해결

### 문제: npm install 실패
```bash
# 캐시 삭제 후 재시도
npm cache clean --force
npm install
```

### 문제: TypeScript 오류
```bash
# 타입 재생성
npm run build
```

### 문제: 포트 충돌
```bash
# 다른 포트로 실행
npm run dev -- -p 3001
```

## 📊 8. 프로젝트 구조 설명

### `/app` - Next.js App Router
- `layout.tsx`: 전역 레이아웃, 메타데이터
- `page.tsx`: 메인 페이지, 뷰 라우팅
- `providers.tsx`: React Query Provider
- `globals.css`: Tailwind + 커스텀 스타일

### `/components` - React 컴포넌트
- `layout/`: 헤더, 사이드바, 모드 토글
- `map/`: 2D 지도 관련 (Phase 2에서 구현)
- `globe/`: 3D 지구 관련 (Phase 3에서 구현)

### `/store` - Zustand 상태 관리
- `satelliteStore.ts`: 위성/지상국 데이터
- `uiStore.ts`: UI 상태, 설정

### `/types` - TypeScript 타입
- `satellite.ts`: 위성, 좌표, 궤도 타입
- `ui.ts`: UI, 설정 타입

### `/data` - 정적 데이터
- `tle-data.json`: TLE 및 지상국 데이터

## 🎯 9. Phase 2 준비 사항

Phase 2에서는 다음을 구현합니다:

1. **Leaflet 지도 설정**
   - 기본 지도 렌더링
   - 커스텀 타일 레이어

2. **satellite.js 통합**
   - TLE 파싱
   - SGP4 궤도 계산
   - 실시간 위성 위치 계산

3. **지도 시각화**
   - 위성 마커
   - Ground track (궤도선)
   - 지상국 마커

4. **실시간 업데이트**
   - 위성 위치 자동 갱신
   - 부드러운 애니메이션

## 📚 10. 참고 자료

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Zustand](https://docs.pmnd.rs/zustand)
- [React Query](https://tanstack.com/query/latest)
- [Leaflet](https://leafletjs.com/)
- [satellite.js](https://github.com/shashwatak/satellite-js)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)

## ✅ 체크리스트

Phase 1 완료 확인:

- [ ] 프로젝트 생성 및 의존성 설치
- [ ] 모든 파일 복사 및 배치
- [ ] `npm run dev` 실행 성공
- [ ] 브라우저에서 UI 확인
- [ ] 사이드바에서 위성 선택 가능
- [ ] 2D/3D 모드 전환 동작
- [ ] 검색 기능 동작
- [ ] TypeScript 오류 없음

---

**🎉 Phase 1 완료!**

이제 Phase 2로 넘어가 실제 위성 추적 기능을 구현할 준비가 되었습니다.
