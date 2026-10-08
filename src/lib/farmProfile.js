export const FARMER_TYPES = ['Amador','Profissional','Agricultura biológica','Quinta familiar','Permacultura','Autossuficiência'];
export const FAVORITE_SEASONS = ['Primavera','Verão','Outono','Inverno'];
export const PROFILE_EMOJIS = ['🌱','🌾','🌻','🍅','🐓','🐝','🚜','🌳','🥕','🌿'];
export const emptyFarmProfile = { farm_name:'', full_name:'', experience_years:0, farmer_type:'Amador', favorite_season:'Primavera', favorite_crops:'', bio:'', avatar_emoji:'🌱' };
export function readFarmProfile() {
  try { return { ...emptyFarmProfile, ...JSON.parse(localStorage.getItem('hortaviva_current_user') || '{}') }; } catch { return { ...emptyFarmProfile }; }
}
export function sanitizeFarmProfile(raw = {}) {
  const text = (key, max) => typeof raw[key] === 'string' ? raw[key].trim().slice(0,max) : '';
  return { farm_name:text('farm_name',100), full_name:text('full_name',100), experience_years:Math.min(100,Math.max(0,Math.floor(Number(raw.experience_years)||0))), farmer_type:FARMER_TYPES.includes(raw.farmer_type)?raw.farmer_type:'Amador', favorite_season:FAVORITE_SEASONS.includes(raw.favorite_season)?raw.favorite_season:'Primavera', favorite_crops:text('favorite_crops',300), bio:text('bio',500), avatar_emoji:PROFILE_EMOJIS.includes(raw.avatar_emoji)?raw.avatar_emoji:'🌱' };
}
