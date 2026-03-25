import { Card } from '@/components/Card/Card'
import { Badge } from '@/components/Badge/Badge'

const stats = [
  { title: '전체 사용자',  subtitle: '누적 가입자 수',    value: '1,234명', change: '+12%',  trend: 'up' },
  { title: '이번 달 신규', subtitle: '최근 30일 기준',    value: '48명',    change: '+8%',   trend: 'up' },
  { title: '활성 사용자',  subtitle: '오늘 기준',          value: '891명',   change: '-3%',   trend: 'down' },
  { title: '대기 중',      subtitle: '승인 필요',          value: '17명',    change: '+5명',  trend: 'up' },
]

const recentActivities = [
  { id: '1', user: '홍길동', action: '회원가입',    status: 'success' as const, time: '5분 전' },
  { id: '2', user: '김철수', action: '계정 정지',   status: 'danger'  as const, time: '23분 전' },
  { id: '3', user: '이영희', action: '권한 변경',   status: 'info'    as const, time: '1시간 전' },
  { id: '4', user: '박민준', action: '승인 대기',   status: 'warning' as const, time: '2시간 전' },
  { id: '5', user: '최수진', action: '프로필 수정', status: 'default' as const, time: '3시간 전' },
]

const actionLabels: Record<string, string> = {
  success: '완료',
  danger:  '정지',
  info:    '변경',
  warning: '대기',
  default: '수정',
}

export function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} title={stat.title} subtitle={stat.subtitle}>
            <div className="flex items-end justify-between mt-1">
              <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                {stat.change}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Card title="최근 활동" subtitle="최근 발생한 사용자 이벤트">
        <ul className="divide-y divide-gray-100 -mx-5 -mb-4">
          {recentActivities.map((activity) => (
            <li key={activity.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold shrink-0">
                  {activity.user[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                  <p className="text-xs text-gray-400">{activity.action}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={activity.status}>{actionLabels[activity.status]}</Badge>
                <span className="text-xs text-gray-400 shrink-0">{activity.time}</span>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}