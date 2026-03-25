import React from 'react'

/**
 * ## Badge
 *
 * 상태나 카테고리를 표시하는 작은 라벨 컴포넌트.
 *
 * | prop      | type                                                        | default   | 설명              |
 * |-----------|-------------------------------------------------------------|-----------|-------------------|
 * | `variant` | `default` \| `success` \| `warning` \| `danger` \| `info`  | `default` | 배지 색상 스타일   |
 * | `children` | `ReactNode`                                                | —         | 배지 내부 텍스트   |
 */

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-600',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger:  'bg-red-100 text-red-700',
  info:    'bg-blue-100 text-blue-700',
}

export function Badge({ variant = 'default', children }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        variantStyles[variant],
      ].join(' ')}
    >
      {children}
    </span>
  )
}