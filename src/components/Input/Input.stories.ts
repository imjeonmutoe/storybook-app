import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './Input'

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  decorators: [
    (Story) => {
      const div = document.createElement('div')
      div.style.width = '320px'
      return Story()
    },
  ],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: '이메일',
    placeholder: 'example@email.com',
  },
}

export const WithHint: Story = {
  args: {
    label: '비밀번호',
    type: 'password',
    placeholder: '8자 이상 입력하세요',
    hint: '영문, 숫자, 특수문자를 포함해야 합니다.',
  },
}

export const WithError: Story = {
  args: {
    label: '이메일',
    placeholder: 'example@email.com',
    defaultValue: 'invalid-email',
    error: '올바른 이메일 형식이 아닙니다.',
  },
}

export const Required: Story = {
  args: {
    label: '이름',
    placeholder: '홍길동',
    required: true,
  },
}

export const Disabled: Story = {
  args: {
    label: '아이디',
    defaultValue: 'user_123',
    disabled: true,
  },
}