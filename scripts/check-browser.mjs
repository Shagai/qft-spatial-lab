import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const port = 4174
const base = process.env.VITE_BASE_PATH ?? (process.env.GITHUB_ACTIONS ? '/' + process.env.GITHUB_REPOSITORY.split('/')[1] + '/' : '/')
const origin = 'http://127.0.0.1:' + port + base
const preview = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { stdio: 'inherit' })
let browser

try {
  for (let i = 0; i < 100; i++) {
    if (preview.exitCode !== null) throw new Error('Vite preview exited before the test')
    if (await fetch(origin).then(r => r.ok).catch(() => false)) break
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH, headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  })
  await mkdir('test-results', { recursive: true })
  for (const width of [1280, 390]) {
    const page = await browser.newPage({
      viewport: { width, height: width === 390 ? 844 : 900 },
      isMobile: width === 390, hasTouch: width === 390,
    })
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    const model = page.waitForResponse(r => r.url().endsWith('/models/interferometer.glb') && r.ok())
    await page.goto(origin)
    await model
    const canvas = page.locator('.spin-canvas canvas')
    await canvas.waitFor()
    assert.equal(await canvas.evaluate(e => !!e.getContext('webgl2')), true)
    await canvas.press('ArrowLeft')
    await canvas.press('Home')
    await page.getByRole('button', { name: 'Detector B', exact: true }).click()
    await page.getByRole('button', { name: 'Run 100 neutrons' }).click()
    assert.match(await page.locator('.spin-counts').innerText(), /A\s*0\s*B\s*100/)
    await page.getByRole('button', { name: 'Same order' }).click()
    await page.getByRole('button', { name: 'Run 100 neutrons' }).click()
    assert.match(await page.locator('.spin-counts').innerText(), /A\s*100\s*B\s*0/)
    await page.getByRole('button', { name: 'Reversed order' }).click()
    const overlay = page.getByRole('checkbox', { name: 'Overlay the two frames' })
    await overlay.check()
    await overlay.uncheck()
    await page.getByRole('button', { name: 'Replay rotations' }).click()
    await page.getByRole('button', { name: 'Pause rotations' }).waitFor()
    await page.getByRole('button', { name: 'Replay rotations' }).waitFor()
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
    await page.screenshot({ path: 'test-results/spinor-' + width + '.png' })
    await page.getByRole('link', { name: 'Read chapter' }).click()
    await page.getByRole('button', { name: 'Open experiment · Spinor interferometer' }).click()
    await page.getByRole('button', { name: 'Run 100 neutrons' }).click()
    assert.match(await page.locator('.spin-counts').innerText(), /B\s*100/)
    await page.getByRole('button', { name: 'Close experiment · Spinor interferometer' }).click()

    await page.goto(origin + '#/labs/field-modes')
    await page.getByRole('button', { name: '1', exact: true }).click()
    assert.match(await page.getByRole('img', { name: /Probabilities across 64 sites/ }).getAttribute('aria-label'), /1.6 percent/)
    await page.getByRole('button', { name: 'Single oscillator' }).click()
    await page.getByRole('button', { name: /One quantum/ }).click()
    await page.getByRole('button', { name: 'Measure 64 copies' }).click()
    assert.match(await page.getByRole('img', { name: /Quadrature density/ }).getAttribute('aria-label'), /64 measurements/)
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
    assert.deepEqual(errors, [])
    console.log('Checked WebGL, counts, chapter embed and quantum measurements at ' + width + 'px')
    await page.close()
  }
} finally {
  await browser?.close()
  preview.kill()
}
