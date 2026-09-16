import {useRef,useState} from 'react'

export default function TouchJoystick({label,onChange}){
const pointer=useRef(null),[knob,setKnob]=useState({x:0,y:0})
const update=e=>{
const rect=e.currentTarget.getBoundingClientRect(),radius=rect.width/2
const x=(e.clientX-rect.left-radius)/radius,y=(e.clientY-rect.top-radius)/radius,length=Math.hypot(x,y)
const strength=Math.min(length,1),amount=Math.max(0,(strength-.16)/.84)
setKnob({x:length?x/length*strength:0,y:length?y/length*strength:0})
onChange({x:length?x/length*amount:0,y:length?y/length*amount:0})
}
const release=e=>{
if(pointer.current!==e.pointerId)return
pointer.current=null;setKnob({x:0,y:0});onChange({x:0,y:0})
if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)
}
return <div className="uu-stick-group"><div className="uu-stick" role="group" aria-label={label}
onPointerDown={e=>{if(pointer.current!==null||e.button!==0)return;e.preventDefault();pointer.current=e.pointerId;e.currentTarget.setPointerCapture(e.pointerId);update(e)}}
onPointerMove={e=>{if(pointer.current===e.pointerId)update(e)}}
onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}
><span className="uu-stick-knob" style={{transform:`translate(${knob.x*90}%, ${knob.y*90}%)`}} /></div><span>{label}</span></div>
}
