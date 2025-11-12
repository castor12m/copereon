# 🛰️ 위성 추적 시스템 (Satellite Tracker)

Next.js 14 + TypeScript 기반 실시간 위성 추적 및 궤도 시각화 웹 애플리케이션

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 목차

- [개요](#개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [시작하기](#시작하기)
- [프로젝트 구조](#프로젝트-구조)
- [개발 로드맵](#개발-로드맵)
- [기여하기](#기여하기)

## 🎯 개요

실시간으로 인공위성의 위치를 추적하고 궤도를 시각화하는 웹 애플리케이션입니다. TLE(Two-Line Element) 데이터를 기반으로 SGP4 알고리즘을 사용하여 정확한 위성 위치를 계산합니다.

## ✨ 주요 기능

### Phase 1: 기본 구조 ✅ (현재)
- [x] Next.js 14 App Router 기반 프로젝트 구조
- [x] TypeScript 타입 시스템
- [x] Zustand 상태 관리
- [x] 반응형 UI 레이아웃
- [x] 2D/3D 모드 전환 (코드 스플리팅)
- [x] 위성 목록 및 검색
- [x] 다크 테마

### Phase 2: 2D 지도 구현 🚧 (진행 예정)
- [ ] Leaflet 지도 통합
- [ ] satellite.js로 위성 위치 계산
- [ ] Ground track 시각화
- [ ] 위성 마커 및 정보 팝업
- [ ] 지상국 마커
- [ ] 실시간 위치 업데이트

### Phase 3: 3D 시각화 📅 (예정)
- [ ] React Three Fiber 기반 3D 지구
- [ ] 위성 궤도 렌더링
- [ ] 카메라 컨트롤
- [ ] 낮/밤 텍스처
- [ ] 위성 모델

### Phase 4: 극좌표 차트 📅 (예정)
- [ ] Recharts 극좌표 차트
- [ ] 방위각/고도각 표시
- [ ] 가시성 계산
- [ ] 지상국 기준 차트

### Phase 5: 성능 최적화 📅 (예정)
- [ ] Web Worker로 계산 오프로드
- [ ] 메모이제이션
- [ ] 가상화 (Virtualization)
- [ ] 배포 최적화

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query

### 시각화
- **2D Map**: Leaflet, React-Leaflet
- **3D Globe**: React Three Fiber, @react-three/drei
- **Charts**: Recharts

### 위성 계산
- **Library**: satellite.js (SGP4)
- **Date/Time**: date-fns
- **Performance**: Web Workers

## 🚀 시작하기

### 필수 조건

- Node.js 18.17 이상
- npm 또는 yarn

### 설치

```bash
# 1. 프로젝트 생성
npx create-next-app@14 satellite-tracker --typescript --tailwind --app
cd satellite-tracker

# 2. 의존성 설치
npm install satellite.js date-fns
npm install leaflet react-leaflet
npm install -D @types/leaflet
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
npm install recharts
npm install zustand @tanstack/react-query

# 3. 제공된 파일 복사
# (제공된 파일들을 해당 위치에 복사)

# 4. 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 📁 프로젝트 구조

```
satellite-tracker/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # 루트 레이아웃
│   ├── page.tsx             # 메인 페이지
│   ├── providers.tsx        # React Query Provider
│   └── globals.css          # 전역 스타일
│
├── components/              # React 컴포넌트
│   ├── layout/             # 레이아웃 컴포넌트
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── ModeToggle.tsx
│   ├── map/                # 2D 지도
│   │   └── MapView.tsx
│   └── globe/              # 3D 지구
│       └── GlobeView.tsx
│
├── store/                   # Zustand 상태 관리
│   ├── satelliteStore.ts   # 위성 데이터
│   └── uiStore.ts          # UI 상태
│
├── types/                   # TypeScript 타입
│   ├── satellite.ts        # 위성 타입
│   └── ui.ts               # UI 타입
│
├── lib/                     # 유틸리티 함수
│   └── satellite/          # 위성 계산
│
└── data/                    # 정적 데이터
    └── tle-data.json       # TLE 데이터
```

## 🗺️ 개발 로드맵

### Phase 1: 기본 구조 ✅
- [x] 프로젝트 설정
- [x] 타입 정의
- [x] 상태 관리
- [x] 기본 UI

### Phase 2: 2D 지도 (1-2주)
- [ ] Leaflet 통합
- [ ] satellite.js 연동
- [ ] Ground track
- [ ] 실시간 업데이트

### Phase 3: 3D 시각화 (2-3주)
- [ ] Three.js 설정
- [ ] 지구 모델
- [ ] 궤도 렌더링
- [ ] 카메라 컨트롤

### Phase 4: 극좌표 차트 (1주)
- [ ] Recharts 통합
- [ ] 가시성 계산
- [ ] 차트 UI

### Phase 5: 최적화 (1-2주)
- [ ] Web Worker
- [ ] 성능 튜닝
- [ ] 배포 준비

## 🎮 사용 방법

### 위성 선택
1. 좌측 사이드바에서 위성 클릭
2. 선택된 위성은 파란색으로 하이라이트
3. 지도/3D 뷰에서 자동으로 추적

### 검색
- 사이드바 상단 검색창에 위성 이름 입력
- 실시간 필터링

### 뷰 모드 전환
- 헤더 중앙의 "2D 지도" / "3D 지구" 버튼 클릭
- 코드 스플리팅으로 최적화된 로딩

## 🤝 기여하기

기여를 환영합니다! 다음 단계를 따라주세요:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 감사의 말

- [satellite.js](https://github.com/shashwatak/satellite-js) - SGP4 구현
- [CelesTrak](https://celestrak.org/) - TLE 데이터 소스
- [Leaflet](https://leafletjs.com/) - 2D 지도
- [Three.js](https://threejs.org/) - 3D 렌더링

## 📧 연락처

프로젝트 관련 문의사항이 있으시면 이슈를 열어주세요.

---

**Made with ❤️ and ☕**
