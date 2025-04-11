import { defineConfig } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  headLinkOptions: {
    preset: 'minimal'
  },
  preset: {
    minimal: true
  },
  images: [
    {
      src: 'public/icon.svg',
      sizes: [192, 512],
      formats: ['png'],
      purposes: ['any', 'maskable']
    }
  ]
})