import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink, Navigate, useMatch } from 'react-router-dom'
import { Header } from '@/components/Header/Header'
import { DashboardPage } from '@/pages/Dashboard/DashboardPage'
import { UsersPage } from '@/pages/Users/UsersPage'
import { UserDetailPage } from '@/pages/Users/UserDetailPage'
import { OrdersPage } from '@/pages/Orders/OrdersPage'
import { OrderDetailPage } from '@/pages/Orders/OrderDetailPage'

const mockUser = { name: '홍길동', email: 'hong@company.com' }

const navItems = [
  { to: '/',       label: '대시보드' },
  { to: '/users',  label: '사용자 관리' },
  { to: '/orders', label: '주문 관리' },
]

function OrdersParentLayout() {
  const match = useMatch('/orders/:id')
  const isDetail = !!match

  return (
    <>
      <div
        style={{
          visibility: isDetail ? 'hidden' : 'visible',
          height:     isDetail ? 0       : 'auto',
          overflow:   isDetail ? 'hidden' : 'visible',
        }}
      >
        <OrdersPage />
      </div>
      {isDetail && <OrderDetailPage />}
    </>
  )
}

// UsersPage를 언마운트하지 않고 CSS로 숨기기만 한다.
// → 뒤로가기 시 API 재호출 없이 기존 state 그대로 복원
function UsersParentLayout() {
  const match = useMatch('/users/:id')
  const isDetail = !!match

  return (
    <>
      {/* 상세 페이지로 이동해도 UsersPage는 DOM에 유지 (visibility로 숨김) */}
      <div
        style={{
          visibility: isDetail ? 'hidden' : 'visible',
          height:     isDetail ? 0       : 'auto',
          overflow:   isDetail ? 'hidden' : 'visible',
        }}
      >
        <UsersPage />
      </div>
      {isDetail && <UserDetailPage />}
    </>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Admin"
        user={mockUser}
        onLogout={() => alert('로그아웃')}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="flex relative">
        {/* 모바일 딤 배경 */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 top-16 bg-black/30 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* 사이드바 — 데스크탑: 항상 표시 / 모바일: 오버레이 슬라이드 */}
        <aside
          className={[
            'fixed md:static top-16 left-0 z-30',
            'w-48 shrink-0 h-[calc(100vh-4rem)] md:min-h-[calc(100vh-4rem)]',
            'bg-white border-r border-gray-200 py-4',
            'transition-transform duration-200 ease-in-out',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          ].join(' ')}
        >
          <nav className="flex flex-col gap-1 px-2">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  [
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100',
                  ].join(' ')
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />

          {/* /users 와 /users/:id 를 하나의 부모 레이아웃으로 묶어 UsersPage 유지 */}
          <Route path="/users" element={<UsersParentLayout />}>
            <Route index element={null} />
            <Route path=":id" element={null} />
          </Route>

          <Route path="/orders" element={<OrdersParentLayout />}>
            <Route index element={null} />
            <Route path=":id" element={null} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}