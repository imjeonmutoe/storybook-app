import { http, HttpResponse } from 'msw'
import type { User, PaginatedResponse } from '@/components/UserList/UserList'
import type { Order } from '@/components/OrderList/OrderList'

const statuses: User['status'][] = ['active', 'inactive', 'pending']
const roles = ['관리자', '에디터', '일반']

// ── 주문 목데이터 ──────────────────────────────────────────
const orderStatuses: Order['status'][] = ['paid', 'shipping', 'completed', 'cancelled']
const products = ['프리미엄 플랜', '스탠다드 플랜', '베이직 플랜', '엔터프라이즈 플랜', '애드온 패키지']
const customers = ['(주)테크웍스', '스타트업A', '글로벌Corp', '로컬비즈', '이노베이션Lab', '디지털파트너스', '클라우드솔루션', '데이터허브']

const allOrders: Order[] = Array.from({ length: 80 }, (_, i) => {
  const statusIdx = i % 4
  const amount = [290000, 150000, 59000, 980000, 45000][i % 5]
  const month = String(Math.floor(i / 8) % 12 + 1).padStart(2, '0')
  const day   = String((i % 28) + 1).padStart(2, '0')
  return {
    id:         String(i + 1),
    orderNo:    `ORD-2026-${String(i + 1).padStart(4, '0')}`,
    customer:   customers[i % customers.length],
    product:    products[i % products.length],
    amount,
    status:     orderStatuses[statusIdx],
    orderedAt:  `2026-${month}-${day}`,
  }
})

const allUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id:        String(i + 1),
  name:      `사용자 ${i + 1}`,
  email:     `user${i + 1}@company.com`,
  role:      roles[i % 3],
  status:    statuses[i % 3],
  createdAt: `2025-${String(Math.floor(i / 10) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
}))

export const handlers = [
  // 유저 목록 (페이지네이션 + 검색)
  http.get('/api/users', ({ request }) => {
    const url    = new URL(request.url)
    const page   = Number(url.searchParams.get('page') ?? 1)
    const limit  = Number(url.searchParams.get('limit') ?? 10)
    const q      = url.searchParams.get('q') ?? ''

    const filtered = q
      ? allUsers.filter((u) => u.name.includes(q) || u.email.includes(q))
      : allUsers

    const start = (page - 1) * limit
    const response: PaginatedResponse = {
      data:  filtered.slice(start, start + limit),
      total: filtered.length,
      page,
      limit,
    }
    return HttpResponse.json(response)
  }),

  // 주문 목록 (페이지네이션 + 상태 필터)
  http.get('/api/orders', ({ request }) => {
    const url    = new URL(request.url)
    const page   = Number(url.searchParams.get('page') ?? 1)
    const limit  = Number(url.searchParams.get('limit') ?? 10)
    const status = url.searchParams.get('status') ?? ''

    const filtered = status
      ? allOrders.filter((o) => o.status === status)
      : allOrders

    const start = (page - 1) * limit
    return HttpResponse.json({
      data:  filtered.slice(start, start + limit),
      total: filtered.length,
      page,
      limit,
    })
  }),

  // 주문 상세
  http.get('/api/orders/:id', ({ params }) => {
    const order = allOrders.find((o) => o.id === params.id)
    if (!order) {
      return HttpResponse.json({ message: '존재하지 않는 주문입니다.' }, { status: 404 })
    }
    return HttpResponse.json({
      ...order,
      buyerName:    `담당자 ${order.id}`,
      buyerEmail:   `buyer${order.id}@company.com`,
      buyerPhone:   '02-1234-5678',
      shippingAddr: '서울특별시 강남구 테헤란로 123',
      memo:         Number(order.id) % 5 === 0 ? '세금계산서 발행 요청' : '',
      paidAt:       order.status !== 'cancelled' ? `${order.orderedAt} 10:32` : null,
    })
  }),

  // 유저 상세
  http.get('/api/users/:id', ({ params }) => {
    const user = allUsers.find((u) => u.id === params.id)
    if (!user) {
      return HttpResponse.json({ message: '존재하지 않는 사용자입니다.' }, { status: 404 })
    }
    return HttpResponse.json({
      ...user,
      phone:       '010-1234-5678',
      address:     '서울특별시 강남구 테헤란로 123',
      memo:        user.role === '관리자' ? '관리자 계정입니다.' : '',
      loginCount:  Math.floor(Math.random() * 500),
      lastLoginAt: '2026-03-25 09:41',
    })
  }),
]