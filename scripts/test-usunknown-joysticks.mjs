import {createRequire} from 'node:module'
import assert from 'node:assert/strict'
const require=createRequire(import.meta.url)
const {chromium}=require(process.env.PLAYWRIGHT_PACKAGE)
const browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||'chrome'})
try{
const page=await browser.newPage({viewport:{width:844,height:390},hasTouch:true,isMobile:true})
const errors=[]
page.on('pageerror',e=>errors.push(e.message))
await page.goto('http://127.0.0.1:5178/Portafolio/')
await page.getByRole('button',{name:'Abrir selector de juegos'}).click()
await page.locator('.games-card--horror').click()
await page.getByRole('button',{name:'Entrar en la mansión'}).click()
await page.getByRole('button',{name:/Saltar intro/}).click()
if(!await page.locator('.uu-stick').count())await page.getByRole('button',{name:'Táctil',exact:true}).click()
const cdp=await page.context().newCDPSession(page)
const sticks=page.locator('.uu-stick'),knobs=page.locator('.uu-stick-knob')
const left=await sticks.nth(0).boundingBox(),right=await sticks.nth(1).boundingBox()
const points=[{x:left.x+left.width*.2,y:left.y+left.height*.5,id:0},{x:right.x+right.width*.5,y:right.y+right.height*.2,id:1}]
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points})
assert.notEqual(await knobs.nth(0).evaluate(n=>n.style.transform),'translate(0%, 0%)')
assert.notEqual(await knobs.nth(1).evaluate(n=>n.style.transform),'translate(0%, 0%)')
await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[points[1]]})
await page.waitForFunction(n=>n.style.transform==='translate(0%, 0%)',await knobs.nth(1).elementHandle())
assert.notEqual(await knobs.nth(0).evaluate(n=>n.style.transform),'translate(0%, 0%)')
await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]})
await page.waitForFunction(n=>n.style.transform==='translate(0%, 0%)',await knobs.nth(0).elementHandle())
await page.getByRole('button',{name:'Luz',exact:true}).click()
await page.getByText('Luz OFF',{exact:false}).waitFor()
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[points[0]]})
await page.evaluate(()=>window.dispatchEvent(new Event('blur')))
await page.getByRole('heading',{name:'Pausa',exact:true}).waitFor()
await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})
await page.getByRole('button',{name:'Continuar',exact:true}).last().click()
await page.waitForFunction(n=>n.style.transform==='translate(0%, 0%)',await knobs.nth(0).elementHandle())
for(const size of [{width:844,height:390},{width:390,height:844}]){
await page.setViewportSize(size)
for(const control of await page.locator('.uu-stick,.uu-touch-actions button').all()){
const box=await control.boundingBox()
assert(box.x>=0&&box.y>=0&&box.x+box.width<=size.width&&box.y+box.height<=size.height)
}
await page.screenshot({path:`test-results/usunknown-joysticks-${size.width}.png`})
}
assert.deepEqual(errors,[])
console.log('PASS: two simultaneous pointers, independent release, cancellation, light button, pause reset and portrait/landscape layout')
}finally{await browser.close()}
