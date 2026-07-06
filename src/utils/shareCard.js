const CARD_WIDTH = 600
const CARD_HEIGHT = 960

export async function generateShareCard(pet, tags) {
  const canvas = document.createElement('canvas')
  canvas.width = CARD_WIDTH
  canvas.height = CARD_HEIGHT
  const ctx = canvas.getContext('2d')

  // ---- 1. 背景 ----
  const bg = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT)
  bg.addColorStop(0, '#0f0f0f')
  bg.addColorStop(0.4, '#1a1a2e')
  bg.addColorStop(1, '#0f0f0f')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  // ---- 2. 标题 ----
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = 'bold 34px sans-serif'
  const titleGrad = ctx.createLinearGradient(CARD_WIDTH / 2 - 100, 0, CARD_WIDTH / 2 + 100, 0)
  titleGrad.addColorStop(0, '#7c6cf0')
  titleGrad.addColorStop(1, '#f0a86c')
  ctx.fillStyle = titleGrad
  ctx.fillText('\u{1F98E} \u5F02\u5BA0\u4EBA\u683C\u6D4B\u8BD5', CARD_WIDTH / 2, 55)

  // ---- 3. 标签 ----
  if (tags && tags.length > 0) {
    const tagY = 100
    const tagH = 32
    const tagGap = 10
    let totalW = 0
    const measured = tags.map(t => ({ text: t, w: ctx.measureText(t).width + 24 }))
    measured.forEach(m => totalW += m.w)
    totalW += (measured.length - 1) * tagGap
    let sx = (CARD_WIDTH - totalW) / 2

    measured.forEach(m => {
      ctx.beginPath()
      ctx.roundRect(sx, tagY - tagH / 2, m.w, tagH, tagH / 2)
      ctx.fillStyle = 'rgba(124, 108, 240, 0.15)'
      ctx.fill()
      ctx.font = '13px sans-serif'
      ctx.fillStyle = '#9b8ff5'
      ctx.fillText(m.text, sx + m.w / 2, tagY)
      sx += m.w + tagGap
    })
  }

  // ---- 4. 双图并排 ----
  const imgSize = 200
  const imgGap = 16
  const totalImgW = imgSize * 2 + imgGap
  const imgStartX = (CARD_WIDTH - totalImgW) / 2
  const imgY = 150

  // 左：卡通版
  try {
    const cute = await loadImage(pet.image)
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(imgStartX, imgY, imgSize, imgSize, 14)
    ctx.clip()
    ctx.drawImage(cute, imgStartX, imgY, imgSize, imgSize)
    ctx.restore()
  } catch (e) {
    drawFallback(ctx, imgStartX, imgY, imgSize, imgSize, pet.emoji || '\u{1F98E}')
  }
  ctx.font = '12px sans-serif'
  ctx.fillStyle = '#6b6b80'
  ctx.fillText('\u{1F3A8} \u5361\u901A\u7248', imgStartX + imgSize / 2, imgY + imgSize + 22)

  // 右：真实版
  const realImgSrc = `/images/realistic/${pet.id}.jpg`
  try {
    const real = await loadImage(realImgSrc)
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(imgStartX + imgSize + imgGap, imgY, imgSize, imgSize, 14)
    ctx.clip()
    ctx.drawImage(real, imgStartX + imgSize + imgGap, imgY, imgSize, imgSize)
    ctx.restore()
  } catch (e) {
    try {
      const real2 = await loadImage(pet.image)
      ctx.save()
      ctx.beginPath()
      ctx.roundRect(imgStartX + imgSize + imgGap, imgY, imgSize, imgSize, 14)
      ctx.clip()
      ctx.drawImage(real2, imgStartX + imgSize + imgGap, imgY, imgSize, imgSize)
      ctx.restore()
    } catch (e2) {
      drawFallback(ctx, imgStartX + imgSize + imgGap, imgY, imgSize, imgSize, pet.emoji || '\u{1F98E}')
    }
  }
  ctx.font = '12px sans-serif'
  ctx.fillStyle = '#6b6b80'
  ctx.fillText('\u{1F4F7} \u771F\u5B9E\u7248', imgStartX + imgSize + imgGap + imgSize / 2, imgY + imgSize + 22)

  // 两图之间的标签
  ctx.font = '11px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  ctx.fillText('VS', CARD_WIDTH / 2, imgY + imgSize / 2)

  // ---- 5. 匹配度环 ----
  const ringCY = imgY + imgSize + 62
  const ringR = 42
  const rw = 5
  const sim = pet.similarity || 85

  ctx.beginPath()
  ctx.arc(CARD_WIDTH / 2, ringCY, ringR, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.lineWidth = rw
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(CARD_WIDTH / 2, ringCY, ringR, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * sim) / 100)
  ctx.strokeStyle = '#7c6cf0'
  ctx.lineWidth = rw
  ctx.lineCap = 'round'
  ctx.stroke()

  ctx.font = 'bold 20px sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText(`${sim}%`, CARD_WIDTH / 2, ringCY - 4)
  ctx.font = '11px sans-serif'
  ctx.fillStyle = '#a0a0b0'
  ctx.fillText('\u5339\u914D\u5EA6', CARD_WIDTH / 2, ringCY + 16)

  // ---- 6. 名称 + 称号 ----
  const nameY = ringCY + 50
  ctx.font = 'bold 30px sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText(pet.name, CARD_WIDTH / 2, nameY)
  ctx.font = '16px sans-serif'
  ctx.fillStyle = '#a0a0b0'
  ctx.fillText(pet.title || '', CARD_WIDTH / 2, nameY + 30)

  // ---- 7. 分割线 ----
  const divY = nameY + 54
  ctx.beginPath()
  ctx.moveTo(CARD_WIDTH / 2 - 100, divY)
  ctx.lineTo(CARD_WIDTH / 2 + 100, divY)
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'
  ctx.lineWidth = 1
  ctx.stroke()

  // ---- 8. 二维码 + 扫码提示 ----
  const qrY = divY + 20
  const qrS = 72
  const qrX = CARD_WIDTH / 2 - qrS / 2

  try {
    const qr = await loadImage(window.location.origin + '/images/qr-code.png')
    ctx.beginPath()
    ctx.roundRect(qrX - 5, qrY - 5, qrS + 10, qrS + 10, 6)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    ctx.drawImage(qr, qrX, qrY, qrS, qrS)
  } catch (e) {
    // 未加载到二维码，跳过
  }

  ctx.font = '14px sans-serif'
  ctx.fillStyle = '#a0a0b0'
  ctx.fillText('\u626B\u4E00\u626B \u00B7 \u6D4B\u6D4B\u4F60\u7684\u5929\u9009\u5F02\u5BA0', CARD_WIDTH / 2, qrY + qrS + 28)

  // ---- 9. 底部按钮 ----
  const ctaY = qrY + qrS + 62
  const ctaW = 240
  const ctaH = 44
  const ctaX = (CARD_WIDTH - ctaW) / 2
  ctx.beginPath()
  ctx.roundRect(ctaX, ctaY - ctaH / 2, ctaW, ctaH, ctaH / 2)
  const g = ctx.createLinearGradient(ctaX, 0, ctaX + ctaW, 0)
  g.addColorStop(0, '#7c6cf0')
  g.addColorStop(1, '#5a4ad8')
  ctx.fillStyle = g
  ctx.fill()
  ctx.font = 'bold 15px sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText('\u514D\u8D39\u5F00\u59CB\u6D4B\u8BD5 \u2192', CARD_WIDTH / 2, ctaY)

  // ---- 10. 网址 ----
  ctx.font = '12px sans-serif'
  ctx.fillStyle = '#6b6b80'
  ctx.fillText(window.location.hostname || '\u5F02\u5BA0\u4EBA\u683C\u6D4B\u8BD5', CARD_WIDTH / 2, CARD_HEIGHT - 22)

  return new Promise(r => canvas.toBlob(b => r(b), 'image/png'))
}

function drawFallback(ctx, x, y, w, h, emoji) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, 14)
  ctx.fillStyle = '#1a1a2e'
  ctx.fill()
  ctx.font = `${Math.min(w, h) * 0.4}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#6b6b80'
  ctx.fillText(emoji, x + w / 2, y + h / 2)
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export function downloadShareCard(blob, filename = 'exotic-pet-test.png') {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
