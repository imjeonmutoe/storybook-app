import React from 'react'

/**
 * ## Header
 *
 * 관리자 대시보드 상단 헤더 컴포넌트.
 *
 * | prop       | type        | default | 설명                              |
 * |------------|-------------|---------|-----------------------------------|
 * | `title`    | `string`    | —       | 현재 페이지 제목                   |
 * | `user`     | `User`      | —       | 로그인한 유저 정보 (이름, 이메일)  |
 * | `onLogout` | `() => void`| —       | 로그아웃 버튼 클릭 핸들러         |
 */

interface User {
  name: string
  email: string
}

interface HeaderProps {
  title: string
  user?: User
  onLogout?: () => void
  onMenuClick?: () => void   // 모바일 햄버거 버튼 클릭
}

export function Header({ title, user, onLogout, onMenuClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-gray-200">
      <div className="flex items-center gap-3">
        {/* 햄버거 버튼 — 모바일 전용 */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="메뉴 열기"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
            {user.name[0]}
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              로그아웃
            </button>
          )}
        </div>
      )}
    </header>
  )
}