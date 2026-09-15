import { furniture, walls, rooms, names } from './world.js'
import { drawLantern } from './lantern.js'
import { drawStoryObjects } from './storyObjects.js'

// Bake fine surface detail once. A fixed seed keeps wear anchored to the mansion.
export function createScenery(images, document) {
  const canvas = document.createElement('canvas')
  canvas.width = 1920
  canvas.height = 1440
  const ctx = canvas.getContext('2d')
  let seed = 8173
  const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296)
  const rect = (x, y, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h) }
  const art = (name, x, y, w, h) => ctx.drawImage(images[name], x - w / 2, y - h / 2, w, h)
  ctx.fillStyle = ctx.createPattern(images['suelo-madera'], 'repeat')
  ctx.fillRect(0, 0, 1920, 1440)
  ctx.fillStyle = ctx.createPattern(images['suelo-baldosa'], 'repeat')
  ctx.fillRect(972, 864, 924, 552)

  // Uneven polish, fine scratches and dust break up the repeating floor tiles.
  for (let i = 0; i < 360; i++) {
    const x = random() * 1920, y = random() * 1440, r = 18 + random() * 65
    const stain = ctx.createRadialGradient(x, y, 0, x, y, r)
    stain.addColorStop(0, i % 3 ? '#160f1026' : '#cfbd8d12')
    stain.addColorStop(1, 'transparent')
    ctx.fillStyle = stain
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }
  for (let i = 0; i < 2200; i++) {
    const x = random() * 1920, y = random() * 1440
    rect(x, y, 1 + random() * 18, .5, i % 3 ? '#20181530' : '#e6cea32b')
  }
  // Hairline cracks in the kitchen's stone surface.
  ctx.strokeStyle = '#25282b70'
  ctx.lineWidth = .8
  for (let i = 0; i < 26; i++) {
    let x = 990 + random() * 860, y = 890 + random() * 460
    ctx.beginPath(); ctx.moveTo(x, y)
    for (let j = 0; j < 4; j++) { x += random() * 14 - 7; y += random() * 9; ctx.lineTo(x, y) }
    ctx.stroke()
  }

  ctx.shadowColor = '#06060899'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 3
  art('alfombra-pasillo', 960, 720, 1800, 210)
  for (const [x, y, w, h] of rooms) art('alfombra', x + w / 2, y + h / 2, 400, 350)
  ctx.shadowBlur = 0; ctx.shadowOffsetY = 0
  // Woven threads on the runner, with a faded central walking path.
  for (let y = 623; y < 818; y += 3) rect(70, y, 1780, .5, '#ebc49812')
  const wear = ctx.createLinearGradient(0, 640, 0, 800)
  wear.addColorStop(0, 'transparent'); wear.addColorStop(.5, '#bf9a7920'); wear.addColorStop(1, 'transparent')
  ctx.fillStyle = wear; ctx.fillRect(80, 640, 1760, 160)

  // Soft contact shadows seat furniture on the floor.
  for (const [name, x, y, w, h, angle = 0] of furniture) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle)
    ctx.shadowColor = '#03050bd9'; ctx.shadowBlur = 18; ctx.shadowOffsetX = 5; ctx.shadowOffsetY = 9
    art(name, 0, 0, w, h)
    ctx.restore()
  }
  for (const [x, y, w, h] of walls) {
    ctx.shadowColor = '#030409b3'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8
    rect(x, y, w, h, '#32333a')
    ctx.shadowBlur = 0; ctx.shadowOffsetY = 0
    const horizontal = w > h
    // Cut stone courses and brass-toned timber trim.
    for (let step = 0; step < (horizontal ? w : h); step += 42) {
      const length = Math.min(40, (horizontal ? w : h) - step)
      rect(x + (horizontal ? step : 2), y + (horizontal ? 2 : step), horizontal ? length : w - 4, horizontal ? h - 4 : length, random() > .5 ? '#45434a' : '#383942')
    }
    rect(x, y, w, 2, '#9e8861')
    rect(x, y, 2, h, '#756a56')
    rect(x, y + h - 3, w, 3, '#141720')
    rect(x + w - 3, y, 3, h, '#141720')
  }
  // Inset borders give each room a finished parquet edge.
  for (const [x, y, w, h] of rooms) {
    ctx.strokeStyle = '#b59a6440'; ctx.lineWidth = 2
    ctx.strokeRect(x + 24, y + 24, w - 48, h - 48)
    ctx.strokeStyle = '#211b2260'; ctx.lineWidth = 4
    ctx.strokeRect(x + 30, y + 30, w - 60, h - 60)
  }
  ctx.font = '20px Georgia'; ctx.fillStyle = '#cbb38a'
  rooms.forEach(([x, y], i) => ctx.fillText(names[i].toUpperCase(), x + 50, y + 70))
  for (const x of [160, 720, 1200, 1760]) for (const y of [604, 836]) drawLantern(ctx, x, y)
  drawStoryObjects(ctx, images)
  return canvas
}
