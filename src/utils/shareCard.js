/**
 * 分享卡片生成器
 * 使用 Canvas 绘制分享图，支持长按保存到相册
 */

const CARD_WIDTH = 600
const CARD_HEIGHT = 900

/**
 * 生成分享卡片
 * @param {Object} pet - 匹配的异宠数据
 * @param {Array} tags - 用户画像标签
 * @returns {Promise<Blob>} 图片 Blob
 */
export async function generateShareCard(pet, tags) {
  const canvas = document.createElement('canvas')
  canvas.width = CARD_WIDTH
  canvas.height = CARD_HEIGHT
  const ctx = canvas.getContext('2d')

  // ---- 1. 背景渐变 ----
  const bgGrad = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT)
  bgGrad.addColorStop(0, '#0f0f0f')
  bgGrad.addColorStop(0.5, '#1a1a2e')
  bgGrad.addColorStop(1, '#0f0f0f')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  // 装饰光晕
  const glow1 = ctx.createRadialGradient(100, 100, 0, 100, 100, 300)
  glow1.addColorStop(0, 'rgba(124, 108, 240, 0.08)')
  glow1.addColorStop(1, 'rgba(124, 108, 240, 0)')
  ctx.fillStyle = glow1
  ctx.fillRect(0, 0, 400, 400)

  const glow2 = ctx.createRadialGradient(CARD_WIDTH - 100, CARD_HEIGHT - 100, 0, CARD_WIDTH - 100, CARD_HEIGHT - 100, 300)
  glow2.addColorStop(0, 'rgba(240, 168, 108, 0.08)')
  glow2.addColorStop(1, 'rgba(240, 168, 108, 0)')
  ctx.fillStyle = glow2
  ctx.fillRect(CARD_WIDTH - 400, CARD_HEIGHT - 400, 400, 400)

  // ---- 2. 顶部标题 ----
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.font = 'bold 36px sans-serif'
  const titleGrad = ctx.createLinearGradient(CARD_WIDTH / 2 - 100, 0, CARD_WIDTH / 2 + 100, 0)
  titleGrad.addColorStop(0, '#7c6cf0')
  titleGrad.addColorStop(1, '#f0a86c')
  ctx.fillStyle = titleGrad
  ctx.fillText('🦎 异宠人格测试', CARD_WIDTH / 2, 72)

  // ---- 3. 标签行 ----
  if (tags && tags.length > 0) {
    const tagY = 120
    const tagHeight = 34
    const tagGap = 10
    const totalTagWidth = tags.reduce((sum, t) => sum + ctx.measureText(t).width + 28, 0) + (tags.length - 1) * tagGap
    let startX = (CARD_WIDTH - totalTagWidth) / 2

    tags.forEach(tag => {
      const tagW = ctx.measureText(tag).width + 24
      const tagX = startX

      // 标签背景
      ctx.beginPath()
      ctx.roundRect(tagX, tagY - tagHeight / 2, tagW, tagHeight, tagHeight / 2)
      ctx.fillStyle = 'rgba(124, 108, 240, 0.15)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(124, 108, 240, 0.25)'
      ctx.lineWidth = 1
      ctx.stroke()

      // 标签文字
      ctx.font = '14px sans-serif'
      ctx.fillStyle = '#9b8ff5'
      ctx.fillText(tag, tagX + tagW / 2, tagY)

      startX += tagW + tagGap
    })
  }

  // ---- 4. 宠物图片（圆形裁剪） ----
  const imgSize = 260
  const imgX = (CARD_WIDTH - imgSize) / 2
  const imgY = 170

  try {
    const img = await loadImage(pet.image)
    // 画影子
    ctx.beginPath()
    ctx.arc(CARD_WIDTH / 2, imgY + imgSize / 2 + 10, imgSize / 2 + 5, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(0,0,0,0.2)'
    ctx.fill()

    // 画圆形图片
    ctx.beginPath()
    ctx.arc(CARD_WIDTH / 2, imgY + imgSize / 2, imgSize / 2, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(img, imgX, imgY, imgSize, imgSize)
    ctx.restore() // 重置 clip
  } catch (e) {
    // 图片加载失败，画占位
    ctx.beginPath()
    ctx.arc(CARD_WIDTH / 2, imgY + imgSize / 2, imgSize / 2, 0, Math.PI * 2)
    ctx.fillStyle = '#1a1a2e'
    ctx.fill()
    ctx.font = '80px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(pet.emoji || '🦎', CARD_WIDTH / 2, imgY + imgSize / 2)
  }

  // ---- 5. 匹配度环 ----
  const ringCenterX = CARD_WIDTH / 2
  const ringCenterY = imgY + imgSize + 50
  const ringRadius = 46
  const ringWidth = 6

  // 背景环
  ctx.beginPath()
  ctx.arc(ringCenterX, ringCenterY, ringRadius, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.lineWidth = ringWidth
  ctx.stroke()

  // 进度环
  const similarity = pet.similarity || 85
  const startAngle = -Math.PI / 2
  const endAngle = startAngle + (Math.PI * 2 * similarity) / 100
  ctx.beginPath()
  ctx.arc(ringCenterX, ringCenterY, ringRadius, startAngle, endAngle)
  ctx.strokeStyle = '#7c6cf0'
  ctx.lineWidth = ringWidth
  ctx.lineCap = 'round'
  ctx.stroke()

  // 匹配度文字
  ctx.font = 'bold 22px sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`${similarity}%`, ringCenterX, ringCenterY - 6)
  ctx.font = '12px sans-serif'
  ctx.fillStyle = '#a0a0b0'
  ctx.fillText('匹配度', ringCenterX, ringCenterY + 18)

  // ---- 6. 宠物名称 ----
  const nameY = ringCenterY + 56
  ctx.font = 'bold 32px sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(pet.name, CARD_WIDTH / 2, nameY)

  // ---- 7. 宠物称号 ----
  ctx.font = '18px sans-serif'
  ctx.fillStyle = '#a0a0b0'
  ctx.fillText(pet.title || '', CARD_WIDTH / 2, nameY + 36)

  // ---- 8. 分割线 ----
  const lineY = nameY + 60
  ctx.beginPath()
  ctx.moveTo(CARD_WIDTH / 2 - 120, lineY)
  ctx.lineTo(CARD_WIDTH / 2 + 120, lineY)
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.lineWidth = 1
  ctx.stroke()

  // ---- 9. 二维码 ----
  try {
    const qrCode = await loadImage('/images/qr-code.png')
    const qrSize = 80
    const qrX = (CARD_WIDTH - qrSize) / 2
    const qrY = lineY + 18
    // 二维码背景
    ctx.beginPath()
    ctx.roundRect(qrX - 6, qrY - 6, qrSize + 12, qrSize + 12, 8)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    ctx.drawImage(qrCode, qrX, qrY, qrSize, qrSize)
  } catch (e) {
    // 二维码加载失败，用文字代替
  }

  // ---- 10. 扫码提示 ----
  const scanY = lineY + 120
  ctx.font = '16px sans-serif'
  ctx.fillStyle = '#a0a0b0'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('扫一扫 · 测测你的天选异宠', CARD_WIDTH / 2, scanY)

  // ---- 11. 底部 CTA ----
  const ctaY = scanY + 38
  const ctaW = 260
  const ctaH = 44
  const ctaX = (CARD_WIDTH - ctaW) / 2
  ctx.beginPath()
  ctx.roundRect(ctaX, ctaY - ctaH / 2, ctaW, ctaH, ctaH / 2)
  const ctaGrad = ctx.createLinearGradient(ctaX, 0, ctaX + ctaW, 0)
  ctaGrad.addColorStop(0, '#7c6cf0')
  ctaGrad.addColorStop(1, '#5a4ad8')
  ctx.fillStyle = ctaGrad
  ctx.fill()

  ctx.font = 'bold 16px sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('开始测试 →', CARD_WIDTH / 2, ctaY)

  // ---- 12. 底部网址 ----
  ctx.font = '12px sans-serif'
  ctx.fillStyle = '#6b6b80'
  ctx.fillText(window.location.hostname || '异宠人格测试', CARD_WIDTH / 2, CARD_HEIGHT - 18)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    }, 'image/png')
  })
}

/**
 * 加载图片
 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * 下载/保存图片到相册
 */
export function downloadShareCard(blob, filename = 'exotic-pet-test.png') {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
