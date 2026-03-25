import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse, delay } from 'msw'
import { UsersPage } from './UsersPage'
import type { User, PaginatedResponse } from '@/components/UserList/UserList'

const meta = {
  title: 'Pages/Users',
  component: UsersPage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof UsersPage>

export default meta
type Story = StoryObj<typeof meta>

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

// 검색어 + 페이지네이션 둘 다 처리하는 핸들러
const searchHandler = http.get('/api/users', ({ request }) => {
  const url    = new URL(request.url)
  const page   = Number(url.searchParams.get('page') ?? 1)
  const limit  = Number(url.searchParams.get('limit') ?? 10)
  const q      = url.searchParams.get('q') ?? ''

  const filtered = q
    ? allMockUsers.filter(
        (u) => u.name.includes(q) || u.email.includes(q)
      )
    : allMockUsers

  const start = (page - 1) * limit
  const response: PaginatedResponse = {
    data:  filtered.slice(start, start + limit),
    total: filtered.length,
    page,
    limit,
  }
  return HttpResponse.json(response)
})

// 정상: 검색 가능한 유저 50명
export const Default: Story = {
  parameters: {
    msw: { handlers: [searchHandler] },
  },
}

// 검색 결과 없음
export const SearchNoResult: Story = {
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

// 느린 네트워크
export const SlowNetwork: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users', async ({ request }) => {
          await delay(2000)
          const url    = new URL(request.url)
          const page   = Number(url.searchParams.get('page') ?? 1)
          const limit  = Number(url.searchParams.get('limit') ?? 10)
          const start  = (page - 1) * limit
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