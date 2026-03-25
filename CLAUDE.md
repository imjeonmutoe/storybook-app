# storybook-app

## 프로젝트 개요
운영 중인 B2B 관리자 대시보드에 Storybook을 뒤늦게 도입하는 시나리오.
면접 포트폴리오용 + Storybook + MSW 학습용.

## 기술 스택
- Vite + React 19 + TypeScript
- Tailwind CSS v3
- Storybook v8 (설치 예정)
- MSW v2 (설치 예정)

## 위치
/Users/ssosso/project/storybook-app

## 현재 진행 상황
- [x] Vite + React + TypeScript 생성
- [x] Tailwind CSS v3 설치
- [x] 폴더 구조 생성
- [x] Storybook 설치 (v10)
- [x] MSW 설치 (v2) + 브라우저/Storybook 연결
- [x] 컴포넌트 생성 (Button, Input, Badge, Card, UserList, Header)
- [x] Story 파일 작성
- [x] 페이지 구성 (Dashboard, Users, Users/:id)
- [x] 절대경로 import (@/ alias)
- [x] src/mocks/ 핸들러 구조화

## 폴더 구조
src/
  components/
    Button/
    Input/
    Badge/
    Card/
    UserList/
    Header/
  pages/
    Dashboard/
    Users/

## 완료된 작업
모든 항목 완료. 추가 작업 없음.

## 페이지 구성
- /           대시보드 (통계 카드 + 최근 활동)
- /users      유저 목록 (API 연동 + 검색 + 페이지네이션)
- /users/:id  유저 상세

## 면접 어필 포인트
"기존 운영 중인 B2B 대시보드에 Storybook을 도입한 경험.
 MSW로 로딩/에러/빈 상태를 백엔드 없이 재현."
