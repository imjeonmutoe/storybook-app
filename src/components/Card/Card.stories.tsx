import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from './Card'
import { Button } from '@/components/Button/Button'
import { Badge } from '@/components/Badge/Badge'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card title="전체 사용자" subtitle="이번 달 기준">
      <p className="text-2xl font-bold text-gray-900">1,234명</p>
    </Card>
  ),
}

export const WithExtra: Story = {
  render: () => (
    <Card
      title="최근 가입자"
      subtitle="최근 7일"
      extra={<Button size="sm" variant="secondary">전체 보기</Button>}
    >
      <p className="text-2xl font-bold text-gray-900">48명</p>
    </Card>
  ),
}

export const WithBadge: Story = {
  render: () => (
    <Card title="서비스 상태" extra={<Badge variant="success">정상</Badge>}>
      <p className="text-sm text-gray-500">모든 시스템이 정상 동작 중입니다.</p>
    </Card>
  ),
}

export const NoHeader: Story = {
  render: () => (
    <Card>
      <p className="text-sm text-gray-600">헤더 없이 본문만 있는 카드입니다.</p>
    </Card>
  ),
}

export const NoPadding: Story = {
  render: () => (
    <Card title="사용자 목록" noPadding>
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">이름</th>
            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">상태</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <tr>
            <td className="px-5 py-3">홍길동</td>
            <td className="px-5 py-3"><Badge variant="success">활성</Badge></td>
          </tr>
          <tr>
            <td className="px-5 py-3">김철수</td>
            <td className="px-5 py-3"><Badge variant="warning">대기</Badge></td>
          </tr>
        </tbody>
      </table>
    </Card>
  ),
}