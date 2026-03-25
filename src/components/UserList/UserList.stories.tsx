import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse, delay } from 'msw'
import { UserList } from './UserList'
import type { User, PaginatedResponse } from './UserList'

const meta = {
  title: 'Components/UserList',
  component: UserList,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="p-6 bg-gray-50 min-h-screen">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <Story />
          </div>
        </div>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof UserList>

export default meta
type Story = StoryObj<typeof meta>

// 50명의 목 데이터 생성
const statuses: User['status'][] = ['active', 'inactive', 'pending']
const roles = ['관리자', '에디터', '일반']

const allMockUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id:        String(i + 1),
  name:      `사용자 ${i + 1}`,
  email:     `user${i + 1}@company.com`,
  role:      roles[i % 3],
  status:    statuses[i % 3],
  createdAt: `2025-${String(Math.floor(i / 10) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
}))

// 페이지네이션 핸들러 — page/limit 쿼리 파라미터 기반
function makePaginatedHandler(users: User[]) {
  return http.get('/api/users', ({ request }) => {
    const url = new URL(request.url)
    const page  = Number(url.searchParams.get('page') ?? 1)
    const limit = Number(url.searchParams.get('limit') ?? 10)
    const start = (page - 1) * limit
    const response: PaginatedResponse = {
      data:  users.slice(start, start + limit),
      total: users.length,
      page,
      limit,
    }
    return HttpResponse.json(response)
  })
}

// 정상: 50명, 페이지네이션 동작
export const Default: Story = {
  parameters: {
    msw: { handlers: [makePaginatedHandler(allMockUsers)] },
  },
}

// 로딩: 응답 대기
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users', async () => {
          await delay('infinite')
        }),
      ],
    },
  },
}

// 에러: 500 응답
export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users', () =>
          HttpResponse.json({ message: '서버 오류' }, { status: 500 })
        ),
      ],
    },
  },
}

// 빈 상태
export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users', () =>
          HttpResponse.json({ data: [], total: 0, page: 1, limit: 10 })
        ),
      ],
    },
  },
}

// 느린 네트워크: 2초 지연
export const SlowNetwork: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users', async ({ request }) => {
          await delay(2000)
          const url = new URL(request.url)
          const page  = Number(url.searchParams.get('page') ?? 1)
          const limit = Number(url.searchParams.get('limit') ?? 10)
          const start = (page - 1) * limit
          return HttpResponse.json({
            data:  allMockUsers.slice(start, start + limit),
            total: allMockUsers.length,
            page,
            limit,
          })
        }),
      ],
    },
  },
}