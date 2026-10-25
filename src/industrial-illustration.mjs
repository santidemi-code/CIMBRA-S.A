// Axonometría conceptual de una nave industrial. Todas las coordenadas comparten
// una retícula: profundidad (+175,-120), fachada (+200,+90), vertical (0,-95).
export const industrialIllustration=`<svg class="story-drawing" viewBox="0 0 600 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustración conceptual de una nave industrial que se construye por etapas">
<g class="story-plan" fill="none" stroke="#c5b8a5" stroke-width=".9">
 <path d="M50 112h500M50 220h500M50 328h500M105 42v340M215 42v340M325 42v340M435 42v340" opacity=".42"/>
 <path d="M88 280 315 382 508 250 281 148Z M102 279 315 374 497 249 284 154Z" stroke-dasharray="3 6"/>
 <path d="M72 281h34m-17-17v34m216 83h34m-17-17v34m158-152h34m-17-17v34M274 155h34m-17-17v34"/>
 <path d="M110 401h373m-373-4v8m373-8v8M67 181v188m-5-188h10m-10 188h10" opacity=".8"/>
</g>
<g class="story-site">
 <path d="M129 293 315 382 497 260 483 253 315 369 115 279Z" fill="#252729" opacity=".11"/>
 <path d="M115 279 315 369 490 249 290 159Z" fill="#d7d9d6" stroke="#737775" stroke-width="1.2" stroke-linejoin="round"/>
 <path d="M115 279 315 369v12l-200-90ZM315 369 490 249v12L315 381Z" fill="#b9bdb9" stroke="#737775" stroke-width="1"/>
 <path d="M115 279 315 369 490 249 290 159Z" fill="none" stroke="#f7f6f2" stroke-width="2" opacity=".7"/>
</g>
<g class="story-foundation-trace story-trace" fill="none" stroke="#474b4b" stroke-width="1.45" stroke-linejoin="round">
 <path pathLength="1" d="M115 279 315 369 490 249 290 159 115 279ZM115 279v12l200 90 175-120v-12M315 369v12"/>
</g>
<g class="story-walls">
 <path d="M115 184 215 158 315 274v95l-200-90Z" fill="#e9eae6" stroke="#8a8e8a" stroke-width="1" stroke-linejoin="round"/>
 <path d="M315 274 490 154v95L315 369Z" fill="#d1d5d2" stroke="#858a87" stroke-width="1" stroke-linejoin="round"/>
 <path d="M120 193 215 169 310 279" fill="none" stroke="#ffffff" stroke-width="1" opacity=".5"/>
 <path d="M315 308 490 188M315 338 490 218" fill="none" stroke="#aeb4b0" stroke-width=".8"/>
</g>
<g class="story-columns story-trace" fill="none" stroke="#525a59" stroke-width="5" stroke-linecap="square">
 <path pathLength="1" d="M115 279V184M165 302v-95M265 347v-95M315 369v-95M359 339v-95M403 309v-95M447 279v-95M490 249v-95M290 159V64"/>
</g>
<g class="story-portals story-trace" fill="none" stroke="#434a49" stroke-width="2.8" stroke-linejoin="round">
 <path pathLength="1" d="M115 184 215 158 315 274 490 154 390 38 290 64 115 184M165 207 265 252M359 244 259 128 159 154M403 214 303 98 203 124M447 184 347 68 247 94M115 184 290 64M215 158 390 38"/>
</g>
<g class="story-roof">
 <path d="M115 184 215 158 390 38 290 64Z" fill="#dce0dc" stroke="#5f6663" stroke-width="1.35" stroke-linejoin="round"/>
 <path d="M215 158 315 274 490 154 390 38Z" fill="#bdc4c1" stroke="#555c5a" stroke-width="1.4" stroke-linejoin="round"/>
 <path d="M115 184 290 64M215 158 390 38M315 274 490 154" stroke="#f7f6f2" stroke-width="1.1" opacity=".8"/>
 <path d="M165 171 340 51M240 187 415 67M265 216 440 96M290 245 465 125" stroke="#818b88" stroke-width="1" opacity=".65"/>
 <path d="M158 154 258 128 358 244M202 124 302 98 402 214M246 94 346 68 446 184" fill="none" stroke="#6a7470" stroke-width=".9" opacity=".6"/>
 <path d="M215 158 390 38" stroke="#424b49" stroke-width="2"/>
</g>
<g class="story-facade story-trace" fill="none" stroke="#535b58" stroke-width="1.2" stroke-linejoin="round">
 <path pathLength="1" d="M115 184 215 158 315 274v95l-200-90v-95ZM315 274 490 154v95L315 369V274ZM165 207v95M265 252v95M359 244v95M403 214v95M447 184v95"/>
</g>
<g class="story-openings">
 <path d="M163 220 267 267v80l-104-47Z" fill="#596462" stroke="#353d3b" stroke-width="1.5" stroke-linejoin="round"/>
 <path d="M163 232 267 279M163 244 267 291M163 256 267 303M163 268 267 315M163 280 267 327M163 292 267 339" stroke="#a3ada9" stroke-width=".9" opacity=".68"/>
 <path d="M325 280 480 174v28L325 308Z" fill="#a9b7b8" stroke="#5d6a69" stroke-width="1.1" stroke-linejoin="round"/>
 <path d="M364 253v28M403 227v28M442 200v28" stroke="#e7eeec" stroke-width="2"/>
 <path d="M325 308 480 202" stroke="#4d5755" stroke-width="1.2"/>
 <path d="M163 220 163 300" stroke="#c92026" stroke-width="2.4"/>
</g>
<g class="story-finish">
 <path d="M115 279 315 369 490 249" fill="none" stroke="#555d59" stroke-width="1.3" stroke-linejoin="round"/>
 <path d="M315 274 490 154M115 184 215 158" fill="none" stroke="#252729" stroke-width="1.35"/>
 <path d="M145 314 315 391 506 260" fill="none" stroke="#a6aaa5" stroke-width=".8" opacity=".7"/>
 <path d="M481 259h18m-9-9v18" stroke="#c92026" stroke-width="1.4"/>
 <circle cx="490" cy="259" r="2.1" fill="#c92026"/>
</g>
</svg>`;
