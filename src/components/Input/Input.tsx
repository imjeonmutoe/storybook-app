import React from 'react'

/**
 * ## Input
 *
 * 공통 텍스트 입력 컴포넌트. 레이블, 에러 메시지, 힌트 텍스트를 포함합니다.
 *
 * | prop          | type        | default  | 설명                          |
 * |---------------|-------------|----------|-------------------------------|
 * | `label`       | `string`    | —        | 입력 필드 위 레이블            |
 * | `error`       | `string`    | —        | 에러 메시지 (빨간색으로 표시)  |
 * | `hint`        | `string`    | —        | 힌트 텍스트 (회색으로 표시)    |
 * | `disabled`    | `boolean`   | `false`  | 입력 비활성화                  |
 * | `required`    | `boolean`   | `false`  | 필수 항목 표시 (*)             |
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Input({
  label,
  error,
  hint,
  id,
  required,
  className = '',
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors',
          'placeholder:text-gray-400',
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
            : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
          props.disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white',
          className,
        ].join(' ')}
        required={required}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {!error && hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  )
}