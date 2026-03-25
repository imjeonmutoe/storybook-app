/**
 * ## Pagination
 *
 * 번호 클릭 방식의 페이지네이션 컴포넌트.
 *
 * ### Props
 *
 * | prop       | type                       | 설명                        |
 * |------------|----------------------------|-----------------------------|
 * | `total`    | `number`                   | 전체 아이템 수              |
 * | `page`     | `number`                   | 현재 페이지 (1부터 시작)    |
 * | `limit`    | `number`                   | 페이지당 아이템 수          |
 * | `onChange` | `(page: number) => void`   | 페이지 변경 콜백            |
 */
export function Pagination({
  total, page, limit, onChange,
}: {
  total: number
  page: number
  limit: number
  onChange: (page: number) => void
}) {
  const totalPages = Math.ceil(total / limit)
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
      <p className="text-xs text-gray-400">
        총 <span className="font-medium text-gray-700">{total}</span>명
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="px-2 py-1 text-xs rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          ←
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={[
              'w-7 h-7 text-xs rounded cursor-pointer transition-colors',
              p === page
                ? 'bg-blue-600 text-white font-medium'
                : 'text-gray-500 hover:bg-gray-100',
            ].join(' ')}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="px-2 py-1 text-xs rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          →
        </button>
      </div>
    </div>
  )
}