import React, { memo, useId } from 'react';

function Tree({ x, y, scale = 1 }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx="3" cy="5" rx="42" ry="10" fill="#486a44" opacity=".13"/>
    <path d="M-7 3L-5-63L7-64L13 2Z" fill="#a57c50"/><path d="M6-60L7-7L13 2L12-58Z" fill="#805f40"/>
    <path d="M0-32L-19-51M5-48L24-66" stroke="#a57c50" strokeWidth="8" strokeLinecap="round"/>
    <path d="M-45-55L-51-78L-34-102L-7-109L19-102L41-83L45-60L24-42L-7-41Z" fill="#699957"/>
    <path d="M-51-78L-34-102L-7-109L-13-76Z" fill="#a1bd72"/><path d="M-7-109L19-102L28-76L-13-76Z" fill="#8db568"/>
    <path d="M19-102L41-83L45-60L28-76Z" fill="#70a15a"/><path d="M-45-55L-51-78L-13-76L-7-41Z" fill="#7cab60"/>
    <path d="M-13-76L28-76L24-42L-7-41Z" fill="#639653"/><path d="M28-76L45-60L24-42Z" fill="#4f844b"/>
    <circle cx="-24" cy="-79" r="4" fill="#e8ba64"/><circle cx="18" cy="-60" r="4" fill="#df9a52"/><circle cx="11" cy="-92" r="3.5" fill="#edc477"/>
  </g>;
}

function Fence({ x, y, length = 155 }) {
  const count = Math.max(2, Math.round(length / 28));
  return <g transform={`translate(${x} ${y})`}>
    <path d={`M0 0L${length} -12M0 12L${length} 0`} stroke="#c5aa76" strokeWidth="6" strokeLinecap="round"/>
    <path d={`M0 -2L${length} -14`} stroke="#e9d4a4" strokeWidth="2" strokeLinecap="round"/>
    {Array.from({ length: count + 1 }, (_, index) => {
      const offset = index * length / count;
      return <path key={index} d={`M${offset-4} ${-10-offset*12/length}L${offset} ${-14-offset*12/length}L${offset+4} ${-10-offset*12/length}V${24-offset*12/length}H${offset-4}Z`} fill="#d8bd87" stroke="#b89b6b" strokeWidth="1"/>;
    })}
  </g>;
}

function Crate({ x, y, scale = 1, color = '#e38d59', leaves = false }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx="36" cy="38" rx="39" ry="10" fill="#496b43" opacity=".12"/>
    <path d="M0 0L46-9L73 5L26 16Z" fill="#d2ab70"/>
    <path d="M5 0L46-7L66 4L26 12Z" fill="#826345"/>
    {leaves ? <g fill="#83ad60"><path d="M14 5C0-8 17-18 28-4C32-23 53-18 48-3C69-13 78 2 60 11Z"/><path d="M23 8L26-8L35 1L42-14L49 2L62-3L54 12Z" fill="#a6c77c"/></g> : <g fill={color}><circle cx="17" cy="0" r="10"/><circle cx="34" cy="-4" r="11"/><circle cx="50" cy="-4" r="9"/><circle cx="58" cy="7" r="10"/><circle cx="33" cy="9" r="10"/><path d="M14-5L17-9L21-5M32-10L35-14L38-10M47-9L51-12L54-9" stroke="#6a9250" strokeWidth="3" strokeLinecap="round"/></g>}
    <path d="M0 0L26 16V44L0 28Z" fill="#bc905a"/><path d="M26 16L73 5V34L26 44Z" fill="#d9b17a"/>
    <path d="M3 9L23 21M3 20L23 32M29 23L70 13M29 34L70 24" stroke="#997548" strokeWidth="2.5"/>
    <path d="M0 0V29M26 15V44M73 5V34" stroke="#e8c58e" strokeWidth="4"/>
    <path d="M41 22L58 18" stroke="#9a764b" strokeWidth="3" strokeLinecap="round"/>
  </g>;
}

