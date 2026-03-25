import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createColumnHelper } from '@tanstack/react-table'
import { Badge } from '@/components/Badge/Badge'
import { VirtualList } from '@/components/VirtualList/VirtualList'
import { DataTable } from '@/components/DataTable/DataTable'

/**
 * ## OrderList
 *
 * 주문 목록 컴포넌트.
 * 데스크탑은 DataTable(TanStack Table), 모바일은 VirtualList 무한 스크롤을 사용합니다.
 *
 * ### 반응형 레이아웃
 *
 * | breakpoint | 레이아웃 | 페이지네이션                      |
 * |------------|----------|-----------------------------------|
 * | md 이상    | DataTable | 서버 사이드 페이지네이션 + 정렬  |
 * | md 미만    | VirtualList 카드 | 무한 스크롤               |
 */

export interface Order {
  id: string
  orderNo: string
  customer: string
  product: string
  amount: number
  status: 'paid' | 'shipping' | 'completed' | 'cancelled'
  orderedAt: string
}

export interface OrderPaginatedResponse {
  data: Order[]
  total: number
  page: number
  limit: number
}

const statusMap: Record<Order['status'], { label: string; variant: 'success' | 'info' | 'warning' | 'danger' }> = {
  paid:      { label: '결제완료', variant: 'info'    },
  shipping:  { label: '배송중',   variant: 'warning' },
  completed: { label: '완료',     variant: 'success' },
  cancelled: { label: '취소',     variant: 'danger'  },
}

const PAGE_LIMIT = 10

const columnHelper = createColumnHelper<Order>()

const columns = [
  columnHelper.accessor('orderNo', {
    header: '주문번호',
    enableSorting: false,
    cell: (info) => <span className="whitespace-nowrap">{info.getValue()}</span>,
  }),
  columnHelper.accessor('customer',  { header: '고객사',   enableSorting: false }),
  columnHelper.accessor('product',   { header: '상품',     enableSorting: false }),
  columnHelper.accessor('amount', {
    header: '금액',
    cell: (info) => `₩${info.getValue().toLocaleString()}`,
    sortingFn: 'basic',
  }),
  columnHelper.accessor('status', {
    header: '상태',
    cell: (info) => (
      <Badge variant={statusMap[info.getValue()].variant}>
        {statusMap[info.getValue()].label}
      </Badge>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('orderedAt', { header: '주문일', sortingFn: 'basic' }),
]

// ── 스켈레톤 (모바일 전용) ─────────────────────────────────
function SkeletonCard() {
  return (
    <div className="p-4 animate-pulse space-y-2 border-b border-gray-100">
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-5 bg-gray-200 rounded-full w-14" />
      </div>
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-1/4" />
    </div>
  )
}

// ── 메인 컴포넌트 ──────────────────────────────────────────
export function OrderList() {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('')

  // ── 데스크탑 상태 ──
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [desktopPage, setDesktopPage] = useState(1)

  // ── 모바일 상태 (누적) ──
  const [mobileOrders, setMobileOrders] = useState<Order[]>([])
  const [mobilePage, setMobilePage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  // ── 공통 상태 ──
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPage = useCallback((targetPage: number, status: string, appendMobile = false) => {
    if (!appendMobile) setLoading(true)
    else setLoadingMore(true)
    setError(null)

    const params = new URLSearchParams({
      page: String(targetPage),
      limit: String(PAGE_LIMIT),
      ...(status ? { status } : {}),
    })

    fetch(`/api/orders?${params}`)
      .then((res) => { if (!res.ok) throw new Error('서버 오류가 발생했습니다.'); return res.json() })
      .then((res: OrderPaginatedResponse) => {
        setOrders(res.data)
        setTotal(res.total)
        setMobileOrders((prev) => {
          const next = appendMobile ? [...prev, ...res.data] : res.data
          setHasMore(next.length < res.total)
          return next
        })
        setLoading(false)
        setLoadingMore(false)
      })
      .catch((err: Error) => { setError(err.message); setLoading(false); setLoadingMore(false) })
  }, [])

  useEffect(() => {
    setMobilePage(1)
    fetchPage(desktopPage, statusFilter)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desktopPage, statusFilter])

  const handleLoadMore = useCallback(() => {
    const next = mobilePage + 1
    setMobilePage(next)
    fetchPage(next, statusFilter, true)
  }, [mobilePage, statusFilter, fetchPage])

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setDesktopPage(1)
  }

  if (!loading && error) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-gray-500 mb-3">{error}</p>
        <button
          onClick={() => fetchPage(desktopPage, statusFilter)}
          className="text-sm text-blue-600 hover:underline cursor-pointer"
        >
          다시 시도
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* 필터 바 */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-200 bg-gray-50">
        <span className="text-xs text-gray-500 font-medium">상태</span>
        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-700 cursor-pointer"
        >
          <option value="">전체</option>
          <option value="paid">결제완료</option>
          <option value="shipping">배송중</option>
          <option value="completed">완료</option>
          <option value="cancelled">취소</option>
        </select>
        {!loading && (
          <span className="text-xs text-gray-400 ml-auto">총 {total}건</span>
        )}
      </div>

      {/* ── 모바일: VirtualList 카드 + 무한 스크롤 ── */}
      <div className="md:hidden">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : (
            <VirtualList<Order>
              items={mobileOrders}
              hasMore={hasMore}
              loadingMore={loadingMore}
              onLoadMore={handleLoadMore}
              estimateSize={72}
              renderItem={(order) => (
                <div
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="flex items-start justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{order.orderNo}</p>
                    <p className="text-xs text-gray-400 truncate">{order.customer} · {order.product}</p>
                    <p className="text-xs text-gray-400">{order.orderedAt} · ₩{order.amount.toLocaleString()}</p>
                  </div>
                  <Badge variant={statusMap[order.status].variant}>
                    {statusMap[order.status].label}
                  </Badge>
                </div>
              )}
            />
          )
        }
      </div>

      {/* ── 데스크탑: DataTable ── */}
      <div className="hidden md:block">
        <DataTable<Order>
          columns={columns}
          data={orders}
          total={total}
          page={desktopPage}
          limit={PAGE_LIMIT}
          loading={loading}
          onPageChange={setDesktopPage}
          onRowClick={(order) => navigate(`/orders/${order.id}`)}
          minWidth="700px"
        />
      </div>
    </div>
  )
}