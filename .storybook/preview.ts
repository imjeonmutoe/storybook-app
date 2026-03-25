import type { Preview } from '@storybook/react-vite'
import { initialize, mswLoader } from 'msw-storybook-addon'
import { handlers } from '../src/mocks/handlers'
import '../src/index.css'

// 공통 handlers를 기본값으로 설정 — 각 Story에서 parameters.msw로 덮어쓸 수 있음
initialize({ serviceWorker: { url: '/mockServiceWorker.js' } })

const preview: Preview = {
  loaders: [mswLoader],
  parameters: {
    msw: { handlers },  // 모든 Story의 기본 MSW 핸들러
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;