/** An original, compact decorative farm scene; no external game assets or animation. */
function FarmMarketScene({ className = '', style, ...props }) {
  const id = `hv-market-scene-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const stripes = Array.from({ length: 7 }, (_, index) => {
    const left = index / 7, right = (index + 1) / 7;
    return { topLeft: [427 + 177 * left, 75 - 20 * left], topRight: [427 + 177 * right, 75 - 20 * right],
      bottomLeft: [500 + 178 * left, 122 - 22 * left], bottomRight: [500 + 178 * right, 122 - 22 * right] };
  });
  const points = values => values.map(value => value.join(',')).join(' ');
  return <svg {...props} viewBox="0 0 1000 260" width="100%" fill="none" className={`block w-full ${className}`} style={style} aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor="#d8e8e5"/><stop offset="1" stopColor="#f5f0d9"/></linearGradient>
      <linearGradient id={`${id}-grass`} x1="0" y1="0" x2=".3" y2="1"><stop stopColor="#c4d69b"/><stop offset="1" stopColor="#a7bf7d"/></linearGradient>
      <linearGradient id={`${id}-wood`} x2="0" y2="1"><stop stopColor="#c29a68"/><stop offset="1" stopColor="#ad8253"/></linearGradient>
    </defs>
    <path d="M0 0H1000V260H0Z" fill={`url(#${id}-sky)`}/>
    <circle cx="755" cy="37" r="24" fill="#f8e6ad" opacity=".8"/>
    <path d="M84 48C90 37 105 35 113 44C120 29 142 31 147 45C164 41 173 50 171 57H78C76 53 79 49 84 48ZM809 65C813 54 826 51 835 59C844 43 865 46 871 59C885 54 897 62 898 70H803C802 68 805 65 809 65Z" fill="#fffdf0" opacity=".72"/>
    <path d="M0 119L94 80L190 95L275 74L394 99L499 77L623 102L757 82L884 106L1000 81V260H0Z" fill="#c5d4ad"/>
    <path d="M0 149L142 107L293 123L452 102L601 128L787 109L1000 130V260H0Z" fill={`url(#${id}-grass)`}/>
    <path d="M0 152L142 107L293 123L151 169Z" fill="#d3dea9"/><path d="M151 169L293 123L452 102L361 177Z" fill="#b8ce91"/>
    <path d="M666 150L787 109L1000 130L827 184Z" fill="#b7cc8b"/><path d="M827 184L1000 130V260Z" fill="#9bb873" opacity=".7"/>
    <path d="M341 260L498 192L557 162L607 171L566 211L533 260Z" fill="#dbc694"/><path d="M341 260L498 192L557 162L580 165L514 214L444 260Z" fill="#e7d4a5"/>
    <path d="M456 242L471 237L484 242L470 248ZM512 213L522 208L533 212L523 218ZM538 189L548 185L558 188L550 193Z" fill="#c6b58a" opacity=".6"/>
    <g opacity=".6" stroke="#8fac70" strokeWidth="4" strokeLinecap="round"><path d="M195 152L279 130M203 165L302 139M214 179L327 149M752 141L830 157M738 151L813 168M728 162L799 180"/></g>
    <Fence x={202} y={137} length={177}/><Fence x={753} y={151} length={182}/>
    <g transform="translate(296 111)"><ellipse cx="8" cy="25" rx="43" ry="8" fill="#65854f" opacity=".14"/><path d="M-23-18L10-23L31-10V23L-2 29L-23 16Z" fill="#b78c64"/><path d="M-2-8L31-10V23L-2 29Z" fill="#c89f74"/><path d="M-32-18L-4-42L40-16L31-10L10-23L-2-8Z" fill="#b96755"/><path d="M-32-18L-4-42L10-23L-2-8Z" fill="#cf8567"/><path d="M7 6L21 4V25L7 27Z" fill="#866d4d"/><path d="M11 9L18 8" stroke="#dbc192" strokeWidth="2"/></g>
    <Tree x={129} y={165} scale={1.05}/><Tree x={861} y={183} scale={1.1}/>
    <g opacity=".85"><path d="M70 194L64 180L74 186L82 175L82 192M916 202L909 189L920 195L929 183L929 200" stroke="#739558" strokeWidth="3" strokeLinecap="round"/><circle cx="73" cy="185" r="3" fill="#f5e8b2"/><circle cx="920" cy="193" r="3" fill="#f3df9c"/></g>
    <ellipse cx="555" cy="204" rx="143" ry="23" fill="#557348" opacity=".14"/>
    <path d="M450 85L459 85L459 176L450 172ZM595 62L603 62L603 149L595 152Z" fill="#b68c5c"/>
    <path d="M451 87L453 87V170L451 169ZM597 66L599 66V147L597 148Z" fill="#debc85"/>
    <path d="M445 144L599 126L659 157L505 178Z" fill="#e0bb81"/>
    <path d="M445 144L505 178V208L445 175Z" fill="#a47c50"/><path d="M505 178L659 157V187L505 208Z" fill={`url(#${id}-wood)`}/>
    <path d="M454 153L496 177M454 165L496 189M515 185L650 166M515 197L650 178" stroke="#916e48" strokeWidth="2" opacity=".55"/>
    <path d="M503 177L660 156" stroke="#edcf97" strokeWidth="5" strokeLinecap="round"/>
    <g transform="translate(558 173)"><path d="M0 0L42-6V15L0 21Z" fill="#efd9a7"/><path d="M20 12C8 14 7 6 10 3C19 2 23 7 20 12ZM20 12C20 4 28-1 34 1C34 8 27 13 20 12Z" fill="#6c9857"/><path d="M20 17L21 8" stroke="#608c50" strokeWidth="2" strokeLinecap="round"/></g>
    <Crate x={466} y={143} scale={0.62} color="#d97555"/><Crate x={523} y={136} scale={0.62} leaves/><Crate x={578} y={131} scale={0.62} color="#e8ae4f"/>
    <path d="M499 115L508 113V211L499 207ZM651 98L659 97V189L651 190Z" fill="#a77d50"/>
    <path d="M501 120L503 120V202L501 202ZM653 104L655 103V186L653 186Z" fill="#dab380"/>
    <path d="M427 75L500 122L500 135L427 88Z" fill="#b76d57"/>
    {stripes.map((stripe, index) => <g key={index}>
      <polygon points={points([stripe.topLeft, stripe.topRight, stripe.bottomRight, stripe.bottomLeft])} fill={index % 2 ? '#f5e6bf' : '#c96854'}/>
      <polygon points={points([stripe.bottomLeft, stripe.bottomRight, [stripe.bottomRight[0],stripe.bottomRight[1]+11], [stripe.bottomLeft[0],stripe.bottomLeft[1]+11]])} fill={index % 2 ? '#e6d6ac' : '#ad594a'}/>
      <path d={`M${stripe.topLeft[0]+2} ${stripe.topLeft[1]+2}L${stripe.bottomLeft[0]+2} ${stripe.bottomLeft[1]-1}`} stroke="white" opacity=".11" strokeWidth="2"/>
    </g>)}
    <path d="M427 75L604 55" stroke="#f3cea0" strokeWidth="3" strokeLinecap="round"/>
    <Crate x={390} y={185} scale={0.87} leaves/><Crate x={670} y={183} scale={0.76} color="#df9c49"/>
    <g transform="translate(737 207)"><ellipse cx="0" cy="8" rx="22" ry="6" fill="#647b4a" opacity=".15"/><path d="M-14-12L14-12L10 9Q0 15-10 9Z" fill="#c88b64"/><ellipse cy="-12" rx="14" ry="5" fill="#dcaa7d"/><path d="M0-13L-2-41M0-20L11-34M-1-23L-13-34" stroke="#709458" strokeWidth="3" strokeLinecap="round"/><path d="M-11-35C-24-36-22-47-12-47C-4-46-4-38-11-35ZM10-33C6-46 18-51 22-41C25-34 16-29 10-33Z" fill="#91b16d"/><g fill="#f4dd9e"><circle cx="-2" cy="-43" r="6"/><circle cx="-8" cy="-40" r="5"/><circle cx="3" cy="-38" r="5"/></g><circle cx="-3" cy="-40" r="3" fill="#d5a55b"/></g>
    <path d="M160 233L153 219L163 226L172 215L171 232M301 224L296 214L303 218L310 209L309 224M804 234L799 223L807 227L815 218L814 235" stroke="#7d9f60" strokeWidth="3" strokeLinecap="round"/>
    <g fill="#eee1b3"><circle cx="243" cy="210" r="3"/><circle cx="247" cy="215" r="3"/><circle cx="240" cy="216" r="3"/><circle cx="902" cy="225" r="3"/><circle cx="907" cy="229" r="3"/><circle cx="900" cy="231" r="3"/></g>
    <path d="M0 253L115 237L225 255L319 241L356 260H0ZM606 260L679 244L778 256L906 242L1000 250V260Z" fill="#9eb976" opacity=".7"/>
  </svg>;
}

export default memo(FarmMarketScene);
