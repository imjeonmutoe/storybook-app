# 컴포넌트 문서

> storybook-app 공통 컴포넌트 Props 레퍼런스

---

## 목차

- [Button](#button)
- [Input](#input)
- [Badge](#badge)
- [Card](#card)
- [Header](#header)
- [UserList](#userlist)

---

## Button

공통 버튼 컴포넌트. `variant`로 색상, `size`로 크기를 제어합니다.

| prop       | type                                  | default   | 설명                        |
|------------|---------------------------------------|-----------|-----------------------------|
| `variant`  | `primary` \| `secondary` \| `danger`  | `primary` | 버튼 색상 스타일             |
| `size`     | `sm` \| `md` \| `lg`                  | `md`      | 버튼 크기                    |
| `loading`  | `boolean`                             | `false`   | 스피너 표시 + 클릭 비활성화  |
| `disabled` | `boolean`                             | `false`   | 버튼 비활성화                |
| `children` | `ReactNode`                           | —         | 버튼 내부 텍스트/아이콘      |

```tsx
<Button variant="primary" size="md">저장하기</Button>
<Button variant="danger" size="sm">삭제</Button>
<Button loading>저장 중...</Button>
```

---

## Input

공통 텍스트 입력 컴포넌트. 레이블, 에러 메시지, 힌트 텍스트를 포함합니다.

| prop       | type      | default | 설명                         |
|------------|-----------|---------|------------------------------|
| `label`    | `string`  | —       | 입력 필드 위 레이블           |
| `error`    | `string`  | —       | 에러 메시지 (빨간색으로 표시) |
| `hint`     | `string`  | —       | 힌트 텍스트 (회색으로 표시)   |
| `disabled` | `boolean` | `false` | 입력 비활성화                 |
| `required` | `boolean` | `false` | 필수 항목 표시 (*)            |

> `error`와 `hint`는 동시에 표시되지 않습니다. `error`가 있으면 `hint`는 숨겨집니다.

```tsx
<Input label="이메일" placeholder="example@email.com" />
<Input label="비밀번호" hint="8자 이상 입력하세요." type="password" />
<Input label="이메일" error="올바른 이메일 형식이 아닙니다." />
<Input label="이름" required />
```

---

## Badge

상태나 카테고리를 표시하는 작은 라벨 컴포넌트.

| prop       | type                                                       | default   | 설명            |
|------------|------------------------------------------------------------|-----------|-----------------|
| `variant`  | `default` \| `success` \| `warning` \| `danger` \| `info` | `default` | 배지 색상 스타일 |
| `children` | `ReactNode`                                                | —         | 배지 내부 텍스트 |

| variant   | 색상      | 사용 예시       |
|-----------|-----------|-----------------|
| `default` | 회색      | 일반, 기타      |
| `success` | 초록      | 활성, 완료      |
| `warning` | 노랑      | 대기, 주의      |
| `danger`  | 빨강      | 정지, 오류      |
| `info`    | 파랑      | 신규, 안내      |

```tsx
<Badge variant="success">활성</Badge>
<Badge variant="danger">정지</Badge>
<Badge variant="warning">대기</Badge>
```

---

## Card

콘텐츠를 감싸는 흰색 박스 컴포넌트. 대시보드 통계나 섹션 구분에 사용합니다.

| prop        | type        | default | 설명                              |
|-------------|-------------|---------|-----------------------------------|
| `title`     | `string`    | —       | 카드 상단 제목                     |
| `subtitle`  | `string`    | —       | 제목 아래 부제목                   |
| `extra`     | `ReactNode` | —       | 제목 오른쪽 영역 (버튼, 배지 등)   |
| `children`  | `ReactNode` | —       | 카드 본문 내용                     |
| `noPadding` | `boolean`   | `false` | 본문 패딩 제거 (테이블 등에 사용)  |

> 테이블을 `children`으로 넣을 때는 `noPadding`을 사용하면 테이블이 카드 전체 너비를 채웁니다.

```tsx
<Card title="전체 사용자" subtitle="이번 달 기준">
  <p className="text-2xl font-bold">1,234명</p>
</Card>

<Card title="사용자 목록" noPadding>
  <table>...</table>
</Card>

<Card title="서비스 상태" extra={<Badge variant="success">정상</Badge>}>
  <p>모든 시스템이 정상 동작 중입니다.</p>
</Card>
```

---

## Header

관리자 대시보드 상단 헤더 컴포넌트.

| prop       | type                    | default | 설명                             |
|------------|-------------------------|---------|----------------------------------|
| `title`    | `string`                | —       | 현재 페이지 제목                  |
| `user`     | `{ name, email }`       | —       | 로그인한 유저 정보 (이름, 이메일) |
| `onLogout` | `() => void`            | —       | 로그아웃 버튼 클릭 핸들러        |

> `user`가 없으면 우측 유저 영역이 표시되지 않습니다.
> `onLogout`이 없으면 로그아웃 버튼이 표시되지 않습니다.

```tsx
<Header
  title="대시보드"
  user={{ name: '홍길동', email: 'hong@company.com' }}
  onLogout={() => navigate('/login')}
/>
```

---

## UserList

유저 목록을 `/api/users`에서 불러와 표시하는 반응형 컴포넌트.
화면 너비에 따라 레이아웃과 페이지네이션 방식이 자동으로 전환됩니다.

### Props

| prop    | type     | default | 설명                                    |
|---------|----------|---------|-----------------------------------------|
| `query` | `string` | `''`    | 검색어. 변경 시 page 1로 리셋 후 재조회 |

### API

```
GET /api/users?page=1&limit=10           // 기본 조회
GET /api/users?page=1&limit=10&q=홍길동  // 검색
```

응답 형식:
```ts
{
  data:  User[]  // 현재 페이지 데이터
  total: number  // 전체 유저 수
  page:  number  // 현재 페이지
  limit: number  // 페이지당 개수
}
```

### 반응형 레이아웃

| breakpoint | 레이아웃 | 페이지네이션                                        |
|------------|----------|-----------------------------------------------------|
| md 이상    | 테이블   | 번호 클릭 (`?page=&limit=10`)                       |
| md 미만    | 카드     | 무한 스크롤 + `@tanstack/react-virtual` 가상 스크롤 |

#### 모바일 데이터 전략

데스크탑과 모바일은 데이터 상태를 분리해서 관리합니다.

| 구분 | 데스크탑 | 모바일 |
|------|---------|--------|
| 데이터 보관 | 현재 페이지만 유지 (교체) | 전체 누적 (append) |
| 다음 데이터 | 페이지 번호 클릭 | 스크롤 끝 도달 시 자동 로드 |
| 아이템 높이 | 고정 | 가변 (`measureElement`로 실측) |

> 카드 아이템 높이는 `estimateSize`로 초기 추정 후, 실제 렌더 시 `measureElement`로 DOM 높이를 재측정합니다.
> 콘텐츠 길이가 달라도 스크롤 위치가 틀어지지 않습니다.

### 상태별 표시

| 상태          | 조건                      | 표시                             |
|---------------|---------------------------|----------------------------------|
| `loading`     | 첫 API 응답 대기 중       | 스켈레톤 애니메이션               |
| `loadingMore` | 추가 페이지 로딩 중       | 리스트 하단 스피너 (모바일)       |
| `error`       | 네트워크 오류 / 서버 에러 | 에러 메시지 + 재시도 버튼         |
| `empty`       | 응답은 성공, 데이터 없음  | 빈 상태 안내 메시지               |
| `success`     | 데이터 정상 수신          | 테이블 (desktop) / 카드 (mobile) |

```tsx
// 기본 사용
<UserList />

// 검색어 연동 (UsersPage에서 사용)
<UserList query={searchQuery} />
```