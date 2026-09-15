import { createRequire } from 'node:module'
import assert from 'node:assert/strict'

const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_PACKAGE)
const browser = await chromium.launch({ headless: true, channel: 'msedge' })
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('http://127.0.0.1:5178/Portafolio/')
  await page.getByRole('button', { name: 'Abrir selector de juegos' }).click()
  await page.getByRole('button', { name: /02 \/ TERROR/ }).click()
  await page.getByRole('button', { name: 'Entrar en la mansión' }).click()
  await page.keyboard.press('Space')
  await page.getByText('Llaves 0 / 4', { exact: false }).waitFor()
  const walk = async (key, ms) => {
    await page.keyboard.down(key)
    await page.waitForTimeout(ms)
    await page.keyboard.up(key)
  }
  await walk('KeyA', 2540)
  await walk('KeyW', 1520)
  for (const close of ['button', 'escape']) {
    await page.keyboard.press('KeyE')
    await page.getByRole('heading', { name: 'Carta sin firma' }).waitFor()
    if (close === 'button') await page.getByRole('button', { name: 'Cerrar carta', exact: true }).click()
    else await page.keyboard.press('Escape')
    await page.getByRole('heading', { name: 'Carta sin firma' }).waitFor({ state: 'detached' })
    assert.equal(await page.evaluate(() => document.activeElement?.classList.contains('uu')), true)
    // Reaching the corridor verifies actual movement, without pausing or clicking the game.
    await walk('KeyS', 1520)
    await page.locator('.uu-hud').getByText('Vestíbulo', { exact: true }).waitFor({ timeout: 3000 })
    if (close === 'button') await walk('KeyW', 1520)
  }
  assert.deepEqual(errors, [])
  console.log('PASS: movement resumes after closing a story with the button and Escape')
} finally {
  await browser.close()
}
