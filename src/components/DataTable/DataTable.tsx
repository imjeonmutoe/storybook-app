import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { Pagination } from '@/components/Pagination/Pagination'

/**
 * ## DataTable
 *
 * TanStack Table v8 기반 범용 데이터 테이블 컴포넌트.
 * 서버 사이드 페이지네이션 + 클라이언트 사이드 컬럼 정렬을 지원합니다.
 *
 * ### Props
 *
 * | prop          | type                      | default | 설명                          |
 * |---------------|---------------------------|---------|-------------------------------|
 * | `columns`     | `ColumnDef<T>[]`          |         | TanStack Table 컬럼 정의      |
 * | `data`        | `T[]`                     |         | 현재 페이지 데이터            |
 * | `total`       | `number`                  |         | 전체 아이템 수                |
 * | `page`        | `number`                  |         | 현재 페이지 (1-based)         |
 * | `limit`       | `number`                  | `10`    | 페이지당 아이템 수            |
 * | `loading`     | `boolean`                 | `false` | 스켈레톤 표시 여부            |
 * | `onPageChange`| `(page: number) => void`  |         | 페이지 변경 콜백              |
 * | `onRowClick`  | `(row: T) => void`        |         | 행 클릭 콜백 (선택)           |
 * | `minWidth`    | `string`                  | `600px` | 테이블 최소 너비              |
 */

interface DataTableProps<T> {
  columns: ColumnDef<T, any>[]
  data: T[]
  total: number
  page: number
  limit?: number
  loading?: boolean
  onPageChange: (page: number) => void
  onRowClick?: (row: T) => void
  minWidth?: string
}

function SortIcon({ direction }: { direction: 'asc' | 'desc' | false }) {
  if (!direction) {
    return (
      <svg className="w-3.5 h-3.5 text-gray-300 ml-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    )
  }
  return (
    <svg className="w-3.5 h-3.5 text-blue-600 ml-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {direction === 'asc'
        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      }
    </svg>
  )
}

export function DataTable<T>({
  columns,
  data,
  total,
  page,
  limit = 10,
  loading = false,
  onPageChange,
  onRowClick,
  minWidth = '600px',
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    rowCount: total,
    initialState: { pagination: { pageSize: limit } },
  })

  return (
    <div>
      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth }}>
          <thead className="bg-gray-50 border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={[
                      'px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wide',
                      header.column.getCanSort() ? 'cursor-pointer select-none hover:text-gray-700' : '',
                    ].join(' ')}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <SortIcon direction={header.column.getIsSorted()} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading
              ? Array.from({ length: limit }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
              : table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={[
                    'hover:bg-gray-50 transition-colors',
                    onRowClick ? 'cursor-pointer' : '',
                  ].join(' ')}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-4 text-gray-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {!loading && (
        <Pagination
          total={total}
          page={page}
          limit={limit}
          onChange={onPageChange}
        />
      )}
    </div>
  )
}