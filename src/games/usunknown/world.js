export const rooms=[[16,16,936,550],[968,16,936,550],[16,874,936,550],[968,874,936,550]]
export const names=['Biblioteca','Dormitorio','Salón','Cocina']
export const doors=[{x:480,y:582},{x:1440,y:582},{x:480,y:858},{x:1440,y:858}]
export const notes=[{x:510,y:354},{x:1260,y:354},{x:540,y:1190},{x:1520,y:1200}]
export const lines=['«Si escuchas tu nombre desde el pasillo, no respondas.»','«Dejé la luz encendida. Por la mañana, la bombilla estaba fría.»','«En el retrato éramos cuatro. Ahora hay una silueta más.»','«Antes de salir, vuelve al lugar donde todo comenzó.»']
export const storyTitles=['Carta sin firma','Lámpara apagada','Retrato familiar','Diario abierto']
export const furniture=[
['estanteria',250,135,232,64],['estanteria',690,135,232,64],['mesa',470,290,180,95],['cama',1470,230,164,240],['mesa',1220,290,180,95],['estanteria',1720,130,232,64],['sofa',465,985,244,88],['mesa',475,1120,180,95],['sofa',190,1140,244,88,Math.PI/2],['cocina',1450,1330,310,74],['mesa',1480,1140,180,95],['estanteria',1750,980,232,64],['estanteria',110,330,232,64,Math.PI/2],['sofa',735,440,244,88],['mesa',760,270,180,95],['estanteria',1110,130,232,64],['sofa',1730,470,244,88],['mesa',1730,315,180,95],['estanteria',480,1330,232,64],['sofa',770,1100,244,88,Math.PI/2],['mesa',1120,1010,180,95],['cocina',1825,1230,310,74,Math.PI/2]]
export const walls=[[0,0,1920,24],[0,1416,1920,24],[0,0,24,1440],[1896,0,24,1440],[948,24,24,552],[948,864,24,552],...[576,852].flatMap(y=>[[24,y,392,12],[544,y,832,12],[1504,y,392,12]])]
const solids=[...walls,...furniture.map(([,x,y,w,h,a])=>a?[x-h/2,y-w/2,h,w]:[x-w/2,y-h/2,w,h])]
export const inside=(p,[x,y,w,h])=>p.x>=x&&p.x<=x+w&&p.y>=y&&p.y<=y+h
export const roomAt=p=>rooms.findIndex(r=>inside(p,r))
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)
export function blocked(p,closed=[],radius=16){
return [...solids,...doors.filter((_,i)=>closed[i]).map(d=>[d.x-64,d.y-6,128,12])].some(([x,y,w,h])=>inside(p,[x-radius,y-radius,w+radius*2,h+radius*2]))
}
export function move(p,dx,dy,closed){
if(!blocked({x:p.x+dx,y:p.y},closed))p.x+=dx
if(!blocked({x:p.x,y:p.y+dy},closed))p.y+=dy
}
const navigationCache=new Map()
function navigation(closed){
const key=closed.map(Boolean).join(',')
if(!navigationCache.has(key))navigationCache.set(key,Array.from({length:4800},(_,i)=>blocked({x:i%80*24+12,y:Math.floor(i/80)*24+12},closed)))
return navigationCache.get(key)
}
export function route(start,end,closed=[]){
const grid=navigation(closed)
const id=p=>Math.floor(p.y/24)*80+Math.floor(p.x/24),point=i=>({x:(i%80)*24+12,y:Math.floor(i/80)*24+12})
const from=id(start),to=id(end),queue=[from],parents=new Map([[from,-1]])
for(let n=0;n<queue.length;n++){
const at=queue[n]
if(at===to){const path=[];for(let i=to;i!==from;i=parents.get(i))path.push(point(i));return path.reverse()}
for(const next of [at-80,at+80,at%80>0?at-1:-1,at%80<79?at+1:-1]){
if(next<0||next>=4800||parents.has(next)||grid[next])continue
parents.set(next,at);queue.push(next)
}}
return []
}
export const candidates=rooms.map(r=>{
const points=[]
for(let y=r[1]+48;y<r[1]+r[3]-48;y+=24)for(let x=r[0]+48;x<r[0]+r[2]-48;x+=24){
const p={x:Math.floor(x/24)*24+12,y:Math.floor(y/24)*24+12}
if(!blocked(p,[],28))points.push(p)
}
return points
})
export function createGame(random=Math.random){
return {player:{x:960,y:720},keys:candidates.map(points=>({...points[Math.floor(random()*points.length)]})),collected:[],closed:[false,false,false,false],enemy:null,light:true,angle:Math.PI/2,steps:0,moving:false,time:0,message:'',messageTime:0}
}
export function interact(g){
const i=doors.findIndex(d=>distance(g.player,d)<96)
if(i>=0){
if(!g.closed[i]&&(Math.abs(g.player.y-doors[i].y)<30||(g.enemy&&distance(g.enemy,doors[i])<80)))return 'Aléjate del umbral para cerrar la puerta.'
g.closed[i]=!g.closed[i]
if(g.closed[i]&&roomAt(g.player)!==i&&g.enemy&&roomAt(g.enemy)===i){g.enemy=null;return 'La presencia ha desaparecido.'}
return g.closed[i]?'Puerta cerrada.':'Puerta abierta.'
}
const note=notes.findIndex(n=>distance(g.player,n)<100)
if(note>=0)return lines[note]
if(distance(g.player,{x:48,y:720})<100)return g.collected.length===4?'escaped':'Necesitas las cuatro llaves.'
return 'Acércate a una puerta, una nota o la salida.'
}
