// Canvas-native brass and glass, baked into the static mansion scenery.
export function drawLantern(ctx, x, y) {
  ctx.save()
  ctx.translate(x, y)
  const rect = (x, y, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h) }
  const glow = ctx.createRadialGradient(0, 0, 3, 0, 0, 110)
  glow.addColorStop(0, '#ffd28b88')
  glow.addColorStop(.22, '#efb85f45')
  glow.addColorStop(.65, '#d89c3620')
  glow.addColorStop(1, '#ffd08500')
  ctx.fillStyle = glow; ctx.fillRect(-110, -110, 220, 220)

  // Cast-iron wall plate, curved bracket and hanging ring.
  ctx.shadowColor = '#04050ac0'; ctx.shadowBlur = 5; ctx.shadowOffsetY = 3
  rect(-6, -27, 12, 10, '#191d24')
  rect(-4, -26, 8, 2, '#77684e')
  ctx.strokeStyle = '#8b7652'; ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(0, -24); ctx.quadraticCurveTo(9, -29, 5, -18); ctx.stroke()
  ctx.beginPath(); ctx.ellipse(0, -17, 3, 4, 0, 0, Math.PI * 2); ctx.stroke()
  ctx.shadowBlur = 0; ctx.shadowOffsetY = 0

  // A tapered cap catches warm light along its worn brass edge.
  const metal = ctx.createLinearGradient(-13, 0, 13, 0)
  metal.addColorStop(0, '#28292b'); metal.addColorStop(.35, '#9f8657')
  metal.addColorStop(.55, '#5b513e'); metal.addColorStop(1, '#20252c')
  ctx.fillStyle = metal
  ctx.beginPath(); ctx.moveTo(-13, -9); ctx.lineTo(-6, -15)
  ctx.lineTo(6, -15); ctx.lineTo(13, -9); ctx.closePath(); ctx.fill()
  rect(-13, -9, 26, 3, '#b19862')
  rect(-12, -6, 24, 24, '#24262a')

  const glass = ctx.createLinearGradient(-9, 0, 9, 0)
  glass.addColorStop(0, '#9c5c24'); glass.addColorStop(.25, '#eab75e')
  glass.addColorStop(.5, '#fff0ad'); glass.addColorStop(.75, '#e8ac4c'); glass.addColorStop(1, '#835021')
  ctx.fillStyle = glass; ctx.fillRect(-9, -5, 18, 21)
  // Soot at the top, etched imperfections and a narrow glass reflection.
  const soot = ctx.createLinearGradient(0, -5, 0, 13)
  soot.addColorStop(0, '#38261eaa'); soot.addColorStop(.5, '#6c411800'); soot.addColorStop(1, '#63341544')
  ctx.fillStyle = soot; ctx.fillRect(-9, -5, 18, 21)
  rect(-7, -3, 1, 14, '#fff4c57a')
  rect(6, 3, 1, 8, '#fff4c540')
  rect(-6, 10, 3, .6, '#74482380')
  rect(3, -1, 3, .6, '#74482380')
  ctx.fillStyle = '#fff5c6'
  ctx.beginPath(); ctx.moveTo(0, -2); ctx.bezierCurveTo(-5, 7, -3, 10, 0, 11)
  ctx.bezierCurveTo(4, 9, 3, 5, 0, -2); ctx.fill()
  rect(-1, 10, 2, 4, '#664226')
  rect(-9, 5, 18, 1.5, '#725431')
  rect(-10, -6, 2, 24, '#b09560')
  rect(8, -6, 2, 24, '#574d39')
  ctx.fillStyle = metal; ctx.fillRect(-13, 17, 26, 4)
  rect(-10, 21, 20, 2, '#282a2c')
  rect(-11, 17, 22, 1, '#d1af6c')
  for (const side of [-10, 9]) {
    rect(side, -8, 1.5, 1.5, '#f1ce89')
    rect(side, 19, 1.5, 1.5, '#d1af6c')
  }
  ctx.restore()
}
