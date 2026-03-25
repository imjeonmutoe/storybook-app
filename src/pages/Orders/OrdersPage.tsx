import { Card } from '@/components/Card/Card'
import { OrderList } from '@/components/OrderList/OrderList'

export function OrdersPage() {
  return (
    <div className="p-6 space-y-4">
      <Card noPadding>
        <OrderList />
      </Card>
    </div>
  )
}