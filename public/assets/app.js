import {details} from './details.js';
document.addEventListener('click',event=>{if(event.target.closest('a[aria-disabled="true"]')){event.preventDefault();event.stopImmediatePropagation();}},true);
const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navegacion');
const mobile=window.matchMedia('(max-width:780px)');
const reduced=window.matchMedia('(prefers-reduced-motion:reduce)');
function closeMenu(restore=false){menuButton?.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');if(restore)menuButton?.focus();}
if(menuButton&&nav){
 menuButton.hidden=false;
 menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open);});
 nav.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
 document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();});
 document.addEventListener('keydown',event=>{if(menuButton.getAttribute('aria-expanded')!=='true')return;if(event.key==='Escape'){event.preventDefault();closeMenu(true);}if(event.key==='Tab'&&mobile.matches){const links=[...nav.querySelectorAll('a')];if(event.shiftKey&&document.activeElement===menuButton){event.preventDefault();links.at(-1)?.focus();}else if(!event.shiftKey&&document.activeElement===links.at(-1)){event.preventDefault();menuButton.focus();}}});
 mobile.addEventListener('change',()=>closeMenu());
}
const header=document.querySelector('.site-header');
const process=document.querySelector('.process-list');
const steps=process?[...process.querySelectorAll(':scope > li:not(.process-machine)')]:[];
const processMachine=process?.querySelector('.process-machine');
const storyStage=document.querySelector('.story-stage');
const readingBar=header?.appendChild(Object.assign(document.createElement('span'),{className:'reading-progress'}));
const processBar=process?.appendChild(Object.assign(document.createElement('span'),{className:'process-progress'}));
readingBar?.setAttribute('aria-hidden','true');processBar?.setAttribute('aria-hidden','true');
let geometry={total:1,processTop:0,processHeight:1,processWidth:0,machineWidth:0,storyTop:0,storyHeight:1,height:window.innerHeight};
let geometryDirty=true,scrolled=null,currentStep=-1,lastReading=-1,lastProcess=-1;
let scrollQueued=false;
const clamp=value=>Math.max(0,Math.min(1,value));
function measureGeometry(){
 const y=window.scrollY,rect=process?.getBoundingClientRect(),storyRect=storyStage?.getBoundingClientRect();
 geometry={total:Math.max(1,document.documentElement.scrollHeight-window.innerHeight),height:window.innerHeight,processTop:rect?rect.top+y:0,processHeight:rect?.height||1,processWidth:rect?.width||0,machineWidth:processMachine?.offsetWidth||0,storyTop:storyRect?storyRect.top+y:0,storyHeight:storyRect?.height||1};
 geometryDirty=false;
}
function updateHeader(){
 if(geometryDirty)measureGeometry();
 const y=window.scrollY;
 const progress=clamp(y/geometry.total);
 const nextScrolled=y>20;
 if(nextScrolled!==scrolled){header?.classList.toggle('is-scrolled',nextScrolled);scrolled=nextScrolled;}
 if(readingBar&&Math.abs(progress-lastReading)>.0003){readingBar.style.transform=`scaleX(${progress.toFixed(4)})`;lastReading=progress;}
 if(process){
  const p=clamp((geometry.height*.78-(geometry.processTop-y))/(geometry.height*.5+geometry.processHeight));
  if(Math.abs(p-lastProcess)>.001){const shown=Number(p.toFixed(3));processBar.style.transform=`scaleX(${shown})`;if(processMachine){const x=Math.max(0,Math.min(geometry.processWidth-geometry.machineWidth,shown*geometry.processWidth-geometry.machineWidth*.95));processMachine.style.transform=`translate3d(${x.toFixed(1)}px,0,0)`;}lastProcess=p;}
  const current=Math.min(steps.length-1,Math.floor(p*steps.length));
  if(current!==currentStep){steps[currentStep]?.classList.remove('is-current');steps[current]?.classList.add('is-current');currentStep=current;}
 }
 updateStory(y);
 scrollQueued=false;
}
function queueScroll(){if(!scrollQueued){scrollQueued=true;window.requestAnimationFrame(updateHeader);}}
window.addEventListener('scroll',queueScroll,{passive:true});
function resizeGeometry(){geometryDirty=true;lastProcess=-1;queueScroll();}
window.addEventListener('resize',resizeGeometry,{passive:true});
if('ResizeObserver'in window)new ResizeObserver(resizeGeometry).observe(document.body);
document.fonts.ready.then(resizeGeometry);
// Un solo coordinador por evento; nunca un bucle de scroll continuo.
let updateStory=()=>{};
queueScroll();
if('IntersectionObserver' in window){
 const links=[...document.querySelectorAll('[data-section]')];
 const sections=links.map(link=>document.getElementById(link.dataset.section)).filter(Boolean);
 const active=id=>links.forEach(link=>{if(link.dataset.section===id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
 if(sections.length)active('inicio');
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting)active(entry.target.id);}},{rootMargin:'-18% 0px -62% 0px',threshold:0});
 sections.forEach(section=>observer.observe(section));
 // Sin entradas de artículos completos: contenido estable y visible en todo momento.
}
if(storyStage){
 const svg=storyStage.querySelector('.story-drawing'),sheet=storyStage.querySelector('.story-sheet'),caption=storyStage.querySelector('.story-caption');
 const layers=Object.fromEntries(['plan','site','walls','roof','openings','finish'].map(name=>[name,svg.querySelector('.story-'+name)]));
 const traces=Object.fromEntries(['foundation-trace','columns','portals','facade'].map(name=>[name,[...svg.querySelectorAll('.story-'+name+' path[pathLength]')]]));
 const phase=(p,start,end)=>clamp((p-start)/(end-start));
 const draw=(paths,value)=>{const offset=(1-value).toFixed(3);for(const path of paths)path.style.strokeDashoffset=offset;};
 let previous=-1;
 updateStory=y=>{
  const startTop=geometry.height*.85,finishTop=Math.max(120,geometry.height*(window.innerWidth>780?.25:.14));
  const p=reduced.matches?1:clamp((startTop-(geometry.storyTop-y))/(startTop-finishTop));
  if(Math.abs(p-previous)<.002)return;previous=p;
  draw(traces['foundation-trace'],phase(p,0,.16));
  layers.site.style.opacity=phase(p,.07,.22).toFixed(3);
  draw(traces.columns,phase(p,.18,.42));
  draw(traces.portals,phase(p,.33,.57));
  layers.roof.style.opacity=phase(p,.51,.70).toFixed(3);
  layers.walls.style.opacity=phase(p,.66,.84).toFixed(3);
  draw(traces.facade,phase(p,.70,.89));
  layers.openings.style.opacity=phase(p,.81,.96).toFixed(3);
  layers.finish.style.opacity=phase(p,.87,.99).toFixed(3);
  layers.plan.style.opacity=(1-.84*phase(p,.67,.99)).toFixed(3);
  sheet.style.transform=`scaleX(${(1-phase(p,.02,.22)).toFixed(3)})`;
  const text=phase(p,.82,.98);
  caption.style.opacity=text.toFixed(3);
  caption.style.transform=`translateY(${((1-text)*7).toFixed(1)}px)`;
 };
 reduced.addEventListener('change',()=>{previous=-1;queueScroll();});
}
// La galería es manual, sin temporizadores ni desplazamiento horizontal forzado.
const gallery=document.querySelector('.project-gallery');
if(gallery){
 const selectors=[...gallery.querySelectorAll('[data-gallery-index]')],frames=[...gallery.querySelectorAll('[data-gallery-frame]')],references=[...gallery.querySelectorAll('.gallery-reference')],stage=gallery.querySelector('.gallery-stage');
 let selected=0;
 const select=index=>{
  selected=(index+selectors.length)%selectors.length;
  selectors.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===selected)));
  frames.forEach((frame,i)=>{frame.classList.toggle('is-active',i===selected);frame.setAttribute('aria-hidden',String(i!==selected));});
  references.forEach((link,i)=>{link.hidden=i!==selected;});
  stage.dataset.project=details.projects[selected].id;stage.setAttribute('aria-label','Ver referencia: '+details.projects[selected].title);
  gallery.querySelector('.gallery-position').textContent=String(selected+1).padStart(2,'0')+' / '+String(selectors.length).padStart(2,'0');
  gallery.querySelector('.gallery-status').textContent=`Obra ${selected+1} de ${selectors.length}`;
 };
 gallery.querySelector('.gallery-arrows').hidden=false;
 selectors.forEach((button,index)=>{button.addEventListener('click',()=>select(index));button.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?selectors.length-1:selected+(event.key==='ArrowRight'?1:-1);select(next);selectors[selected].focus();});});
 gallery.querySelector('.gallery-prev').addEventListener('click',()=>select(selected-1));
 gallery.querySelector('.gallery-next').addEventListener('click',()=>select(selected+1));
}
// El poster carga primero. Un solo MP4 por dispositivo, siempre desde este servidor.
const heroVideo=document.querySelector('#hero-video');
const videoToggle=document.querySelector('.hero .video-toggle');
if(heroVideo&&videoToggle){
 const hero=document.querySelector('.hero'),backdrop=heroVideo.parentElement,poster=backdrop.querySelector('img');
 const connection=navigator.connection;
 let visible=true,loaded=false,scheduled=false,intent='auto',failed=false;
 const automaticAllowed=()=>!reduced.matches&&!connection?.saveData&&!['slow-2g','2g'].includes(connection?.effectiveType);
 const syncControl=()=>{const playing=!heroVideo.paused&&!heroVideo.ended;videoToggle.setAttribute('aria-pressed',String(playing));videoToggle.setAttribute('aria-label',playing?'Pausar video de portada':'Reproducir video de portada');videoToggle.querySelector('span').textContent=playing?'Pausar':'Reproducir';};
 const play=async()=>{
  if(document.hidden||!visible)return;
  if(!loaded||failed){heroVideo.src=window.innerWidth<=780?heroVideo.dataset.mobile:heroVideo.dataset.desktop;heroVideo.load();loaded=true;failed=false;}
  try{await heroVideo.play();}catch{syncControl();}
 };
 const reconcile=()=>{
  if(document.hidden||!visible||intent==='pause'||(intent==='auto'&&!automaticAllowed())){heroVideo.pause();return;}
  if(intent==='play')play();else if(!scheduled){scheduled=true;const start=()=>{scheduled=false;if(intent==='auto'&&automaticAllowed()&&visible&&!document.hidden)play();};if('requestIdleCallback'in window)requestIdleCallback(start,{timeout:1200});else setTimeout(start,180);}
 };
 videoToggle.hidden=false;
 videoToggle.addEventListener('click',()=>{if(heroVideo.paused){intent='play';play();}else{intent='pause';heroVideo.pause();}});
 heroVideo.addEventListener('playing',()=>{backdrop.classList.add('video-ready');syncControl();});
 heroVideo.addEventListener('pause',syncControl);
 heroVideo.addEventListener('error',()=>{failed=true;backdrop.classList.remove('video-ready');syncControl();videoToggle.title='El video no pudo cargarse. Podés reintentar.';});
 document.addEventListener('visibilitychange',reconcile);
 reduced.addEventListener('change',()=>{if(reduced.matches){intent='pause';heroVideo.pause();}reconcile();});
 connection?.addEventListener?.('change',reconcile);
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;reconcile();},{threshold:0}).observe(hero);
 if(poster.complete)reconcile();else{poster.addEventListener('load',reconcile,{once:true});poster.addEventListener('error',reconcile,{once:true});}
}
// Sólo dos CTA: desplazamiento máximo de cuatro píxeles con mouse, sin alterar el scroll.
const finePointer=window.matchMedia('(hover:hover) and (pointer:fine)');
for(const button of document.querySelectorAll('.hero-actions .button-red,.contact-section .button')){
 let bounds=null,pending=null,frame=0;
 const reset=()=>{bounds=null;pending=null;cancelAnimationFrame(frame);frame=0;button.style.removeProperty('--magnet-x');button.style.removeProperty('--magnet-y');};
 button.addEventListener('pointerenter',event=>{if(finePointer.matches&&!reduced.matches&&event.pointerType==='mouse')bounds=button.getBoundingClientRect();});
 button.addEventListener('pointermove',event=>{if(!bounds||reduced.matches||!finePointer.matches||event.pointerType!=='mouse')return;pending={x:event.clientX,y:event.clientY};if(frame)return;frame=requestAnimationFrame(()=>{frame=0;if(!pending||!bounds)return;const x=Math.max(-4,Math.min(4,(pending.x-bounds.left-bounds.width/2)*.035));const y=Math.max(-3,Math.min(3,(pending.y-bounds.top-bounds.height/2)*.08));button.style.setProperty('--magnet-x',x.toFixed(2)+'px');button.style.setProperty('--magnet-y',y.toFixed(2)+'px');});},{passive:true});
 button.addEventListener('pointerleave',reset);button.addEventListener('pointerdown',reset);button.addEventListener('blur',reset);reduced.addEventListener('change',reset);finePointer.addEventListener('change',reset);
}
const dialog=document.querySelector('.detail-dialog');
let openedFrom=null;
let closing=false;
function closeDetail(){if(!dialog?.open||closing)return;closing=true;if(reduced.matches||typeof dialog.animate!=='function'){dialog.close();return;}const exit=dialog.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(10px)'}],{duration:170,easing:'ease-out'});exit.finished.catch(()=>{}).then(()=>{dialog.close();});}
function detail(topic,trigger){
 if(!dialog||typeof dialog.showModal!=='function')return;
 const service=details.services.find(item=>item.id===topic);
 const project=details.projects.find(item=>item.id===topic);
 const item=service||project;if(!item)return;
 dialog.querySelector('#detail-kind').textContent=service?'Servicio de Cimbra':'Referencia publicada';
 dialog.querySelector('#detail-title').textContent=item.title;
 dialog.querySelector('#detail-description').textContent=service?item.text:item.description;
 const list=dialog.querySelector('#detail-list');list.replaceChildren();
 for(const text of service?.items||[]){const li=document.createElement('li');li.textContent=text;list.append(li);}
 list.hidden=!service;
 const location=dialog.querySelector('#detail-location');
 location.textContent=project?`Referencia institucional · ${project.location}`:'';location.hidden=!project;
 const message=`Hola, Cimbra. Quisiera consultar por ${service?item.title.toLowerCase():'un proyecto relacionado con '+item.title}. Ubicación: ___. Trabajo que necesito: ___.`;
 dialog.querySelector('#detail-cta').href='https://wa.me/5493434598817?text='+encodeURIComponent(message);
 openedFrom=trigger;dialog.showModal();document.body.classList.add('dialog-open');dialog.querySelector('.dialog-close').focus();
}
if(dialog&&typeof dialog.showModal==='function'){
 document.querySelectorAll('[data-service],[data-project]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();detail(link.dataset.service||link.dataset.project,link);}));
 dialog.querySelector('.dialog-close').addEventListener('click',closeDetail);
 dialog.addEventListener('cancel',event=>{event.preventDefault();closeDetail();});
 dialog.addEventListener('click',event=>{if(event.target===dialog)closeDetail();});
 dialog.addEventListener('keydown',event=>{if(event.key!=='Tab')return;const controls=[...dialog.querySelectorAll('button,a[href]')].filter(element=>!element.hidden&&!element.disabled);if(event.shiftKey&&document.activeElement===controls[0]){event.preventDefault();controls.at(-1).focus();}else if(!event.shiftKey&&document.activeElement===controls.at(-1)){event.preventDefault();controls[0].focus();}});
 dialog.addEventListener('close',()=>{closing=false;document.body.classList.remove('dialog-open');openedFrom?.focus({preventScroll:true});});
}

// El video de materiales sólo se descarga al entrar en pantalla o al reproducirlo.
const materialsVideo=document.querySelector('#materials-video');
const materialsToggle=document.querySelector('.materials-video-toggle');
if(materialsVideo&&materialsToggle){
 const card=document.querySelector('#aridos-materiales'),art=materialsVideo.parentElement;
 const connection=navigator.connection;
 let visible=false,intent='auto',failed=false;
 const allowed=()=>!reduced.matches&&!connection?.saveData&&!['slow-2g','2g'].includes(connection?.effectiveType);
 const sync=()=>{const playing=!materialsVideo.paused&&!materialsVideo.ended;materialsToggle.setAttribute('aria-pressed',String(playing));materialsToggle.setAttribute('aria-label',playing?'Pausar video de áridos':'Reproducir video de áridos');materialsToggle.querySelector('span').textContent=playing?'Pausar':'Reproducir';};
 const reconcile=()=>{
  if(document.hidden||!visible||intent==='pause'||(intent==='auto'&&!allowed())){materialsVideo.pause();return;}
  if(!materialsVideo.getAttribute('src')||failed){materialsVideo.src=window.innerWidth<=780?materialsVideo.dataset.mobile:materialsVideo.dataset.desktop;materialsVideo.load();failed=false;}
  materialsVideo.play().catch(sync);
 };
 materialsToggle.hidden=false;
 materialsToggle.addEventListener('click',()=>{intent=materialsVideo.paused?'play':'pause';reconcile();});
 materialsVideo.addEventListener('playing',()=>{art.classList.add('video-ready');sync();});
 materialsVideo.addEventListener('pause',sync);
 materialsVideo.addEventListener('error',()=>{failed=true;art.classList.remove('video-ready');sync();});
 document.addEventListener('visibilitychange',reconcile);
 reduced.addEventListener('change',()=>{if(reduced.matches){intent='auto';art.classList.remove('video-ready');}reconcile();});
 connection?.addEventListener?.('change',reconcile);
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;reconcile();},{threshold:0}).observe(card);
 else{visible=true;reconcile();}
}
