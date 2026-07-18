const fs = require('fs')
const path = require('path')

const distDir = path.resolve(__dirname, '..', 'dist')
const indexPath = path.join(distDir, 'index.html')
const fallbackPath = path.join(distDir, '404.html')

if (!fs.existsSync(indexPath)) {
  console.error('No existe dist/index.html. Ejecuta primero vite build.')
  process.exit(1)
}

fs.copyFileSync(indexPath, fallbackPath)
console.log('SPA fallback creado: dist/404.html')
