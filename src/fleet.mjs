// Esquemas decorativos de categorías; no representan modelos o capacidades concretas.
const wheel=(x,y,r=4)=>`<circle cx="${x}" cy="${y}" r="${r}"/><circle cx="${x}" cy="${y}" r="1"/>`;
const drawings={
 retropala:`${wheel(22,31,6)}${wheel(47,32)}<path d="M16 26h34l3 5M26 25V11h11l5 14M29 14h6l3 9h-9zM40 23l11-1 9 9h7v-7M13 27 9 17l5-9 6 10-5 9M13 27l-5 5H3l2-5"/>`,
 retroexcavadora:`<rect x="10" y="29" width="36" height="8" rx="4"/><path d="M17 33h22M16 28V15h11l6 13M19 18h6l4 7H19zM32 24h7l5-13 7-3 13 13-4 11M61 26l7 5v5h-9l-2-3"/>`,
 cargadora:`${wheel(20,31,6)}${wheel(46,31,6)}<path d="M12 25h39M25 25V11h12l5 14M28 14h7l4 8H28zM11 25v-8h13M42 23l8-6 11 13M47 24l6-4 9 11M60 26l8 1v9H56l-3-4"/>`,
 motoniveladora:`${wheel(13,32)}${wheel(47,32)}${wheel(61,32)}<path d="M7 27h19l10-7h28v7M42 20V9h12l4 11M45 12h7l3 7H45M28 25l5 9h10M26 34h16M7 26v-6h9l3 7"/>`,
 rodillo:`${wheel(17,31,6)}<rect x="43" y="25" width="19" height="12" rx="4"/><path d="M10 25v-9h17l8 11h9M24 22V9h15v15M27 12h9v10h-9zM36 26h15v-5M47 30h10"/>`,
 minicargadora:`${wheel(22,32)}${wheel(40,32)}<path d="M13 27h36l4-4-8-14H27l-7 18M29 12h13l6 10H25zM24 16l-8 9 37 3M47 22l11 7M55 25l9 1v10H52l-4-5M15 27v-9h6"/>`,
 camiones:`${wheel(17,32)}${wheel(29,32)}${wheel(56,32)}<path d="M7 26h56l4 3M7 10h35v15H9zM44 26V13h13l9 10v7M48 16h7l6 7H48zM10 14h28M11 25v4M43 26v4"/>`
};
export const fleet=[
 {id:'retropala',name:'Retropala'},
 {id:'retroexcavadora',name:'Retroexcavadora'},
 {id:'cargadora',name:'Cargadora'},
 {id:'motoniveladora',name:'Motoniveladora'},
 {id:'rodillo',name:'Rodillo Compactador'},
 {id:'minicargadora',name:'Minicargadora con accesorios'},
 {id:'camiones',name:'Camiones Volcadores'}
];
export function fleetIcon(id){return `<svg class="fleet-icon" viewBox="0 0 72 42" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${drawings[id]}</svg>`;}
