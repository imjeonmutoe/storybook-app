import type { Meta, StoryObj } from '@storybook/react-vite'
import { Header } from './Header'

const meta = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

const mockUser = {
  name: '홍길동',
  email: 'hong@company.com',
}

export const Default: Story = {
  args: {
    title: '대시보드',
    user: mockUser,
  },
}

export const WithLogout: Story = {
  args: {
    title: '사용자 관리',
    user: mockUser,
    onLogout: () => alert('로그아웃'),
  },
}

export const NoUser: Story = {
  args: {
    title: '대시보드',
  },
}

export const LongTitle: Story = {
  args: {
    title: '사용자 상세 정보',
    user: { name: '김관리자', email: 'admin@company.com' },
    onLogout: () => alert('로그아웃'),
  },
}