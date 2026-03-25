import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { http, HttpResponse, delay } from 'msw'
import { UserDetailPage } from './UserDetailPage'

const meta = {
  title: 'Pages/UserDetail',
  component: UserDetailPage,
  parameters: {
    layout: 'fullscreen',
  },
  // Storybook은 BrowserRouter가 없으므로 MemoryRouter로 감싸고
  // /users/1 경로에 있는 것처럼 설정
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/users/1']}>
        <Routes>
          <Route path="/users/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof UserDetailPage>

export default meta
type Story = StoryObj<typeof meta>

const mockUser = {
  id:          '1',
  name:        '홍길동',
  email:       'hong@company.com',
  role:        '관리자',
  status:      'active' as const,
  createdAt:   '2025-01-15',
  phone:       '010-1234-5678',
  address:     '서울특별시 강남구 테헤란로 123',
  memo:        '초기 베타 테스터. VIP 고객사 담당자.',
  loginCount:  342,
  lastLoginAt: '2026-03-25 09:41',
}

// 정상: 유저 상세 정보
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users/:id', () => HttpResponse.json(mockUser)),
      ],
    },
  },
}

// 로딩 중
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users/:id', async () => {
          await delay('infinite')
        }),
      ],
    },
  },
}

// 존재하지 않는 유저 (404)
export const NotFound: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users/:id', () =>
          HttpResponse.json({ message: '존재하지 않는 사용자입니다.' }, { status: 404 })
        ),
      ],
    },
  },
}

// 비활성 유저
export const InactiveUser: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users/:id', () =>
          HttpResponse.json({ ...mockUser, status: 'inactive', name: '김철수', email: 'kim@company.com' })
        ),
      ],
    },
  },
}

// 대기 유저
export const PendingUser: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users/:id', () =>
          HttpResponse.json({ ...mockUser, status: 'pending', name: '이영희', email: 'lee@company.com', memo: '' })
        ),
      ],
    },
  },
}