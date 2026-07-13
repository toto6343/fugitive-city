# 도망자 (The Fugitive City)

로봇 군단이 침공한 도시. 한 학생이 로봇을 피해 탈출하다 무기를 손에 넣고,
탈출에 성공하지만 뉴스에는 그가 "도심을 파괴한 괴한"으로 보도된다.

## 실행 방법 (로컬 개발)

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build   # dist/ 폴더에 정적 빌드 생성
npm run preview # 빌드 결과 로컬 확인
```

## GitHub Pages 배포

1. 이 저장소를 본인 GitHub 계정에 push
2. 저장소 Settings → Pages → Source를 **GitHub Actions**로 설정
3. `main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 자동으로 빌드 후 배포
4. 배포 완료 후 `https://<username>.github.io/<repo-name>/` 에서 플레이 가능

## 조작

- 이동: 방향키 또는 WASD
- 목표: 로봇 시야(붉은/파란 삼각형)를 피해 우상단 EXIT 지점 도달

## 현재 구현 상태 (프로토타입 단계)

- [x] Phaser 3 + Vite 프로젝트 뼈대
- [x] GitHub Pages 자동 배포 파이프라인
- [x] 플레이어 이동
- [x] 로봇 AI 상태머신: PATROL → CHASE → ALERT
- [x] 은신 구간 (발각 시 게임오버, 탈출 시 엔딩)
- [x] 엔딩: 가짜 뉴스 속보 화면 (누명 반전 연출)
- [ ] 무기 획득 및 전투 구간 (ATTACK 상태 추가)
- [ ] 웨이브형 탈출 구간
- [ ] 아트 에셋 교체 (현재 도형 placeholder)
- [ ] 사운드
- [ ] 모바일 반응형 대응

## 폴더 구조

```
src/
  main.js              # Phaser 게임 설정, 씬 등록
  scenes/
    BootScene.js        # 초기 로딩 (추후 에셋 preload)
    TitleScene.js        # 타이틀 화면
    StealthScene.js      # 은신 구간 (플레이어+로봇AI 프로토타입)
    EndingScene.js        # 엔딩(가짜 뉴스 반전)
  entities/
    Robot.js             # 로봇 AI 상태머신 (PATROL/CHASE/ALERT)
```
