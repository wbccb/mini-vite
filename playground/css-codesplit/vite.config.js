import { resolve } from 'node:path';

export default {
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, './index.html'),
      },
      output: {}
    }
  }
}
