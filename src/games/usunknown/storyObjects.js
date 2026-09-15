import { notes } from './world.js'

export function drawStoryObjects(ctx, images) {
  notes.forEach(({ x, y }, index) => {
    ctx.save(); ctx.translate(x, y)
    ctx.shadowColor = '#000b'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 3
    const rect = (x, y, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h) }
    if (index === 0) {
      ctx.rotate(-.18)
      rect(-18, -12, 36, 24, '#d6c49a')
      ctx.strokeStyle = '#8b7755'; ctx.beginPath(); ctx.moveTo(-17, -11); ctx.lineTo(0, 3); ctx.lineTo(17, -11); ctx.stroke()
      ctx.fillStyle = '#733739'; ctx.beginPath(); ctx.arc(0, 3, 4, 0, Math.PI * 2); ctx.fill()
    } else if (index === 1) {
      rect(-13, 11, 26, 5, '#9d8050'); rect(-3, -13, 6, 25, '#65543e')
      ctx.fillStyle = '#80755e'; ctx.beginPath(); ctx.moveTo(-9, -23); ctx.lineTo(9, -23); ctx.lineTo(20, -3); ctx.lineTo(-20, -3); ctx.closePath(); ctx.fill()
      rect(-18, -4, 36, 3, '#b0a080')
      rect(21, 0, 2, 15, '#a99462')
    } else if (index === 2) {
      ctx.rotate(.12)
      rect(-26, -31, 52, 62, '#9c7b49')
      ctx.drawImage(images.retrato, -21, -26, 42, 52)
      ctx.strokeStyle = '#d7c6a870'; ctx.beginPath(); ctx.moveTo(13, -26); ctx.lineTo(-2, -4); ctx.lineTo(6, 7); ctx.lineTo(-10, 26); ctx.stroke()
    } else {
      ctx.rotate(-.1)
      rect(-26, -18, 52, 36, '#533a32'); rect(-23, -16, 46, 31, '#c7b38a')
      rect(-1, -16, 2, 31, '#786344')
      for (let row = 0; row < 5; row++) {
        rect(-19, -10 + row * 5, 14 - row % 3 * 2, 1, '#786344')
        rect(5, -10 + row * 5, 13 - row % 2 * 3, 1, '#786344')
      }
      rect(15, 4, 3, 19, '#753b3c')
    }
    ctx.restore()
  })
}
