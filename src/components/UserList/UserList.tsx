import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/Badge/Badge'
import { Pagination } from '@/components/Pagination/Pagination'
import { VirtualList } from '@/components/VirtualList/VirtualList'

/**
 * ## UserList
 *
 * 유저 목록을 `/api/users`에서 불러와 표시하는 반응형 컴포넌트.
 * 화면 너비에 따라 레이아웃과 페이지네이션 방식이 자동으로 전환됩니다.
 *
 * ### Props
 *
 * | prop           | type                       | default | 설명                                      |
 * |----------------|----------------------------|---------|-------------------------------------------|
 * | `page`         | `number`                   | `1`     | 현재 페이지 (데스크탑)                    |
 * | `query`        | `string`                   | `''`    | 검색어. 변경 시 page 1로 리셋 후 재조회   |
 * | `onPageChange` | `(page: number) => void`   |         | 페이지 변경 콜백                          |
 *
 * ### 반응형 레이아웃
 *
 * | breakpoint | 레이아웃 | 페이지네이션                            |
 * |------------|----------|-----------------------------------------|
 * | md 이상    | 테이블   | 번호 클릭 (`Pagination` 컴포넌트)       |
 * | md 미만    | 카드     | 무한 스크롤 + `VirtualList` 컴포넌트    |
 *
 * ### 상태별 표시
 *
 * | 상태        | 조건                      | 표시                             |
 * |-------------|---------------------------|----------------------------------|
 * | loading     | 첫 API 응답 대기 중       | 스켈레톤 애니메이션               |
 * | loadingMore | 추가 페이지 로딩 중       | 리스트 하단 스피너 (모바일)       |
 * | error       | 네트워크 오류 / 서버 에러 | 에러 메시지 + 재시도 버튼         |
 * | empty       | 응답은 성공, 데이터 없음  | 빈 상태 안내 메시지               |
 * | success     | 데이터 정상 수신          | 테이블 (desktop) / 카드 (mobile) |
 */

export interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
}

export interface PaginatedResponse {
  data: User[]
  total: number
  page: number
  limit: number
}

const statusMap: Record<User['status'], { label: string; variant: 'success' | 'danger' | 'warning' }> = {
  active:   { label: '활성',   variant: 'success' },
  inactive: { label: '비활성', variant: 'danger'  },
  pending:  { label: '대기',   variant: 'warning' },
}

const PAGE_LIMIT = 10

// ── 스켈레톤 ──────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </td>
      ))}
    </tr>
  )
}

function SkeletonCard() {
  return (
    <div className="p-4 animate-pulse space-y-2 border-b border-gray-100">
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-5 bg-gray-200 rounded-full w-12" />
      </div>
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
    </div>
  )
}

// ── 메인 컴포넌트 ─────────────────────────────────────────
interface UserListProps {
  page?: number
  query?: string
  onPageChange?: (page: number) => void
}

export function UserList({ page = 1, query = '', onPageChange }: UserListProps) {
  const navigate = useNavigate()

  // ── 데스크탑 상태 ──
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)

  // ── 모바일 상태 (누적) ──
  const [mobileUsers, setMobileUsers] = useState<User[]>([])
  const [mobilePage, setMobilePage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  // ── 공통 상태 ──
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPage = useCallback((targetPage: number, q: string, appendMobile = false) => {
    if (!appendMobile) setLoading(true)
    else setLoadingMore(true)
    setError(null)
    const params = new URLSearchParams({
      page: String(targetPage), limit: String(PAGE_LIMIT), ...(q ? { q } : {}),
    })
    fetch(`/api/users?${params}`)
      .then((res) => { if (!res.ok) throw new Error('서버 오류가 발생했습니다.'); return res.json() })
      .then((res: PaginatedResponse) => {
        setUsers(res.data)
        setTotal(res.total)
        setMobileUsers((prev) => {
          const next = appendMobile ? [...prev, ...res.data] : res.data
          setHasMore(next.length < res.total)
          return next
        })
        setLoading(false)
        setLoadingMore(false)
      })
      .catch((err: Error) => { setError(err.message); setLoading(false); setLoadingMore(false) })
  }, [])

  // page 또는 query가 바뀔 때만 fetch
  // UsersParentLayout이 이 컴포넌트를 언마운트하지 않으므로
  // 상세 페이지 이동 후 돌아와도 이 effect는 재실행되지 않음 → API 재호출 없음
  useEffect(() => {
    setMobilePage(1)
    fetchPage(page, query)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, query])

  // 모바일 무한 스크롤 — 다음 페이지 누적
  const handleLoadMore = useCallback(() => {
    const next = mobilePage + 1
    setMobilePage(next)
    fetchPage(next, query, true)
  }, [mobilePage, query, fetchPage])

  if (!loading && error) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-gray-500 mb-3">{error}</p>
        <button
          onClick={() => fetchPage(page, query)}
          className="text-sm text-blue-600 hover:underline cursor-pointer"
        >
          다시 시도
        </button>
      </div>
    )
  }

  if (!loading && users.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-gray-400">
        등록된 사용자가 없습니다.
      </div>
    )
  }

  return (
    <>
      {/* ── 데스크탑: 테이블 + 번호 페이지네이션 ── */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['이름', '이메일', '권한', '상태', '가입일'].map((col) => (
                  <th key={col} className="px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wide">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading
                ? Array.from({ length: PAGE_LIMIT }).map((_, i) => <SkeletonRow key={i} />)
                : users.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => navigate(`/users/${user.id}`)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4 font-medium text-gray-900">{user.name}</td>
                    <td className="px-5 py-4 text-gray-500">{user.email}</td>
                    <td className="px-5 py-4 text-gray-500">{user.role}</td>
                    <td className="px-5 py-4">
                      <Badge variant={statusMap[user.status].variant}>
                        {statusMap[user.status].label}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{user.createdAt}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        {!loading && (
          <Pagination total={total} page={page} limit={PAGE_LIMIT} onChange={(p) => onPageChange?.(p)} />
        )}
      </div>

      {/* ── 모바일: 무한 스크롤 + 가상 스크롤 카드 ── */}
      <div className="md:hidden">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : (
            <VirtualList<User>
              items={mobileUsers}
              hasMore={hasMore}
              loadingMore={loadingMore}
              onLoadMore={handleLoadMore}
              renderItem={(user) => (
                <div
                  key={user.id}
                  onClick={() => navigate(`/users/${user.id}`)}
                  className="flex items-start justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold shrink-0">
                      {user.name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      <p className="text-xs text-gray-400">{user.role} · {user.createdAt}</p>
                    </div>
                  </div>
                  <Badge variant={statusMap[user.status].variant}>
                    {statusMap[user.status].label}
                  </Badge>
                </div>
              )}
            />
          )
        }
      </div>
    </>
  )
}