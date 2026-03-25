import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '저장하기',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: '취소',
  },
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: '삭제',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: '작은 버튼',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: '큰 버튼',
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    children: '저장 중...',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: '비활성화',
  },
}