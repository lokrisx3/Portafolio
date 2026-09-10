export const SKINS = [
  { id: 'classic', name: 'Pudú del bosque', price: 0, colors: ['#af7648', '#c38b56', '#d5a471', '#895738'] },
  { id: 'snow', name: 'Pudú de nieve', price: 12, colors: ['#b8cbd6', '#e5eff3', '#ffffff', '#8195a6'] },
  { id: 'copper', name: 'Pudú cobrizo', price: 20, colors: ['#a3442e', '#e77c44', '#ffc17a', '#73382c'] },
  { id: 'violet', name: 'Pudú lunar', price: 30, colors: ['#7953ac', '#b18ae1', '#e4caff', '#513973'] },
  { id: 'gothic', name: 'Pudú gótico', price: 35, colors: ['#302b40', '#51465f', '#aa85bd', '#211e30'] },
  { id: 'huaso', name: 'Pudú huaso chileno', price: 35, colors: ['#a96c3e', '#c88c54', '#e4b780', '#714629'] },
]
export const SCENES = [
  { id: 'forest', name: 'Bosque nocturno', price: 0, colors: ['#09141d', '#172e32', '#193b39', '#8adc80', '#172b2b', '#35534a'] },
  { id: 'dawn', name: 'Bosque al amanecer', price: 25, colors: ['#462c45', '#684353', '#985e65', '#f3c487', '#573c40', '#976554'] },
  { id: 'winter', name: 'Bosque nevado', price: 40, colors: ['#182d49', '#344d69', '#7395ad', '#e5f5ff', '#465d77', '#9bb9cd'] },
  { id: 'fiestas', name: 'Ciudad de Fiestas Patrias', price: 45, colors: ['#232d48', '#997669', '#b99a7a', '#d8c9ad', '#363c4b', '#626977'] },
]
const KEY = 'pudu-runner-progress'
export function readProgress() {
  let data = {}
  try { data = JSON.parse(localStorage.getItem(KEY)) || {} } catch { /* Start with defaults. */ }
  const number = (value) => Number.isSafeInteger(value) && value >= 0 ? value : 0
  const ownedSkins = SKINS.filter(item => item.price === 0 || data.ownedSkins?.includes?.(item.id)).map(item => item.id)
  const ownedScenes = SCENES.filter(item => item.price === 0 || data.ownedScenes?.includes?.(item.id)).map(item => item.id)
  let legacy = 0
  try { legacy = number(Number(localStorage.getItem('pudu-runner-record'))) } catch { /* Storage may be unavailable. */ }
  return { coins: number(data.coins), distance: number(data.distance), best: Math.max(number(data.best), legacy), ownedSkins, ownedScenes,
    skin: ownedSkins.includes(data.skin) ? data.skin : 'classic', scene: ownedScenes.includes(data.scene) ? data.scene : 'forest' }
}
export function saveProgress(progress) {
  try { localStorage.setItem(KEY, JSON.stringify(progress)); return true } catch { return false }
}
export function addDistance(progress, meters, previousRunMeters) {
  const distance = progress.distance + meters
  return { ...progress, distance, coins: progress.coins + Math.floor((previousRunMeters + meters) / 100) - Math.floor(previousRunMeters / 100) }
}
export function purchase(progress, type, id) {
  const skin = type === 'skin'
  const item = (skin ? SKINS : SCENES).find(item => item.id === id)
  const owned = skin ? 'ownedSkins' : 'ownedScenes'
  if (!item || (!progress[owned].includes(id) && progress.coins < item.price)) return progress
  return { ...progress, [type]: id, coins: progress.coins - (progress[owned].includes(id) ? 0 : item.price), [owned]: [...new Set([...progress[owned], id])] }
}
