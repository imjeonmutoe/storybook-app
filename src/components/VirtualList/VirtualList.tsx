import { useEffect, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

/**
 * ## VirtualList
 *
 * 무한 스크롤 + 가상 스크롤을 지원하는 범용 리스트 컴포넌트.
 * `renderItem`에 어떤 타입이든 넘길 수 있어 UserList, ProductList 등에 재사용 가능.
 *
 * ### Props
 *
 * | prop           | type                        | default | 설명                          |
 * |----------------|-----------------------------|---------|-------------------------------|
 * | `items`        | `T[]`                       |         | 표시할 아이템 배열            |
 * | `hasMore`      | `boolean`                   |         | 추가 로드 가능 여부           |
 * | `loadingMore`  | `boolean`                   |         | 추가 페이지 로딩 중 여부      |
 * | `onLoadMore`   | `() => void`                |         | 하단 도달 시 호출되는 콜백    |
 * | `renderItem`   | `(item: T) => ReactNode`    |         | 아이템 렌더 함수              |
 * | `estimateSize` | `number`                    | `80`    | 아이템 초기 예상 높이 (px)    |
 * | `height`       | `string \| number`          | `480`   | 리스트 컨테이너 높이          |
 *
 * ### 스크롤 위치 보존
 *
 * 부모 컴포넌트를 언마운트하지 않고 `visibility: hidden`으로 숨기면
 * DOM이 유지되어 스크롤 위치가 자동으로 보존됩니다. (별도 저장/복원 불필요)
 */
interface VirtualListProps<T> {
  items: T[]
  hasMore: boolean
  loadingMore: boolean
  onLoadMore: () => void
  renderItem: (item: T) => React.ReactNode
  estimateSize?: number
  height?: string | number
}

export function VirtualList<T>({
  items,
  hasMore,
  loadingMore,
  onLoadMore,
  renderItem,
  estimateSize = 80,
  height = 480,
}: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null)

  const count = hasMore ? items.length + 1 : items.length

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    measureElement: (el) => el?.getBoundingClientRect().height ?? estimateSize,
    overscan: 3,
  })

  // 스크롤이 하단 100px 이내에 도달하면 다음 페이지 요청
  // getVirtualItems() 기반 감지는 overscan으로 인해 조기 발동되어 scroll 이벤트로 처리
  useEffect(() => {
    const el = parentRef.current
    if (!el) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      if (scrollHeight - scrollTop - clientHeight < 100 && hasMore && !loadingMore) {
        onLoadMore()
      }
    }

    el.addEventListener('scroll', handleScroll)
    return () => el.removeEventListener('scroll', handleScroll)
  }, [hasMore, loadingMore, onLoadMore])

  return (
    <div ref={parentRef} className="overflow-auto" style={{ height }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const isLoader = virtualItem.index >= items.length

          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: virtualItem.start,
                left: 0,
                right: 0,
              }}
            >
              {isLoader ? (
                <div className="flex justify-center items-center py-4">
                  {loadingMore && (
                    <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  )}
                </div>
              ) : (
                renderItem(items[virtualItem.index])
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}