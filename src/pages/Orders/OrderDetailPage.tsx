import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card } from '@/components/Card/Card'
import { Badge } from '@/components/Badge/Badge'
import { Button } from '@/components/Button/Button'
import type { Order } from '@/components/OrderList/OrderList'

interface OrderDetail extends Order {
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  shippingAddr: string
  memo: string
  paidAt: string | null
}

const statusMap: Record<Order['status'], { label: string; variant: 'success' | 'info' | 'warning' | 'danger' }> = {
  paid:      { label: '결제완료', variant: 'info'    },
  shipping:  { label: '배송중',   variant: 'warning' },
  completed: { label: '완료',     variant: 'success' },
  cancelled: { label: '취소',     variant: 'danger'  },
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100 last:border-0 gap-1">
      <dt className="w-32 shrink-0 text-xs font-medium text-gray-400">{label}</dt>
      <dd className="text-sm text-gray-900">{value}</dd>
    </div>
  )
}

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    fetch(`/api/orders/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(res.status === 404 ? '존재하지 않는 주문입니다.' : '서버 오류가 발생했습니다.')
        return res.json()
      })
      .then((data: OrderDetail) => { setOrder(data); setLoading(false) })
      .catch((err: Error) => { setError(err.message); setLoading(false) })
  }, [id])

  return (
    <div className="p-6 space-y-4">
      {/* 뒤로가기 */}
      <button
        onClick={() => navigate('/orders')}
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
      >
        ← 주문 목록
      </button>

      {/* 로딩 */}
      {loading && (
        <Card>
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-48" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full" />
            ))}
          </div>
        </Card>
      )}

      {/* 에러 */}
      {!loading && error && (
        <Card>
          <div className="py-12 text-center space-y-3">
            <p className="text-sm text-gray-500">{error}</p>
            <Button variant="secondary" size="sm" onClick={() => navigate('/orders')}>
              목록으로 돌아가기
            </Button>
          </div>
        </Card>
      )}

      {/* 정상 */}
      {!loading && !error && order && (
        <>
          {/* 주문 헤더 */}
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-gray-900">{order.orderNo}</h2>
                  <Badge variant={statusMap[order.status].variant}>
                    {statusMap[order.status].label}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mt-0.5">{order.customer} · {order.orderedAt}</p>
              </div>
              <div className="flex gap-2 sm:shrink-0">
                <Button variant="secondary" size="sm">영수증 출력</Button>
                {order.status !== 'cancelled' && (
                  <Button variant="danger" size="sm">주문 취소</Button>
                )}
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 주문 정보 */}
            <Card title="주문 정보">
              <dl>
                <InfoRow label="주문번호" value={order.orderNo} />
                <InfoRow label="상품" value={order.product} />
                <InfoRow label="금액" value={`₩${order.amount.toLocaleString()}`} />
                <InfoRow label="주문일" value={order.orderedAt} />
                <InfoRow label="결제일" value={order.paidAt ?? <span className="text-gray-400">-</span>} />
              </dl>
            </Card>

            {/* 구매자 정보 */}
            <Card title="구매자 정보">
              <dl>
                <InfoRow label="고객사" value={order.customer} />
                <InfoRow label="담당자" value={order.buyerName} />
                <InfoRow label="이메일" value={order.buyerEmail} />
                <InfoRow label="연락처" value={order.buyerPhone} />
                <InfoRow label="배송지" value={order.shippingAddr} />
                <InfoRow
                  label="메모"
                  value={
                    order.memo
                      ? <span className="whitespace-pre-wrap">{order.memo}</span>
                      : <span className="text-gray-400">-</span>
                  }
                />
              </dl>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}