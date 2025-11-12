# 🚀 빠른 시작 가이드

## Phase 1 프로젝트를 5분 안에 실행하기

### 1️⃣ 프로젝트 생성 (1분)

```bash
npx create-next-app@14 satellite-tracker --typescript --tailwind --app
cd satellite-tracker
```

### 2️⃣ 의존성 설치 (2분)

```bash
# 한 번에 모든 패키지 설치 (React 18 호환 버전)
npm install satellite.js@5.0.0 date-fns@3.0.0 leaflet@1.9.4 react-leaflet@4.2.1 three@0.169.0 @react-three/fiber@8.17.10 @react-three/drei@9.114.3 recharts@2.13.3 zustand@5.0.1 @tanstack/react-query@5.62.7 lucide-react@0.462.0

# 개발 의존성
npm install -D @types/leaflet@1.9.14 @types/three@0.169.0
```

### 3️⃣ 파일 복사 (1분)

제공된 outputs 폴더의 내용을 프로젝트 루트로 복사:

```bash
# 파일 구조:
satellite-tracker/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── ModeToggle.tsx
│   │   └── Sidebar.tsx
│   ├── map/
│   │   └── MapView.tsx
│   └── globe/
│       └── GlobeView.tsx
├── store/
│   ├── satelliteStore.ts
│   └── uiStore.ts
├── types/
│   ├── satellite.ts
│   └── ui.ts
├── data/
│   └── tle-data.json
└── tailwind.config.ts
```

### 4️⃣ 실행 (1분)

```bash
npm run dev
```

브라우저에서 http://localhost:3000 열기

## ✅ 동작 확인

Phase 1에서 다음 기능들이 정상 동작해야 합니다:

1. **위성 목록**: 좌측 사이드바에 8개 위성 표시
2. **검색**: 검색창에 "ISS" 입력 시 필터링
3. **선택**: 위성 클릭 시 파란색으로 하이라이트
4. **모드 전환**: "2D 지도" ↔ "3D 지구" 버튼 동작
5. **사이드바**: 메뉴 아이콘으로 열기/닫기
6. **시간**: 헤더 우측에 현재 시간 표시

## 🐛 문제 해결

### Q: npm install 실패
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Q: TypeScript 오류
```bash
# tsconfig.json 확인
# Next.js 기본 설정이 있는지 확인
```

### Q: 빈 화면
```bash
# 브라우저 콘솔에서 에러 확인
# 파일 경로가 정확한지 확인
```

## 📝 다음 단계

Phase 1이 정상 동작하면:

1. ✅ 체크리스트 확인
2. 📖 INSTALLATION_GUIDE.md 읽기
3. 🚀 Phase 2 시작 준비

---

**문제가 있나요?** 

- INSTALLATION_GUIDE.md 참조
- README.md의 프로젝트 구조 확인
- GitHub Issues 확인
