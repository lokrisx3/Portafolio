import {walls,doors,notes,distance} from './world.js'
import {createScenery} from './scenery.js'
const sceneryCache=new WeakMap()
export const base=import.meta.env.BASE_URL+'usunknown/'
const png=['asesino-correr','menu-mansion','intro-bosque','intro-elena','intro-pomo-acercamiento','intro-pomo-agarre','intro-pomo-apertura']
const svg=['suelo-madera','suelo-baldosa','alfombra','alfombra-pasillo','estanteria','mesa','cama','sofa','cocina','nota','protagonista-caminar','retrato']
export async function loadArt(){
const images={}
await Promise.all([...png,...svg].map(async name=>{
const img=new Image();img.src=base+'art/'+name+(png.includes(name)?'.png':'.svg')
await img.decode();images[name]=img
}))
return images
}
export function render(ctx,g,images){
const W=1280,H=720,p=g.player
const cx=Math.max(0,Math.min(640,p.x-W/2)),cy=Math.max(0,Math.min(720,p.y-H/2))
g.camera={x:cx,y:cy}
ctx.clearRect(0,0,W,H);ctx.save();ctx.translate(-cx,-cy)
const rect=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,h)}
if(!sceneryCache.has(images))sceneryCache.set(images,createScenery(images,ctx.canvas.ownerDocument))
ctx.drawImage(sceneryCache.get(images),0,0)
doors.forEach((d,i)=>{rect(d.x-68,d.y-10,8,20,'#c8a16a');rect(d.x+60,d.y-10,8,20,'#c8a16a');if(g.closed[i])rect(d.x-64,d.y-6,128,12,'#8d5c37');else rect(d.x-64,d.y+(i<2?-115:0),12,115,'#694c32')})
rect(24,674,18,92,g.collected.length===4?'#b5d898':'#8b6342')
ctx.fillStyle='#e7d8b7';ctx.font='15px sans-serif';ctx.fillText('SALIDA',45,658)
const atlas=images['protagonista-caminar'],frame=g.moving?1+Math.floor(g.steps/12)%8:0
ctx.save();ctx.translate(p.x,p.y-8);if(Math.cos(g.angle)<-.1)ctx.scale(-1,1)
ctx.drawImage(atlas,frame*atlas.width/9,0,atlas.width/9,atlas.height,-24,-30,48,60);ctx.restore()
ctx.restore()
// A darkness layer is cut by a ray-cast flashlight, so the beam stops at walls.
const layer=ctx.canvas._darkness||(ctx.canvas._darkness=ctx.canvas.ownerDocument.createElement('canvas'));if(layer.width!==W||layer.height!==H){layer.width=W;layer.height=H}
const shade=layer.getContext('2d');shade.globalCompositeOperation='source-over';shade.clearRect(0,0,W,H);shade.fillStyle='rgba(3,7,17,.89)';shade.fillRect(0,0,W,H)
shade.globalCompositeOperation='destination-out';shade.fillStyle='rgba(0,0,0,.73)';shade.fillRect(24-cx,588-cy,1872,264)
const px=p.x-cx,py=p.y-cy
const near=shade.createRadialGradient(px,py,0,px,py,75);near.addColorStop(0,'rgba(0,0,0,.7)');near.addColorStop(1,'transparent');shade.fillStyle=near;shade.fillRect(px-75,py-75,150,150)
// Only real light reveals the enemy; the player's navigation halo does not.
const visibility=ctx.canvas._visibility||(ctx.canvas._visibility=ctx.canvas.ownerDocument.createElement('canvas'))
if(visibility.width!==W||visibility.height!==H){visibility.width=W;visibility.height=H}
const light=visibility.getContext('2d');light.clearRect(0,0,W,H)
light.fillStyle='white';light.fillRect(24-cx,588-cy,1872,264)
if(g.light){
const cone=new Path2D();cone.moveTo(px,py)
const obstacles=[...walls,...doors.filter((_,i)=>g.closed[i]).map(d=>[d.x-64,d.y-6,128,12])]
for(let angle=g.angle-.52;angle<=g.angle+.53;angle+=.018){
let length=10
for(;length<440;length+=6){const x=p.x+Math.cos(angle)*length,y=p.y+Math.sin(angle)*length;if(obstacles.some(([rx,ry,w,h])=>x>=rx&&x<=rx+w&&y>=ry&&y<=ry+h))break}
cone.lineTo(px+Math.cos(angle)*length,py+Math.sin(angle)*length)
}
cone.closePath();const beam=shade.createRadialGradient(px,py,0,px,py,440);beam.addColorStop(0,'black');beam.addColorStop(.55,'rgba(0,0,0,.9)');beam.addColorStop(1,'transparent');shade.fillStyle=beam;shade.fill(cone)
light.fillStyle=beam;light.fill(cone)
}
if(g.enemy){
const enemyLayer=ctx.canvas._enemy||(ctx.canvas._enemy=ctx.canvas.ownerDocument.createElement('canvas'))
if(enemyLayer.width!==W||enemyLayer.height!==H){enemyLayer.width=W;enemyLayer.height=H}
const enemy=enemyLayer.getContext('2d'),e=g.enemy,atlas=images['asesino-correr']
enemy.globalCompositeOperation='source-over';enemy.clearRect(0,0,W,H)
enemy.drawImage(atlas,Math.floor(g.time*12)%8*192,0,192,224,e.x-cx-34.56,e.y-cy-50.32,69.12,80.64)
enemy.globalCompositeOperation='destination-in';enemy.drawImage(visibility,0,0)
ctx.drawImage(enemyLayer,0,0)
}
ctx.drawImage(layer,0,0)
const nearby=notes.find(n=>distance(p,n)<100)
if(nearby){ctx.fillStyle='#ead5ac';ctx.font='14px sans-serif';ctx.textAlign='center';ctx.fillText('Inspeccionar',nearby.x-cx,nearby.y-cy-42);ctx.textAlign='start'}
g.keys.forEach((key,i)=>{if(g.collected.includes(i))return;const x=key.x-cx,y=key.y-cy;ctx.strokeStyle='#e6c783';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,6,0,Math.PI*2);ctx.moveTo(x+6,y);ctx.lineTo(x+22,y);ctx.lineTo(x+22,y+6);ctx.stroke()})
if(g.time%9<.4){ctx.fillStyle='rgba(169,197,255,'+(.09*(1-g.time%9/.4))+')';ctx.fillRect(1150-cx,588-cy,746,264)}
}
export function renderIntro(ctx,t,images,reduced){
const draw=(name,alpha=1)=>{ctx.globalAlpha=alpha;ctx.drawImage(images[name],0,0,1280,720);ctx.globalAlpha=1}
ctx.fillStyle='#000';ctx.fillRect(0,0,1280,720)
ctx.save()
if(!reduced){const zoom=1+Math.min(t%5/5,1)*.045;ctx.translate(640*(1-zoom),340*(1-zoom));ctx.scale(zoom,zoom)}
if(t<5){
draw('intro-bosque');const progress=Math.min(1,Math.max(0,(t-.3)/4.2))*.5
const h=300-205*progress,img=images['intro-elena'],w=h*img.width/img.height
ctx.drawImage(img,755-115*progress-w/2,740-260*progress-h,w,h)
}else{draw('intro-pomo-acercamiento');draw('intro-pomo-agarre',Math.min(1,Math.max(0,(t-6)/.6)));draw('intro-pomo-apertura',Math.min(1,Math.max(0,(t-7.7)/.9)))}
ctx.restore()
if(t<5&&!reduced){
ctx.strokeStyle='#9baec04a';ctx.beginPath()
for(let i=0;i<230;i++){const d=.5+i%7/7,x=((i*73.7-t*115*d)%1380+1380)%1380-50,y=(i*41.3+t*570*d)%780-30;ctx.moveTo(x,y);ctx.lineTo(x-8,y+24)}ctx.stroke()
for(const strike of [1.1,3.6]){const age=t-strike;if(age>=0&&age<.65){ctx.fillStyle='rgba(180,206,255,'+(.3*(1-age/.65))+')';ctx.fillRect(0,0,1280,720)}}
}
ctx.fillStyle='#000';ctx.fillRect(0,0,1280,48);ctx.fillRect(0,620,1280,100)
}
