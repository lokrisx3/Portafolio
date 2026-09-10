// Canvas-native pixel art, sharing the runner's scrolling distance.
export function drawFestiveCity(ctx, rect, distance, ground) {
  const red = '#ce4652'
  const white = '#f4ead8'
  const blue = '#315da1'
  function flag(x, y) {
    rect(x - 3, y - 3, 3, 44, '#d7c9b1')
    rect(x, y, 30, 10, white)
    rect(x, y + 10, 30, 10, red)
    rect(x, y, 10, 10, blue)
    ctx.fillStyle = white
    ctx.beginPath()
    for (let point = 0; point < 10; point++) {
      const angle = -Math.PI / 2 + point * Math.PI / 5
      const radius = point % 2 === 0 ? 4 : 1.7
      const px = x + 5 + Math.cos(angle) * radius
      const py = y + 5 + Math.sin(angle) * radius
      if (point === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()
  }
  for (let i = 0; i < 10; i++) {
    const x = ((i * 108 - distance * 2) % 1080 + 1080) % 1080 - 108
    const height = 80 + i % 4 * 18
    rect(x, ground - height, 86, height, '#3c435a')
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) rect(x + 12 + col * 23, ground - height + 15 + row * 25, 9, 12, '#72717c')
    }
  }
  for (let i = 0; i < 7; i++) {
    const x = ((i * 160 - distance * 5) % 1120 + 1120) % 1120 - 160
    const top = ground - 85 - i % 2 * 16
    rect(x, top, 135, ground - top, i % 2 ? '#997669' : '#b99a7a')
    rect(x - 4, top - 7, 143, 8, '#663f49')
    rect(x + 12, top + 20, 24, 32, '#283849')
    rect(x + 21, top + 20, 3, 32, '#e1c59b')
    rect(x + 12, top + 35, 24, 3, '#e1c59b')
    rect(x + 90, top + 20, 27, 32, '#283849')
    rect(x + 52, ground - 42, 25, 42, '#523b43')
    rect(x + 71, ground - 23, 3, 3, '#eed49b')
    flag(x + 52, top - 32)
    if (i % 2 === 0) {
      rect(x + 4, ground - 67, 123, 16, '#283849')
      ctx.fillStyle = white
      ctx.font = 'bold 10px monospace'
      ctx.fillText('FONDA EL PUDÚ', Math.round(x + 10), ground - 55)
      for (let stripe = 0; stripe < 10; stripe++) rect(x + 4 + stripe * 12, ground - 49, 12, 9, stripe % 2 ? white : red)
    }
  }
  // High bunting stays clear of the jump and obstacle silhouettes.
  for (let i = 0; i < 24; i++) {
    const x = ((i * 42 - distance * 4) % 1008 + 1008) % 1008 - 42
    const y = 49 + Math.sin((x + distance * 4) / 135) * 12
    rect(x, y, 43, 2, '#d8cbb8')
    ctx.fillStyle = [red, white, blue][i % 3]
    ctx.beginPath()
    ctx.moveTo(x + 5, y + 2)
    ctx.lineTo(x + 30, y + 2)
    ctx.lineTo(x + 17, y + 23)
    ctx.closePath()
    ctx.fill()
  }
}
