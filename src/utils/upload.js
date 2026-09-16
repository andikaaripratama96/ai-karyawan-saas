export function formatBytes(bytes) {
  if (!bytes) return '0 KB'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(0)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

const MAX_DIM = 900
const QUALITY = 0.75

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

async function downscale(dataUrl, fileType) {
  const img = await loadImage(dataUrl)
  const { width, height } = img
  const scale = Math.min(1, MAX_DIM / Math.max(width, height))
  if (scale >= 1) return dataUrl

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * scale)
  canvas.height = Math.round(height * scale)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  const mime = fileType === 'image/png' ? 'image/png' : 'image/jpeg'
  return canvas.toDataURL(mime, QUALITY)
}

export async function readFilesAsReferences(files) {
  const results = []
  for (const file of files) {
    try {
      const dataUrl = await fileToDataUrl(file)
      const optimized = await downscale(dataUrl, file.type)
      results.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        size: formatBytes(file.size),
        dataUrl: optimized,
        addedAt: new Date().toISOString().slice(0, 10),
      })
    } catch {
    }
  }
  return results
}