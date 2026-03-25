import { useState } from 'react'
import { Card } from '@/components/Card/Card'
import { Input } from '@/components/Input/Input'
import { UserList } from '@/components/UserList/UserList'

// UsersParentLayout이 이 컴포넌트를 언마운트하지 않으므로
// page/query를 URL이 아닌 컴포넌트 state로 관리한다.
// → 상세 페이지 이동 후 돌아와도 검색어·페이지가 그대로 유지됨
export function UsersPage() {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [inputValue, setInputValue] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inputValue.trim()
    setPage(1)
    setQuery(trimmed)
  }

  const handleReset = () => {
    setInputValue('')
    setPage(1)
    setQuery('')
  }

  return (
    <div className="p-6 space-y-4">
      {/* 검색 폼 */}
      <form onSubmit={handleSearch} className="flex gap-2 items-end">
        <div className="flex-1 max-w-sm">
          <Input
            label="사용자 검색"
            placeholder="이름 또는 이메일"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
        >
          검색
        </button>
        {query && (
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
          >
            초기화
          </button>
        )}
      </form>

      {query && (
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-900">"{query}"</span> 검색 결과
        </p>
      )}

      <Card noPadding>
        <UserList
          page={page}
          query={query}
          onPageChange={setPage}
        />
      </Card>
    </div>
  )
}