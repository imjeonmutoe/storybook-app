import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'danger', 'info'],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'default',
    children: '일반',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    children: '활성',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: '대기',
  },
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: '정지',
  },
}

export const Info: Story = {
  args: {
    variant: 'info',
    children: '신규',
  },
}