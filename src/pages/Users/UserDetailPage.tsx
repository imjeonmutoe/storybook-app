import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card } from '@/components/Card/Card'
import { Badge } from '@/components/Badge/Badge'
import { Button } from '@/components/Button/Button'
import type { User } from '@/components/UserList/UserList'

interface UserDetail extends User {
  phone: string
  address: string
  memo: string
  loginCount: number
  lastLoginAt: string
}

const statusMap: Record<User['status'], { label: string; variant: 'success' | 'danger' | 'warning' }> = {
  active:   { label: '활성',   variant: 'success' },
  inactive: { label: '비활성', variant: 'danger'  },
  pending:  { label: '대기',   variant: 'warning' },
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100 last:border-0 gap-1">
      <dt className="w-32 shrink-0 text-xs font-medium text-gray-400">{label}</dt>
      <dd className="text-sm text-gray-900">{value}</dd>
    </div>
  )
}

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    fetch(`/api/users/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(res.status === 404 ? '존재하지 않는 사용자입니다.' : '서버 오류가 발생했습니다.')
        return res.json()
      })
      .then((data: UserDetail) => {
        setUser(data)
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  return (
    <div className="p-6 space-y-4">
      {/* 뒤로가기 */}
      <button
        onClick={() => navigate('/users')}
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
      >
        ← 사용자 목록
      </button>

      {/* 로딩 */}
      {loading && (
        <Card>
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-200" />
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-32" />
                <div className="h-3 bg-gray-200 rounded w-48" />
              </div>
            </div>
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
            <Button variant="secondary" size="sm" onClick={() => navigate('/users')}>
              목록으로 돌아가기
            </Button>
          </div>
        </Card>
      )}

      {/* 정상 */}
      {!loading && !error && user && (
        <>
          {/* 프로필 헤더 */}
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                  {user.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
                    <Badge variant={statusMap[user.status].variant}>
                      {statusMap[user.status].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
                </div>
              </div>
              <div className="flex gap-2 sm:shrink-0">
                <Button variant="secondary" size="sm">수정</Button>
                <Button variant="danger" size="sm">계정 정지</Button>
              </div>
            </div>
          </Card>

          {/* 상세 정보 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card title="기본 정보">
              <dl>
                <InfoRow label="아이디" value={user.id} />
                <InfoRow label="권한" value={user.role} />
                <InfoRow label="연락처" value={user.phone} />
                <InfoRow label="주소" value={user.address} />
                <InfoRow label="가입일" value={user.createdAt} />
              </dl>
            </Card>

            <Card title="활동 정보">
              <dl>
                <InfoRow label="마지막 로그인" value={user.lastLoginAt} />
                <InfoRow label="총 로그인 수" value={`${user.loginCount.toLocaleString()}회`} />
                <InfoRow
                  label="메모"
                  value={
                    user.memo
                      ? <span className="whitespace-pre-wrap">{user.memo}</span>
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