import React, { memo, useId } from 'react';

function kindFor(foodKey, plantName) {
  const name = `${foodKey || ''} ${plantName || ''}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (/maracuja/.test(name)) return 'passionfruit';
  if (/nespera/.test(name)) return 'loquat';
  if (/morango/.test(name)) return 'strawberry';
  if (/mirtilo|amora|framboesa/.test(name)) return 'berries';
  if (/laranja|tangerina|clementina/.test(name)) return 'orange';
  if (/limao|lima\b/.test(name)) return 'lemon';
  if (/pimento|malagueta/.test(name)) return 'pepper';
  if (/alecrim|tomilho|lavanda|alfazema/.test(name)) return 'rosemary';
  if (/brocolo|couve-flor/.test(name)) return 'broccoli';
  if (/couve|repolho/.test(name)) return 'cabbage';
  if (/alface|nabica|espinafre|rucula|grel|acelga|manjericao|hortela|salsa|coentro|salvia/.test(name)) return 'leaves';
  if (/feijao|fava|ervilha/.test(name)) return 'pod';
  if (/noz|amendoa|amendoim|castanha|avela|pistacio/.test(name)) return 'walnut';
  if (/cenoura/.test(name)) return 'carrot';
  if (/tomate/.test(name)) return 'tomato';
  if (/abobora|melao/.test(name)) return 'pumpkin';
  if (/beringela/.test(name)) return 'eggplant';
  if (/pepino|courgette|curgete/.test(name)) return 'cucumber';
  if (/milho/.test(name)) return 'corn';
  if (/batata|gengibre|inhame/.test(name)) return 'potato';
  if (/cebola|alho|funcho/.test(name)) return 'onion';
  if (/beterraba|nabo|rabanete/.test(name)) return 'turnip';
  if (/cereja/.test(name)) return 'cherries';
  if (/uva/.test(name)) return 'grapes';
  if (/pera/.test(name)) return 'pear';
  if (/maca|pessego|alperce|nectarina|ameixa/.test(name)) return 'apple';
  if (/melancia/.test(name)) return 'watermelon';
  if (/banana/.test(name)) return 'banana';
  if (/cogumelo/.test(name)) return 'mushroom';
  return 'seedling';
}

function Shape({ kind, id }) {
  const green = `url(#${id}-green)`, red = `url(#${id}-red)`, gold = `url(#${id}-gold)`, purple = `url(#${id}-purple)`;
  const leaf = <><path d="M49 26C48 16 57 8 71 12C69 24 61 29 49 26Z" fill="#52964a"/><path d="M51 24L64 16" stroke="#347742" strokeWidth="2" strokeLinecap="round"/></>;
  switch (kind) {
    case 'orange': return <><path d="M49 31L47 19" stroke="#6b663b" strokeWidth="5" strokeLinecap="round"/>{leaf}<path d="M23 43C27 27 44 27 49 31C64 27 78 41 78 57C78 75 65 84 48 83C28 82 17 64 23 43Z" fill={gold}/><path d="M50 33C68 36 77 49 75 64C70 76 59 82 46 80C64 72 66 46 50 33Z" fill="#de852b" opacity=".45"/><path d="M32 43Q35 35 43 35" stroke="#fff0ad" strokeWidth="6" strokeLinecap="round" opacity=".7"/><g fill="#bc771f" opacity=".22"><circle cx="38" cy="64" r="1.4"/><circle cx="60" cy="54" r="1.3"/><circle cx="56" cy="72" r="1.2"/><circle cx="29" cy="53" r="1.1"/></g></>;
    case 'lemon': return <>{leaf}<path d="M18 56L23 47C26 29 51 25 66 35C78 43 74 62 81 66C70 74 63 82 47 79C33 78 22 70 18 56Z" fill={gold}/><path d="M24 52Q34 34 51 36" stroke="#fff4b7" strokeWidth="6" strokeLinecap="round"/><path d="M44 78Q69 69 70 49" stroke="#dca434" strokeWidth="3" opacity=".5"/></>;
    case 'pepper': return <><path d="M48 33C44 23 47 16 57 16" stroke="#4f8a48" strokeWidth="7" strokeLinecap="round"/><path d="M48 31C32 24 20 35 24 57C23 74 34 84 44 78C54 87 65 80 66 72C77 68 77 49 69 38C63 28 56 29 48 31Z" fill={red}/><path d="M48 34C57 45 59 64 53 78M34 36C31 47 32 63 38 73" stroke="#af443d" strokeWidth="3" opacity=".48"/><path d="M31 43L31 52" stroke="#ffc6a2" strokeWidth="5" strokeLinecap="round"/><path d="M43 31L49 27L57 32L51 37Z" fill="#52894a"/></>;
    case 'berries': return <><path d="M46 37C46 23 56 16 69 21C64 34 57 38 46 37Z" fill="#5c9b62"/><path d="M45 34C34 24 23 27 20 39C31 45 40 41 45 34Z" fill="#80b86b"/>{[[35,45,16],[57,42,16],[67,62,16],[45,67,18],[25,65,14]].map(([x,y,r], i) => <g key={i}><circle cx={x} cy={y} r={r} fill={purple}/><path d={`M${x-5} ${y-10}Q${x-9} ${y-8} ${x-9} ${y-4}`} fill="none" stroke="#b8bce9" strokeWidth="4" strokeLinecap="round" opacity=".7"/><path d={`M${x-4} ${y-3}L${x} ${y-6}L${x+4} ${y-3}L${x+1} ${y}L${x-2} ${y}Z`} fill="#333c72" opacity=".75"/></g>)}</>;
    case 'passionfruit': return <><ellipse cx="39" cy="49" rx="24" ry="29" fill={purple}/><path d="M27 30Q32 24 38 25" stroke="#b6aad8" strokeWidth="5" strokeLinecap="round" opacity=".65"/><path d="M41 21L43 13" stroke="#6b7644" strokeWidth="4" strokeLinecap="round"/>{leaf}<ellipse cx="62" cy="63" rx="24" ry="22" fill="#72538e"/><ellipse cx="62" cy="60" rx="22" ry="20" fill="#fff2c5"/><ellipse cx="62" cy="60" rx="18" ry="16" fill="#edba58"/>{[[54,52],[64,50],[72,56],[51,61],[60,59],[67,66],[57,69],[75,65]].map(([x,y], i) => <ellipse key={i} cx={x} cy={y} rx="2.4" ry="3" transform={`rotate(${i*29} ${x} ${y})`} fill="#766344"/>)}<path d="M46 52Q50 47 57 46" stroke="#fff8db" strokeWidth="3" strokeLinecap="round"/></>;
    case 'loquat': return <><path d="M39 40L49 21L63 37M49 22L49 13" stroke="#87704b" strokeWidth="4" strokeLinecap="round"/>{leaf}<ellipse cx="31" cy="55" rx="17" ry="22" transform="rotate(19 31 55)" fill={gold}/><ellipse cx="65" cy="52" rx="17" ry="23" transform="rotate(-17 65 52)" fill={gold}/><ellipse cx="48" cy="66" rx="17" ry="21" fill={gold}/><path d="M24 44L21 51M58 40L56 46M41 56L39 63" stroke="#ffe7a2" strokeWidth="4" strokeLinecap="round"/><path d="M27 75L32 73M67 73L71 70M46 84L51 83" stroke="#9b633c" strokeWidth="3" strokeLinecap="round"/></>;
    case 'rosemary': return <><path d="M31 83L58 21M42 83L74 35M24 73L30 28" stroke="#8c794f" strokeWidth="3" strokeLinecap="round"/>{[[53,34,-35],[49,44,-35],[44,55,-35],[39,66,-35],[60,32,30],[56,43,30],[51,54,30],[46,66,30],[64,56,25],[58,68,25],[69,44,25],[58,54,-45],[52,67,-45],[28,44,-20],[29,55,30],[27,65,-20]].map(([x,y,angle], i) => <ellipse key={i} cx={x} cy={y} rx="4" ry="12" transform={`rotate(${angle} ${x} ${y})`} fill={i%2 ? '#629465' : '#8eb794'}/>)}<path d="M29 78L44 83" stroke="#d6b86b" strokeWidth="5" strokeLinecap="round"/></>;
    case 'cabbage': return <><path d="M47 80C24 89 10 66 18 51C13 35 30 21 44 27C60 15 80 28 77 43C91 55 79 79 61 81Z" fill="#579653"/><path d="M24 52C22 32 46 25 56 36C76 28 85 53 70 63C70 82 46 85 36 71C21 73 16 63 24 52Z" fill="#8fbe6e"/><path d="M39 36C55 29 71 41 70 57C68 74 42 80 32 65C21 50 29 39 39 36Z" fill={green}/><path d="M24 40Q47 42 45 74M67 38Q53 46 55 76M32 66Q42 61 43 54M60 60L68 55" fill="none" stroke="#d0dfa1" strokeWidth="2.4" strokeLinecap="round" opacity=".8"/><path d="M40 77L47 85L55 77" fill="#d4deae"/></>;
    case 'leaves': return <><path d="M31 81C22 73 19 64 25 55C12 44 22 28 33 32C33 15 54 14 57 28C71 18 83 34 75 46C91 56 78 71 67 71C63 85 44 87 31 81Z" fill="#78ad5b"/><path d="M42 78C25 64 33 53 32 42C38 48 42 51 47 61C43 46 48 31 53 28C60 43 58 56 53 64C62 52 72 48 77 51C75 65 65 75 55 79Z" fill={green}/><path d="M45 83L49 53M49 70L37 60M50 72L64 62" stroke="#d9e8b3" strokeWidth="3" strokeLinecap="round"/><path d="M43 85L56 85L52 74L46 74Z" fill="#dce6b9"/></>;
    case 'pod': return <><path d="M24 69C27 48 45 25 71 23C79 35 70 62 46 75L20 82Z" fill="#4e8b49"/><path d="M22 79C32 48 54 28 72 26C70 47 53 69 22 79Z" fill={green}/><path d="M27 72Q46 39 67 31" stroke="#cfe29b" strokeWidth="3" strokeLinecap="round"/>{[[38,63],[49,49],[61,37]].map(([x,y], i) => <g key={i}><ellipse cx={x} cy={y} rx="7.5" ry="10" transform={`rotate(38 ${x} ${y})`} fill="#d6e8a6"/><ellipse cx={x-1} cy={y-2} rx="3" ry="4" fill="#f1f2c9" opacity=".7"/></g>)}<path d="M70 25Q78 20 75 14" fill="none" stroke="#668d4b" strokeWidth="3" strokeLinecap="round"/></>;
    case 'walnut': return <><ellipse cx="62" cy="61" rx="20" ry="23" transform="rotate(20 62 61)" fill="#aa764b"/><path d="M54 43Q66 56 62 80M67 44Q74 62 69 76" fill="none" stroke="#83583d" strokeWidth="2.5" strokeLinecap="round"/><path d="M21 65C14 50 21 30 36 25C46 19 62 27 65 41C73 54 65 73 51 79C36 87 23 78 21 65Z" fill="#c59661"/><path d="M42 26C34 42 54 55 43 79" stroke="#8e603e" strokeWidth="3" fill="none" strokeLinecap="round"/><path d="M32 34L28 44L33 51L27 60L32 71M52 34L57 43L53 52L58 61L53 70" stroke="#a5774c" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M28 35L25 43" stroke="#e4bb85" strokeWidth="4" strokeLinecap="round"/></>;
    case 'carrot': return <><path d="M45 32C42 19 47 10 54 8L55 28C61 16 71 14 76 16L61 36C75 26 83 28 85 32L62 42Z" fill="#559752"/><path d="M34 34C41 27 58 31 63 41C65 54 40 82 19 88C20 66 26 43 34 34Z" fill={gold}/><path d="M30 49L39 54M24 64L32 68M45 36L52 40" stroke="#c77b37" strokeWidth="3" strokeLinecap="round"/><path d="M33 41L28 52" stroke="#ffe2a7" strokeWidth="4" strokeLinecap="round"/></>;
    case 'tomato': return <><path d="M50 29C67 24 80 38 79 55C79 75 65 83 47 82C27 83 16 71 18 53C18 37 34 26 50 29Z" fill={red}/><path d="M56 33C73 48 69 71 53 80C69 80 79 67 77 51C74 39 67 33 56 33Z" fill="#c54c3c" opacity=".6"/><path d="M49 35L34 29L43 28L40 19L49 25L57 16L56 27L69 28L57 34L56 44Z" fill="#5e914c"/><path d="M28 44Q29 39 34 37" stroke="#ffd2ae" strokeWidth="5" strokeLinecap="round"/></>;
    case 'pumpkin': return <><path d="M47 31L47 19L55 14" stroke="#66814b" strokeWidth="7" strokeLinecap="round"/><ellipse cx="48" cy="56" rx="34" ry="26" fill="#dc8c39"/><ellipse cx="39" cy="56" rx="20" ry="27" fill={gold}/><ellipse cx="59" cy="56" rx="20" ry="27" fill={gold}/><ellipse cx="49" cy="56" rx="13" ry="28" fill="#f5b54e"/><path d="M46 36Q38 50 43 70" stroke="#ffdc89" strokeWidth="4" strokeLinecap="round" opacity=".7"/><path d="M68 32Q80 23 78 17" fill="none" stroke="#6e9852" strokeWidth="3" strokeLinecap="round"/></>;
    case 'eggplant': return <><path d="M55 27C74 28 79 46 67 65C58 82 39 91 26 80C10 68 31 52 39 36Z" fill={purple}/><path d="M32 65Q28 70 31 75" stroke="#b9a7d8" strokeWidth="5" strokeLinecap="round" opacity=".65"/><path d="M41 32L40 24L49 25L53 18L58 26L69 25L63 34L66 41L55 37L48 41Z" fill="#65985a"/><path d="M53 25Q59 15 66 17" fill="none" stroke="#557a49" strokeWidth="5" strokeLinecap="round"/></>;
    case 'cucumber': return <><path d="M24 75C13 66 29 47 49 27C64 11 80 20 77 34C73 53 48 79 32 82Z" fill={green}/><path d="M29 72Q48 55 67 29" stroke="#b6d47d" strokeWidth="4" strokeLinecap="round"/>{[[38,61],[51,49],[62,35],[34,71],[58,55],[68,40]].map(([x,y], i) => <circle key={i} cx={x} cy={y} r="1.6" fill="#54854b"/>)}</>;
    case 'corn': return <><path d="M38 25C41 13 54 11 59 25L63 65L46 79L30 64Z" fill={gold}/>{[29,39,49,59].map(y => <path key={y} d={`M35 ${y}L59 ${y}`} stroke="#d59335" strokeWidth="2"/>)}<path d="M44 23V68M53 23V66" stroke="#ffe2a0" strokeWidth="2"/><path d="M44 85C21 77 17 59 21 40C38 45 45 60 44 85Z" fill="#6d9d51"/><path d="M44 85C67 78 80 53 76 33C56 43 45 61 44 85Z" fill={green}/><path d="M48 77L68 48" stroke="#c4d58d" strokeWidth="2.5"/></>;
    case 'potato': return <><ellipse cx="62" cy="63" rx="23" ry="18" transform="rotate(-23 62 63)" fill="#b99465"/><path d="M19 69C10 57 21 39 37 30C55 22 66 32 64 48C67 63 48 80 32 80C25 79 21 75 19 69Z" fill="#cead78"/><path d="M26 48Q31 39 40 37" stroke="#ead2a2" strokeWidth="5" strokeLinecap="round"/>{[[28,61],[44,48],[48,66],[65,58],[70,70]].map(([x,y], i) => <path key={i} d={`M${x-2} ${y}L${x+1} ${y+1}`} stroke="#967149" strokeWidth="2" strokeLinecap="round"/>)}</>;
    case 'onion': return <><path d="M47 30L40 12M49 31L53 8M52 34L64 15" stroke="#7d9f61" strokeWidth="5" strokeLinecap="round"/><path d="M46 29C39 42 20 45 20 62C20 79 35 85 49 84C66 84 79 77 77 61C75 45 60 39 53 30Z" fill="#d6aa72"/><path d="M45 34C31 55 31 72 44 81M52 34C64 54 67 71 55 82" stroke="#b98c5e" strokeWidth="2.5" fill="none"/><path d="M35 52Q30 58 31 65" stroke="#f0d4a5" strokeWidth="5" strokeLinecap="round"/><path d="M45 84L43 90M50 84L51 91M55 83L59 89" stroke="#aa865b" strokeWidth="1.8" strokeLinecap="round"/></>;
    case 'turnip': return <><path d="M44 33C28 28 25 15 31 9C44 12 49 22 48 33C47 16 56 7 65 10C68 20 61 29 53 36Z" fill="#6e9e59"/><path d="M27 49C29 30 65 28 70 47C76 64 65 77 50 80L45 89L42 79C27 77 21 63 27 49Z" fill="#f0e5d5"/><path d="M27 49C30 30 65 28 70 47L65 54C54 49 44 56 28 54Z" fill="#c286a1"/><path d="M33 44Q37 38 44 38" stroke="#eed0d1" strokeWidth="4" strokeLinecap="round"/></>;
    case 'strawberry': return <><path d="M22 44C24 27 44 29 49 34C61 25 77 34 76 47C76 63 59 81 49 86C37 81 19 59 22 44Z" fill={red}/><path d="M48 36L31 29L43 26L46 17L52 26L66 25L59 34L61 41Z" fill="#639450"/>{[[33,45],[48,47],[63,43],[39,58],[57,58],[48,72]].map(([x,y], i) => <ellipse key={i} cx={x} cy={y} rx="1.7" ry="2.7" transform={`rotate(${i%2 ? 20 : -20} ${x} ${y})`} fill="#ffe3a4"/>)}<path d="M28 44L27 49" stroke="#ffccac" strokeWidth="4" strokeLinecap="round"/></>;
    case 'cherries': return <><path d="M31 56Q34 31 54 16Q55 36 69 53" stroke="#758547" strokeWidth="3" fill="none" strokeLinecap="round"/>{leaf}<circle cx="29" cy="65" r="18" fill={red}/><circle cx="67" cy="65" r="18" fill={red}/><path d="M20 58L19 63M58 58L57 63" stroke="#ffc6b0" strokeWidth="4" strokeLinecap="round"/><path d="M32 49L28 52M70 49L66 52" stroke="#8f4b40" strokeWidth="3" strokeLinecap="round"/></>;
    case 'grapes': return <><path d="M49 32L49 18L58 14" stroke="#7a7749" strokeWidth="4" strokeLinecap="round"/>{leaf}{[[34,39],[54,39],[68,48],[25,55],[46,56],[60,67],[39,73],[48,83]].map(([x,y], i) => <g key={i}><circle cx={x} cy={y} r="11" fill={purple}/><path d={`M${x-4} ${y-6}L${x-6} ${y-3}`} stroke="#b7aad8" strokeWidth="3" strokeLinecap="round" opacity=".7"/></g>)}</>;
    case 'pear': return <><path d="M48 26L51 14" stroke="#89764a" strokeWidth="5" strokeLinecap="round"/>{leaf}<path d="M45 25C58 22 61 35 62 42C65 50 77 59 73 71C70 86 29 91 23 74C16 58 32 49 35 39C36 33 36 27 45 25Z" fill={green}/><path d="M32 59Q28 64 30 70" stroke="#e5e7b2" strokeWidth="5" strokeLinecap="round"/><path d="M59 46Q76 65 64 78" fill="none" stroke="#71944d" strokeWidth="3" opacity=".5"/></>;
    case 'apple': return <><path d="M48 31L50 16" stroke="#86724b" strokeWidth="5" strokeLinecap="round"/>{leaf}<path d="M48 33C30 23 16 37 19 56C20 73 32 88 48 80C62 88 77 71 77 53C77 34 62 26 48 33Z" fill={red}/><path d="M29 43Q26 49 28 56" stroke="#ffd1ad" strokeWidth="5" strokeLinecap="round"/><path d="M47 35Q53 32 57 34" stroke="#a34f38" strokeWidth="2" strokeLinecap="round"/></>;
    case 'watermelon': return <><path d="M14 44Q48 89 83 44L87 49Q49 99 10 49Z" fill="#5b9854"/><path d="M14 44L83 44Q48 87 14 44Z" fill="#ed9078"/><path d="M18 46L79 46Q48 82 18 46Z" fill="#e67462"/><path d="M18 44H79" stroke="#f1deb0" strokeWidth="3" strokeLinecap="round"/>{[[32,52],[46,55],[60,51],[44,68],[60,62]].map(([x,y], i) => <ellipse key={i} cx={x} cy={y} rx="1.8" ry="3" transform={`rotate(${i*25} ${x} ${y})`} fill="#705745"/>)}</>;
    case 'banana': return <><path d="M24 34C33 61 57 70 77 48L81 55C69 86 25 85 16 46Z" fill={gold}/><path d="M24 34C34 61 57 70 77 48" stroke="#f7df8f" strokeWidth="5" fill="none"/><path d="M18 39L24 33M78 49L83 45" stroke="#8f7c49" strokeWidth="6" strokeLinecap="round"/><path d="M33 70Q52 78 69 66" stroke="#dba64a" strokeWidth="2.5" fill="none"/></>;
    case 'mushroom': return <><path d="M40 51L35 80Q47 88 59 80L55 51Z" fill="#eadac1"/><path d="M42 56L40 76" stroke="#cdbba0" strokeWidth="2.5" strokeLinecap="round"/><path d="M15 52C16 30 32 19 48 20C67 19 81 33 82 51C65 65 30 65 15 52Z" fill="#b88867"/><path d="M22 41Q27 28 40 27" stroke="#dcc0a0" strokeWidth="5" strokeLinecap="round"/><ellipse cx="48" cy="53" rx="32" ry="7" fill="#dcc2a2"/></>;
    case 'broccoli': return <><path d="M42 48L38 83Q48 88 58 82L53 46Z" fill="#9cbb77"/><path d="M48 76L47 48M44 63L32 51M51 62L63 50" stroke="#729658" strokeWidth="3" strokeLinecap="round"/><path d="M18 46C9 31 24 20 35 25C39 10 60 12 66 25C82 19 91 37 79 48C77 63 57 65 48 56C37 67 18 62 18 46Z" fill="#4e8854"/><g fill="#6c9f62"><circle cx="26" cy="35" r="12"/><circle cx="47" cy="27" r="13"/><circle cx="68" cy="37" r="12"/><circle cx="44" cy="45" r="14"/></g><path d="M23 30L28 28M42 20L47 19" stroke="#9fbd7f" strokeWidth="4" strokeLinecap="round"/></>;
    default: return <><path d="M47 71C47 54 47 40 51 26" stroke="#6a965a" strokeWidth="4" strokeLinecap="round"/><path d="M48 49C28 53 17 39 20 26C39 24 49 34 48 49Z" fill={green}/><path d="M50 38C49 21 64 13 77 16C77 32 63 42 50 38Z" fill="#7dad69"/><path d="M27 32L44 45M57 33L69 23" stroke="#b9d794" strokeWidth="2" strokeLinecap="round"/><path d="M34 72C31 60 39 55 47 61C56 50 68 60 62 73C60 84 41 89 34 72Z" fill="#ba9869"/><path d="M46 61Q39 72 47 80" fill="none" stroke="#e4c8a0" strokeWidth="3" strokeLinecap="round"/></>;
  }
}

/** Decorative only: keep the product's visible name on its card/button. */
function ProduceIllustration({ foodKey, plantName, className = '', style, ...props }) {
  const id = `hv-produce-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const kind = kindFor(foodKey, plantName);
  return <svg {...props} width="96" height="96" viewBox="0 0 96 96" fill="none" className={`shrink-0 ${className}`} style={style} aria-hidden="true" focusable="false" data-produce={kind}>
    <defs>
      <linearGradient id={`${id}-green`} x1="25" y1="27" x2="70" y2="79" gradientUnits="userSpaceOnUse"><stop stopColor="#b5cd77"/><stop offset="1" stopColor="#62944e"/></linearGradient>
      <linearGradient id={`${id}-gold`} x1="27" y1="29" x2="66" y2="79" gradientUnits="userSpaceOnUse"><stop stopColor="#ffd574"/><stop offset="1" stopColor="#e99a37"/></linearGradient>
      <linearGradient id={`${id}-red`} x1="26" y1="29" x2="67" y2="79" gradientUnits="userSpaceOnUse"><stop stopColor="#f38e6c"/><stop offset="1" stopColor="#cc5146"/></linearGradient>
      <linearGradient id={`${id}-purple`} x1="28" y1="26" x2="65" y2="80" gradientUnits="userSpaceOnUse"><stop stopColor="#8c8dbf"/><stop offset="1" stopColor="#5a537f"/></linearGradient>
    </defs>
    <ellipse cx="48" cy="85" rx="29" ry="5" fill="#526d45" opacity=".13"/>
    <Shape kind={kind} id={id}/>
  </svg>;
}

export default memo(ProduceIllustration);
