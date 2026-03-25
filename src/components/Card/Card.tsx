import React from 'react'

/**
 * ## Card
 *
 * 콘텐츠를 감싸는 흰색 박스 컴포넌트. 대시보드 통계나 섹션 구분에 사용합니다.
 *
 * | prop       | type        | default | 설명                          |
 * |------------|-------------|---------|-------------------------------|
 * | `title`    | `string`    | —       | 카드 상단 제목                 |
 * | `subtitle` | `string`    | —       | 제목 아래 부제목               |
 * | `extra`    | `ReactNode` | —       | 제목 오른쪽 영역 (버튼 등)     |
 * | `children` | `ReactNode` | —       | 카드 본문 내용                 |
 * | `noPadding`| `boolean`   | `false` | 본문 패딩 제거 (테이블 등에 사용) |
 */
interface CardProps {
  title?: string
  subtitle?: string
  extra?: React.ReactNode
  children?: React.ReactNode
  noPadding?: boolean
}

export function Card({ title, subtitle, extra, children, noPadding = false }: CardProps) {
  const hasHeader = title || subtitle || extra

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {hasHeader && (
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
          <div>
            {title && <h3 className="text-sm font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          {extra && <div className="ml-4 shrink-0">{extra}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'px-5 py-4'}>
        {children}
      </div>
    </div>
  )
}