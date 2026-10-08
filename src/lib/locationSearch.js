let databasePromise;
const normalize = value => (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export async function loadLocations() {
  if (!databasePromise) {
    databasePromise = fetch(`${import.meta.env.BASE_URL}data/locations.json`).then(response => {
      if (!response.ok) throw new Error('Could not load locations');
      return response.json();
    }).then(data => {
      if (!Array.isArray(data.cities)) throw new Error('Invalid locations');
      const localName = (name,country) => country === 'PT' ? ({Lisbon:'Lisboa',Oporto:'Porto'})[name] || name : name;
      return data.cities.map(row => ({ name: localName(row[0],row[1]), countryCode: row[1], region: localName(row[2],row[1]), latitude: row[3], longitude: row[4], timeZone: row[5], population: row[6], search: normalize(row[0] + ' ' + row[7] + ' ' + (row[8] || '')) }));
    }).catch(error => { databasePromise = null; throw error; });
  }
  return databasePromise;
}

export function searchLocations(locations, query, countryCode) {
  const needle = normalize(query);
  if (needle.length < 2) return [];
  const found = locations.filter(city => city.countryCode === countryCode && city.search.includes(needle));
  const score = city => normalize(city.name) === needle ? 0 : normalize(city.name).startsWith(needle) ? 1 : 2;
  return found.sort((a,b) => score(a)-score(b) || b.population-a.population).slice(0, 12);
}

export function nearestLocation(locations, latitude, longitude) {
  const rad = Math.PI / 180;
  let nearest = null, best = Infinity;
  for (const city of locations) {
    const lat = (city.latitude-latitude)*rad, lon = (city.longitude-longitude)*rad;
    const distance = Math.sin(lat/2)**2 + Math.cos(latitude*rad)*Math.cos(city.latitude*rad)*Math.sin(lon/2)**2;
    if (distance < best) { best = distance; nearest = city; }
  }
  return nearest;
}
