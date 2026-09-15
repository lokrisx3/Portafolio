import assert from 'node:assert/strict'
import {createGame,blocked,route,candidates,doors,interact,move} from './world.js'
const spawn={x:960,y:720}
assert.equal(blocked(spawn),false)
for(const points of candidates){
assert.ok(points.length>0)
for(const p of points)assert.ok(route(spawn,p).length>0,'Every key location must be reachable')
}
const g=createGame(()=>.5)
assert.equal(g.keys.length,4)
for(let i=0;i<4;i++){
g.player={x:doors[i].x,y:doors[i].y+(i<2?50:-50)}
g.enemy={x:doors[i].x,y:doors[i].y+(i<2?-80:80)}
assert.equal(interact(g),'La presencia ha desaparecido.')
assert.equal(g.enemy,null)
assert.equal(g.closed[i],true)
assert.equal(blocked(doors[i],g.closed),true)
interact(g);assert.equal(g.closed[i],false)
g.player={x:doors[i].x,y:doors[i].y+(i<2?-50:50)}
g.enemy={x:doors[i].x,y:doors[i].y+(i<2?-100:100)}
interact(g);assert.ok(g.enemy,'Closing from inside must not remove enemy')
g.closed[i]=false;g.enemy=null
}
g.player={x:48,y:720}
assert.notEqual(interact(g),'escaped')
g.collected=[0,1,2,3];assert.equal(interact(g),'escaped')
const wall={x:50,y:50};move(wall,-30,0,[]);assert.equal(wall.x,50)
assert.deepEqual(createGame().closed,[false,false,false,false])
console.log('PASS: all key positions reachable, doors, trapping, collisions, exit and reset')
