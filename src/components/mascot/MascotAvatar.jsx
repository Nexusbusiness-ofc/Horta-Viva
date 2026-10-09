import React, { useId } from 'react';
import './mascot.css';

const PALETTES = [
  ['#9cdd8a', '#409f72', '#daf5b5'], ['#8bdca1', '#258a71', '#e3f7b2'],
  ['#73d2b0', '#268b88', '#e5ffb9'], ['#9ac9f0', '#497ab1', '#fff0a7'],
  ['#c6b5ed', '#8568bc', '#ffe2a8'], ['#f3b6ca', '#b66c9e', '#fff0bb'],
  ['#edc183', '#ba8451', '#fff5c8'], ['#8cdac8', '#327f83', '#eaffc0'],
];

/** A decorative vector character; the surrounding UI supplies its accessible name. */
export default function MascotAvatar({ species = 'sprout', accessory = 'none', mood = 'happy', reaction = null, className = '', level = 1, evolutionStage = 0 }) {
  const id = useId().replace(/:/g, '');
  const stage = Math.max(0, Math.floor(Number(evolutionStage) || 0));
  const hue = (stage * 137.508 + 138) % 360;
  const [light, dark, highlight] = stage < PALETTES.length ? PALETTES[stage] : [`hsl(${hue} 55% 74%)`, `hsl(${hue} 35% 43%)`, `hsl(${(hue + 58) % 360} 72% 87%)`];
  const effect = typeof reaction === 'object' ? reaction?.type : reaction;
  const hungry = mood === 'hungry' || mood === 'thirsty';
  const isFox = species === 'fox';
  const isBunny = species === 'bunny';
  const bodyLight = isFox && stage === 0 ? '#f5ae70' : isBunny && stage === 0 ? '#f1ddc7' : light;
  const bodyDark = isFox && stage === 0 ? '#cf754c' : isBunny && stage === 0 ? '#d6b6a3' : dark;
  const size = 0.82 + Math.min(stage, 6) * 0.035;
  return <div className={`hv-mascot ${effect ? `hv-mascot--${effect}` : ''} ${className}`} data-species={species} data-stage={stage} aria-hidden="true">
    <svg viewBox="0 0 260 280" fill="none" focusable="false">
      <defs>
        <linearGradient id={`${id}-body`} x1="85" y1="90" x2="181" y2="239" gradientUnits="userSpaceOnUse"><stop stopColor={bodyLight}/><stop offset="1" stopColor={bodyDark}/></linearGradient>
        <linearGradient id={`${id}-leaf`} x1="115" y1="31" x2="155" y2="93" gradientUnits="userSpaceOnUse"><stop stopColor={highlight}/><stop offset="1" stopColor="#429b63"/></linearGradient>
        <radialGradient id={`${id}-shine`}><stop stopColor="white" stopOpacity=".45"/><stop offset="1" stopColor="white" stopOpacity="0"/></radialGradient>
      </defs>
      <ellipse className="hv-mascot-shadow" cx="132" cy="248" rx="66" ry="12" fill="#386a54" opacity=".15"/>
      <g className="hv-mascot-body" style={{ transformOrigin: '130px 242px' }}>
        <g transform={`translate(${130 * (1 - size)} ${242 * (1 - size)}) scale(${size})`}>
          {isFox && <path d="M181 174C240 130 253 185 222 212C209 224 185 219 172 209Z" fill={bodyDark} stroke="#744b3a" strokeOpacity=".13" strokeWidth="3"/>}
          {isFox && <path d="M230 163C249 175 241 197 226 209L210 185Z" fill="#fff0db"/>}
          {isBunny && <g><path d="M89 119C56 67 59 17 78 18C102 18 110 79 110 116Z" fill={bodyLight} stroke={bodyDark} strokeWidth="3"/><path d="M89 94C74 61 72 35 79 34C87 33 96 70 98 98Z" fill="#e7a5aa" opacity=".7"/><path d="M151 115C157 61 177 16 194 24C217 35 188 91 174 123Z" fill={bodyLight} stroke={bodyDark} strokeWidth="3"/><path d="M167 96C174 62 188 37 192 41C197 48 179 84 173 101Z" fill="#e7a5aa" opacity=".7"/></g>}
          {isFox && <g><path d="M82 134L68 57Q103 66 115 102Z" fill={bodyLight} stroke={bodyDark} strokeWidth="3"/><path d="M84 109L80 76L104 103Z" fill="#824e45"/><path d="M145 101Q161 66 197 57L184 135Z" fill={bodyLight} stroke={bodyDark} strokeWidth="3"/><path d="M160 103L185 77L179 110Z" fill="#824e45"/></g>}
          {!isFox && !isBunny && <g className="hv-mascot-leaves"><path d="M133 106C130 83 129 65 134 45" stroke="#4a8f58" strokeWidth="8" strokeLinecap="round"/><path d="M132 74C97 77 79 58 78 39C105 30 129 43 132 74Z" fill={`url(#${id}-leaf)`}/><path d="M132 61C138 29 164 18 185 24C181 52 160 69 132 61Z" fill={`url(#${id}-leaf)`}/><path d="M94 45L126 67M141 54L173 33" stroke="#287e4c" strokeWidth="2.5" strokeLinecap="round" opacity=".5"/></g>}
          <ellipse cx="103" cy="238" rx="22" ry="11" fill={bodyDark}/><ellipse cx="161" cy="238" rx="22" ry="11" fill={bodyDark}/>
          <path d="M66 171C64 126 89 94 130 93C176 91 198 124 199 167C201 209 183 242 132 242C83 242 65 217 66 171Z" fill={`url(#${id}-body)`}/>
          <ellipse cx="109" cy="122" rx="43" ry="34" fill={`url(#${id}-shine)`}/>
          {(isFox || isBunny) && <path d="M78 159C90 148 107 158 131 178C153 158 175 148 190 160C190 206 166 228 132 229C99 228 78 205 78 159Z" fill="#fff5e4" opacity=".93"/>}
          {!isFox && !isBunny && <ellipse cx="131" cy="206" rx="38" ry="24" fill={highlight} opacity=".38"/>}
          <path className="hv-mascot-arm" d="M72 169C56 166 45 176 50 187C53 194 66 189 74 183" fill={bodyLight} stroke={bodyDark} strokeWidth="2"/>
          <path d="M192 169C208 166 219 176 214 187C211 194 198 189 190 183" fill={bodyLight} stroke={bodyDark} strokeWidth="2"/>
          {stage > 0 && <g opacity=".7"><path d="M102 211Q109 199 116 211Q109 221 102 211Z" fill={highlight}/><path d="M147 211Q154 199 161 211Q154 221 147 211Z" fill={highlight}/></g>}
          {stage > 2 && <g fill={highlight} opacity=".6"><circle cx="83" cy="142" r="4"/><circle cx="180" cy="142" r="4"/><path d="M124 116L131 106L138 116L131 125Z"/></g>}
          <g className="hv-mascot-eyes">
            <ellipse cx="106" cy="159" rx="7" ry={hungry ? 9 : 10} fill="#263e35"/><ellipse cx="157" cy="159" rx="7" ry={hungry ? 9 : 10} fill="#263e35"/>
            <circle cx="108" cy="156" r="2.3" fill="white"/><circle cx="159" cy="156" r="2.3" fill="white"/>
          </g>
          <ellipse cx="91" cy="175" rx="12" ry="6" fill="#ed9997" opacity=".6"/><ellipse cx="173" cy="175" rx="12" ry="6" fill="#ed9997" opacity=".6"/>
          {(isFox || isBunny) && <path d="M126 171Q131 167 137 171L132 177Z" fill="#735344"/>}
          {effect === 'eat' ? <ellipse className="hv-mascot-chew" cx="131" cy="184" rx="8" ry="6" fill="#36533f"/> : hungry ? <path d="M123 188Q131 181 140 188" stroke="#36533f" strokeWidth="3.2" strokeLinecap="round"/> : <path d="M120 180Q131 194 143 180" stroke="#36533f" strokeWidth="3.2" strokeLinecap="round"/>}
          {stage > 1 && <g transform="translate(113 79)"><path d="M0 18L1 4L12 11L20 0L28 11L39 4L40 18Z" fill={stage > 5 ? '#edc467' : highlight} stroke={dark} strokeWidth="2"/>{stage > 4 && <circle cx="20" cy="10" r="3" fill="#faf5df"/>}</g>}
          {stage > 7 && <g fill="#f1d789"><path d="M59 129L62 122L65 129L72 132L65 135L62 142L59 135L52 132Z"/><path d="M202 110L205 103L208 110L215 113L208 116L205 123L202 116L195 113Z"/></g>}
          {accessory === 'leaf' && <path d="M109 94C82 92 77 76 82 67C104 65 116 77 109 94Z" fill="#458b5d"/>}
          {accessory === 'flower' && <g transform="translate(169 108)"><g fill="#f7bdc9"><ellipse cy="-9" rx="6" ry="9"/><ellipse cy="9" rx="6" ry="9"/><ellipse cx="-9" rx="9" ry="6"/><ellipse cx="9" rx="9" ry="6"/></g><circle r="6" fill="#ffe28a"/></g>}
          {accessory === 'hat' && <g transform="translate(131 105)"><path d="M-28-4L-20-31Q0-39 21-31L29-4Z" fill="#edcd8c"/><path d="M-27-10L27-10L29-4H-28Z" fill="#6b9d70"/><ellipse cy="-2" rx="45" ry="8" fill="#dfb875"/></g>}
          {accessory === 'bow' && <g transform="translate(132 204)"><path d="M0 0L-20-9Q-28 1-20 11Z" fill="#e790a6"/><path d="M0 0L20-9Q28 1 20 11Z" fill="#e790a6"/><circle r="6" fill="#c86e91"/></g>}
          {stage > 0 && <g transform="translate(131 223)">
            {stage % 3 === 0 ? <path d="M0-13L4-5L13-4L7 3L8 12L0 8L-8 12L-7 3L-13-4L-4-5Z" fill="#f4d58b" stroke="#b59650" strokeWidth="1.5"/> : stage % 3 === 1 ? <circle r="11" fill="#f4d58b" stroke="#b59650" strokeWidth="1.5"/> : <path d="M0-13L11-6V7L0 13L-11 7V-6Z" fill="#f4d58b" stroke="#b59650" strokeWidth="1.5"/>}
            <text textAnchor="middle" y="4" fontSize={stage > 98 ? '8' : '10'} fontFamily="system-ui, sans-serif" fontWeight="800" fill="#725d2f">{stage}</text>
          </g>}
          {stage > 10 && Array.from({ length: Math.min(6, stage - 9) }, (_, i) => <circle key={i} cx={104 + i * 10} cy="132" r="2.5" fill={highlight}/>)}
        </g>
      </g>
      {effect === 'celebrate' && <g className="hv-mascot-sparkles" fill="#e7be61"><path d="M39 82L43 70L47 82L59 86L47 90L43 102L39 90L27 86Z"/><path d="M217 60L220 51L223 60L232 63L223 66L220 75L217 66L208 63Z"/><circle cx="211" cy="136" r="4"/></g>}
      <title>{`${species}, ${level}`}</title>
    </svg>
  </div>;
}
