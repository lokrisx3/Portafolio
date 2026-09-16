import {createPortal} from 'react-dom'
import {useEffect,useRef,useState} from 'react'
import {createGame,move,distance,roomAt,names,candidates,route,interact,lines,storyTitles} from './world.js'
import {base,loadArt,render,renderIntro} from './renderer.js'
import './UsUnknown.css'
import StoryReading from './StoryReading.jsx'
import TouchJoystick from './TouchJoystick.jsx'

export default function UsUnknown({onClose}){
const canvas=useRef(null),host=useRef(null),runtime=useRef(null)
const [view,setView]=useState({state:'loading',count:0,room:'Vestíbulo',message:''})
const [muted,setMuted]=useState(false),[touch,setTouch]=useState(()=>matchMedia('(pointer: coarse)').matches)
// Keep multi-touch controls from triggering browser zoom, including Safari gestures.
useEffect(()=>{
const node=host.current
const preventGesture=e=>{if(e.cancelable)e.preventDefault()}
const preventPinch=e=>{if(e.touches.length>1)preventGesture(e)}
const preventWheelZoom=e=>{if(e.ctrlKey)preventGesture(e)}
const listeners=[['touchstart',preventPinch],['touchmove',preventPinch],['gesturestart',preventGesture],['gesturechange',preventGesture],['wheel',preventWheelZoom]]
for(const [type,handler] of listeners)node.addEventListener(type,handler,{passive:false})
return ()=>{for(const [type,handler] of listeners)node.removeEventListener(type,handler)}
},[])
// Restore keyboard input after React removes the modal and releases its focus trap.
useEffect(()=>{
if(view.state==='playing'||view.state==='intro')host.current?.focus()
},[view.state])
useEffect(()=>{
let alive=true,frame=0,last=0,images,game=createGame(),state='loading',intro=0,previous='playing',hudTime=0,reading=null
const pressed=new Set(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches
let analog={x:0,y:0}; const tracks={}
for(const [name,file,loop,volume] of [['music','piano-ambient',true,.3],['rain','rainambient',true,.4],['intro','lluviacinematica',true,.5],['thunder','truenocinematica',false,.5],['walk','pasos',true,.35],['run','correr',true,.4],['enemy','correrasesino',true,.45]]){
const audio=new Audio(base+'audio/'+file+'.mp3');audio.loop=loop;audio.volume=volume;tracks[name]=audio
}
const play=name=>{if(tracks[name].paused)tracks[name].play().catch(()=>{})}
const sync=()=>setView({state,reading,count:game.collected.length,room:names[roomAt(game.player)]||'Vestíbulo',message:game.messageTime>0?game.message:'',light:game.light})
const change=next=>{state=next;pressed.clear();analog={x:0,y:0};if(next==='playing'||next==='intro')host.current?.focus();Object.values(tracks).forEach(a=>a.pause());if(next==='title')play('music');if(next==='intro')play('intro');if(next==='playing')play('rain');sync()}
const action=name=>{
if(name==='sound'){Object.values(tracks).forEach(a=>{a.muted=!a.muted});setMuted(tracks.music.muted);return}
if(name==='touch'){analog={x:0,y:0};pressed.clear();setTouch(v=>!v);return}
if(name==='start'||name==='restart'){reading=null;game=createGame();intro=0;change(name==='start'?'intro':'playing');return}
if(name==='skip'&&state==='intro'){change('playing');return}
if(name==='pause'){if(state==='playing'||state==='intro'){previous=state;change('paused')}else if(state==='paused')change(previous);return}
if(name==='dismiss'&&state==='reading'){reading=null;change('playing');return}
if(state!=='playing')return
if(name==='light')game.light=!game.light
if(name==='use'){const message=interact(game);if(message==='escaped')change('won');else if(lines.includes(message)){reading={title:storyTitles[lines.indexOf(message)],text:message};change('reading')}else{game.message=message;game.messageTime=4}}
sync()
}
runtime.current={action,moveStick:value=>{analog=state==='playing'?value:{x:0,y:0}},aimStick:value=>{if(state==='playing'&&Math.hypot(value.x,value.y)>0){game.angle=Math.atan2(value.y,value.x);game.mouse=true}}}
const key=e=>{
if(state==='reading'){if(e.type==='keydown'&&e.code==='Escape'){e.preventDefault();action('dismiss')}return}
const map={KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right',ShiftLeft:'run',ShiftRight:'run'}
if(map[e.code]){e.preventDefault();if(e.type==='keydown')pressed.add(map[e.code]);else pressed.delete(map[e.code]);return}
if(e.type!=='keydown'||e.repeat)return
if(state==='intro'&&['Escape','Space','Enter'].includes(e.code)){e.preventDefault();action('skip');return}
const command={KeyE:'use',KeyF:'light',Escape:'pause',KeyR:'restart',KeyT:'touch'}[e.code]
if(command){e.preventDefault();action(command)}
}
const blur=()=>{pressed.clear();if(state==='playing'||state==='intro')action('pause')}
const visibility=()=>{if(document.hidden)blur()}
const aim=e=>{if(e.pointerType==='touch')return;const r=canvas.current.getBoundingClientRect();const c=game.camera||{x:320,y:360};game.angle=Math.atan2((e.clientY-r.top)*720/r.height+c.y-game.player.y,(e.clientX-r.left)*1280/r.width+c.x-game.player.x);game.mouse=true}
const tick=now=>{
if(!alive)return
const dt=Math.min((now-last)/1000||0,.033);last=now
if(state==='intro'){
const before=intro;intro+=dt;renderIntro(canvas.current.getContext('2d'),intro,images,reduced)
if([1.1,3.6].some(t=>before<t&&intro>=t)){tracks.thunder.currentTime=0;play('thunder')}
if(intro>=10)change('playing')
}
if(state==='playing'){
game.time+=dt;game.messageTime-=dt
const usingStick=Math.hypot(analog.x,analog.y)>0
const dx=usingStick?analog.x:Number(pressed.has('right'))-Number(pressed.has('left')),dy=usingStick?analog.y:Number(pressed.has('down'))-Number(pressed.has('up')),len=Math.hypot(dx,dy)
const old={...game.player},running=usingStick?len>=.85:pressed.has('run')
if(len){move(game.player,dx/Math.max(1,len)*(running?310:190)*dt,dy/Math.max(1,len)*(running?310:190)*dt,game.closed);if(!game.mouse)game.angle=Math.atan2(dy,dx)}
const travelled=distance(old,game.player);game.moving=travelled>.01;game.steps+=travelled
for(const sound of ['walk','run']){if(game.moving&&sound===(running?'run':'walk'))play(sound);else tracks[sound].pause()}
game.keys.forEach((k,i)=>{
if(game.collected.includes(i)||distance(k,game.player)>34)return
if(game.enemy){game.message='Primero encierra a la presencia en su habitación.';game.messageTime=2;return}
game.collected.push(i)
const points=candidates[i].filter(p=>distance(p,game.player)>=180&&route(p,game.player,game.closed).length)
const spawn=points[Math.floor(Math.random()*points.length)]
if(spawn)game.enemy={...spawn,path:[],repath:0}
game.message='¡Corre al pasillo y cierra la puerta con E!';game.messageTime=5
})
if(game.enemy){
const e=game.enemy;e.repath-=dt
if(e.repath<=0){e.path=route(e,game.player,game.closed);e.repath=.3}
const target=e.path[0]
if(target){const d=distance(e,target),step=Math.min(d,220*dt);if(d>.01)move(e,(target.x-e.x)/d*step,(target.y-e.y)/d*step,game.closed);if(d<8)e.path.shift()}
play('enemy')
if(distance(e,game.player)<32)change('lost')
}else tracks.enemy.pause()
render(canvas.current.getContext('2d'),game,images)
hudTime+=dt;if(hudTime>.15){sync();hudTime=0}
}
frame=requestAnimationFrame(tick)
}
loadArt().then(art=>{if(!alive)return;images=art;change('title');frame=requestAnimationFrame(tick)}).catch(()=>{if(alive)change('error')})
const node=host.current,previousFocus=document.activeElement
node.focus()
node.addEventListener('keydown',key);node.addEventListener('keyup',key);canvas.current.addEventListener('pointermove',aim)
window.addEventListener('blur',blur);document.addEventListener('visibilitychange',visibility)
const appRoot=document.getElementById('root'),wasInert=appRoot?.inert;if(appRoot)appRoot.inert=true;const oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden'
return ()=>{alive=false;cancelAnimationFrame(frame);runtime.current=null;Object.values(tracks).forEach(a=>{a.pause();a.removeAttribute('src');a.load()});node.removeEventListener('keydown',key);node.removeEventListener('keyup',key);window.removeEventListener('blur',blur);document.removeEventListener('visibilitychange',visibility);document.body.style.overflow=oldOverflow;if(appRoot)appRoot.inert=wasInert;previousFocus?.focus()}
},[])
const action=name=>runtime.current?.action(name)
return createPortal(<div className={touch?"uu uu-touch-mode":"uu"} ref={host} tabIndex={-1} role="dialog" aria-modal="true" aria-label="usUnknown" onKeyDown={e=>{
if(e.key!=='Tab')return
const nodes=[...host.current.querySelectorAll('button:not([disabled])')],first=nodes[0],last=nodes.at(-1)
if(e.shiftKey&&(document.activeElement===first||document.activeElement===host.current)){e.preventDefault();last?.focus()}
else if(!e.shiftKey&&(document.activeElement===last||document.activeElement===host.current)){e.preventDefault();first?.focus()}
}}>
<header className="uu-toolbar"><span>USUNKNOWN</span><div><button onClick={()=>action('sound')}>{muted?'Activar sonido':'Silenciar'}</button><button onClick={()=>action('touch')}>Táctil</button>{['playing','intro','paused'].includes(view.state)&&<button onClick={()=>action('pause')}>{view.state==='paused'?'Continuar':'Pausa'}</button>}<button onClick={onClose}>Cerrar juego ×</button></div></header>
<div className="uu-stage">
<canvas ref={canvas} width="1280" height="720" aria-label="Explora la mansión con WASD o flechas. Corre con Shift, usa E e ilumina con F."/>
{['loading','title','error'].includes(view.state)&&<div className="uu-cover" style={{backgroundImage:'linear-gradient(90deg,#060a12ed,#060a1240),url('+base+'art/menu-mansion.png)'}}><div><h1>USUNKNOWN</h1>{view.state==='title'?<button className="uu-primary" onClick={()=>action('start')}>Entrar en la mansión →</button>:<p role="status">{view.state==='error'?'No se pudieron cargar las imágenes. Cierra el juego y vuelve a intentarlo.':'Preparando la mansión…'}</p>}<p className="uu-help">WASD / flechas · Shift: correr · E: usar<br/>F: linterna · Esc: pausa · R: reiniciar</p></div></div>}
{view.state==='intro'&&<button className="uu-skip" onClick={()=>action('skip')}>Saltar intro · Espacio →</button>}
{view.state==='playing'&&<><div className="uu-hud"><span>{view.room}</span><span>Llaves {view.count} / 4 · Luz {view.light?'ON':'OFF'}</span></div>{view.message&&<p className="uu-message" role="status">{view.message}</p>}</>}
{['paused','won','lost'].includes(view.state)&&<div className="uu-overlay"><p className="uu-eyebrow">USUNKNOWN</p><h2>{view.state==='paused'?'Pausa':view.state==='won'?'Has escapado.':'Fin de la partida'}</h2>{view.state==='paused'&&<button className="uu-primary" onClick={()=>action('pause')}>Continuar</button>}<button onClick={()=>action('restart')}>Volver a comenzar</button><button onClick={()=>action('start')}>Ver cinemática</button></div>}
</div>
{view.state==='reading'&&view.reading&&<StoryReading title={view.reading.title} text={view.reading.text} onClose={()=>action('dismiss')} />}
{touch&&view.state==='playing'&&<div className="uu-touch"><TouchJoystick label="Mover" onChange={value=>runtime.current?.moveStick(value)} /><div className="uu-touch-actions"><button onClick={()=>action('light')}>Luz</button><button onClick={()=>action('use')}>Usar</button></div><TouchJoystick label="Linterna" onChange={value=>runtime.current?.aimStick(value)} /></div>}
<footer className="uu-footer">{touch?"Izquierdo: mover · Al borde: correr · Derecho: apuntar":"WASD / flechas: caminar · Shift: correr · E: usar · F: linterna · Esc: pausa"}</footer>
</div>, document.body)
}
