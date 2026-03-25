/**
 * ## Pagination
 *
 * 번호 클릭 방식의 페이지네이션 컴포넌트.
 *
 * ### Props
 *
 * | prop       | type                       | default | 설명                        |
 * |------------|----------------------------|---------|-----------------------------|
 * | `total`    | `number`                   |         | 전체 아이템 수              |
 * | `page`     | `number`                   |         | 현재 페이지 (1부터 시작)    |
 * | `limit`    | `number`                   |         | 페이지당 아이템 수          |
 * | `onChange` | `(page: number) => void`   |         | 페이지 변경 콜백            |
 * | `unit`     | `string`                   | `'건'`  | 총 개수 표시 단위           |
 */
export function Pagination({
  total, page, limit, onChange, unit = '건',
}: {
  total: number
  page: number
  limit: number
  onChange: (page: number) => void
  unit?: string
}) {
  const totalPages = Math.ceil(total / limit)
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
      <p className="text-xs text-gray-400">
        총 <span className="font-medium text-gray-700">{total}</span>{unit}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(1)}
          disabled={page === 1}
          className="px-2 py-1 text-xs rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >«</button>
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="px-2 py-1 text-xs rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >‹</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => Math.abs(p - page) <= 2)
          .map((p) => (
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
          ))
        }
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="px-2 py-1 text-xs rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >›</button>
        <button
          onClick={() => onChange(totalPages)}
          disabled={page === totalPages}
          className="px-2 py-1 text-xs rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >»</button>
      </div>
    </div>
  )
}