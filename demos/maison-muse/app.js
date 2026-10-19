'use strict';
const $ = (id) => document.getElementById(id);
const config = window.STUDIO;
const defaults = {name:config.name,palette:config.palette,categories:config.categories.filter(c=>c.enabled).map(c=>c.id)};
const getStored = (key) => {try{return JSON.parse(localStorage.getItem(key));}catch{return null;}};
const putStored = (key,value) => {try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}};
let prefs = getStored('muse-studio');
if(!prefs || typeof prefs.name!=='string' || !Array.isArray(prefs.categories) || !prefs.categories.some(id=>defaults.categories.includes(id))) prefs={...defaults};
prefs.categories=prefs.categories.filter(id=>defaults.categories.includes(id));
let selected = new Set(), activeCategory=prefs.categories[0], selectedDate=null, selectedTime=null;
let viewMonth=new Date();viewMonth.setDate(1);viewMonth.setHours(0,0,0,0);
let savedVisit=null, toastTimer, draftPalette=prefs.palette;
const money=(n)=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(n);
const duration=(n)=>n<60?`${n} min`:`${Math.floor(n/60)} hr${n%60?` ${n%60} min`:''}`;
const services=()=>config.services.filter(s=>selected.has(s.id));
const totals=()=>services().reduce((a,s)=>({price:a.price+s.price,minutes:a.minutes+s.duration}),{price:0,minutes:0});
const dateKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const fromKey=s=>new Date(`${s}T12:00:00`);
const fullDate=s=>fromKey(s).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
const text=(tag,content,cls)=>{const e=document.createElement(tag);e.textContent=content;if(cls)e.className=cls;return e;};
function toast(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),3200);}
function applyBrand(){
 document.querySelectorAll('.brand-name').forEach(e=>e.textContent=prefs.name);
 document.title=`${prefs.name} — Beauty & Wellbeing`;
 document.querySelector('.header .wordmark').setAttribute('aria-label',`${prefs.name} home`);
 document.body.dataset.palette=['plum','rose','olive'].includes(prefs.palette)?prefs.palette:'plum';
}
function renderCategories(){
 const enabled=config.categories.filter(c=>prefs.categories.includes(c.id));
 $('ribbon').replaceChildren();$('treatment-links').replaceChildren();$('service-tabs').replaceChildren();
 enabled.forEach((cat,i)=>{
  if(i)$('ribbon').append(text('span','✧'));
  const a=text('a',cat.name);a.href='#prices';a.dataset.categoryLink=cat.id;$('ribbon').append(a);
  const link=document.createElement('a');link.href='#prices';link.dataset.categoryLink=cat.id;
  link.append(text('span',String(i+1).padStart(2,'0'),'number'));const group=document.createElement('div');group.append(text('h3',cat.name),text('p',cat.description));link.append(group,text('span','↗','arrow'));$('treatment-links').append(link);
  const tab=text('button',cat.name);tab.id=`tab-${cat.id}`;tab.type='button';tab.role='tab';tab.dataset.category=cat.id;tab.setAttribute('aria-controls','service-list');tab.addEventListener('click',()=>setCategory(cat.id));$('service-tabs').append(tab);
 });
 const nailEnabled=prefs.categories.includes('nails');const card=document.querySelector('.nail-card');card.dataset.categoryLink=nailEnabled?'nails':prefs.categories[0];card.querySelector('img').src=nailEnabled?'assets/manicure-editorial.png':'assets/beauty-editorial.png';card.querySelector('img').alt=nailEnabled?'Glossy blush manicure on soft linen':'A soft, natural beauty editorial';card.querySelector('small').textContent=nailEnabled?'THE FINISHING TOUCH':'A LITTLE TIME FOR YOU';card.querySelector('h3').textContent=nailEnabled?'Perfectly polished.':'Entirely your own.';
 setCategory(prefs.categories.includes(activeCategory)?activeCategory:prefs.categories[0]);
}
function setCategory(id){
 activeCategory=id;
 document.querySelectorAll('[data-category]').forEach(t=>{const active=t.dataset.category===id;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;});
 $('service-list').setAttribute('aria-labelledby',`tab-${id}`);renderServices();
}
function renderServices(){
 $('service-list').replaceChildren();
 config.services.filter(s=>s.category===activeCategory).forEach(s=>{
  const row=document.createElement('article');row.className='service-row';const copy=document.createElement('div');if(s.tag)copy.append(text('span',s.tag,'service-tag'));copy.append(text('h3',s.name),text('p',s.description),text('span',duration(s.duration),'duration'));
  const actions=document.createElement('div');actions.className='service-actions';actions.append(text('strong',money(s.price)));const btn=text('button',selected.has(s.id)?'✓':'+','add-service');btn.type='button';btn.setAttribute('aria-pressed',String(selected.has(s.id)));btn.setAttribute('aria-label',`${selected.has(s.id)?'Remove':'Add'} ${s.name}`);btn.dataset.service=s.id;btn.addEventListener('click',()=>toggleService(s.id));actions.append(btn);row.append(copy,actions);$('service-list').append(row);
 });
}
function toggleService(id){
 const s=config.services.find(s=>s.id===id);if(!s)return;
 if(selected.has(id)){selected.delete(id);for(const item of services())if(item.requires&&!item.requires.some(r=>selected.has(r)))selected.delete(item.id);}
 else{if(s.requires&&!s.requires.some(r=>selected.has(r))){toast('Add a gel or builder gel manicure before choosing nail art.');return;}selected.add(id);toast(`${s.name} added to your visit`);}
 selectedTime=null;resetStage();renderServices();renderVisit();renderTimes();
 const btn=document.querySelector(`[data-service="${id}"]`);if(btn)btn.focus({preventScroll:true});
}
function renderVisit(){
 const list=$('selected-list');list.replaceChildren();
 if(!selected.size){const p=text('p','A little something for you. Add a treatment to begin.','muted');list.append(p);}
 services().forEach(s=>{const row=document.createElement('div');row.className='selected-item';const copy=text('div',s.name);copy.append(text('small',duration(s.duration)));const remove=text('button','×');remove.type='button';remove.setAttribute('aria-label',`Remove ${s.name}`);remove.addEventListener('click',()=>toggleService(s.id));row.append(copy,text('span',money(s.price)),remove);list.append(row);});
 const t=totals();$('total-price').textContent=money(t.price);$('total-duration').textContent=duration(t.minutes);$('mobile-basket').hidden=!selected.size;$('mobile-count').textContent=`${selected.size} treatment${selected.size===1?'':'s'}`;$('mobile-total').textContent=money(t.price);
 $('booking-summary').textContent=selected.size?`${services().map(s=>s.name).join(' + ')}. ${duration(t.minutes)} of you-time · ${money(t.price)}.`:'Start by choosing your treatments from the menu.';
}
function availableTimes(key,minutes){
 if(!key||!minutes)return [];
 const d=fromKey(key),day=d.getDay();if(day===0||day===1)return [];
 const end=day===6?16*60:19*60,now=new Date(),result=[];
 for(let start=10*60;start+minutes<=end;start+=30){
  // Illustrative opening hours and a lunch break. No real availability is implied.
  if(start<14*60&&start+minutes>13*60)continue;
  const hour=Math.floor(start/60),minute=start%60;const actual=new Date(d.getFullYear(),d.getMonth(),d.getDate(),hour,minute);
  if(actual<=now)continue;
  result.push(`${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`);
 }
 return result;
}
function renderCalendar(){
 const current=new Date();current.setHours(0,0,0,0);
 $('month-label').textContent=viewMonth.toLocaleDateString('en-GB',{month:'long',year:'numeric'});
 $('prev-month').disabled=viewMonth.getFullYear()===current.getFullYear()&&viewMonth.getMonth()===current.getMonth();
 const maxMonth=new Date(current.getFullYear(),current.getMonth()+6,1);$('next-month').disabled=viewMonth>=maxMonth;
 $('calendar-grid').replaceChildren();const year=viewMonth.getFullYear(),month=viewMonth.getMonth(),offset=(new Date(year,month,1).getDay()+6)%7;
 for(let i=0;i<offset;i++)$('calendar-grid').append(document.createElement('span'));
 for(let n=1;n<=new Date(year,month+1,0).getDate();n++){
  const d=new Date(year,month,n),key=dateKey(d),closed=d.getDay()===0||d.getDay()===1;
  const b=text('button',String(n));b.type='button';b.disabled=d<current||closed;b.setAttribute('aria-label',`${fullDate(key)}${closed?', studio closed':''}`);b.setAttribute('aria-pressed',String(selectedDate===key));
  if(key===dateKey(current))b.classList.add('today');if(key===selectedDate)b.classList.add('selected');
  b.addEventListener('click',()=>{selectedDate=key;selectedTime=null;renderCalendar();renderTimes();const el=[...$('calendar-grid').querySelectorAll('button')].find(x=>x.textContent===String(n));el?.focus({preventScroll:true});});$('calendar-grid').append(b);
 }
}
function renderTimes(){
 const box=$('time-slots');box.replaceChildren();const t=totals();
 $('selected-date-label').textContent=selectedDate?fromKey(selectedDate).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'}):'Choose a day above';
 const times=availableTimes(selectedDate,t.minutes);if(!times.includes(selectedTime))selectedTime=null;
 times.forEach(time=>{const b=text('button',time);b.type='button';b.className=time===selectedTime?'selected':'';b.setAttribute('aria-pressed',String(time===selectedTime));b.setAttribute('aria-label',`Example appointment at ${time}`);b.addEventListener('click',()=>{selectedTime=time;renderTimes();[...box.children].find(x=>x.textContent===time)?.focus({preventScroll:true});});box.append(b);});
 $('booking-hint').textContent=!selected.size?'Choose at least one treatment from the menu to see times.':!selectedDate?'Select a day to explore example appointment times.':!times.length?'Your full visit won’t fit on this day. Choose another date or remove a treatment.':`${duration(t.minutes)} total · ${money(t.price)} · Example times, shown in your local time zone.`;
 $('continue-booking').disabled=!(selected.size&&selectedDate&&selectedTime);
}
function setStage(stage){
 $('calendar-stage').hidden=stage!=='date';$('details-stage').hidden=stage!=='details';$('success-stage').hidden=stage!=='done';
 ['date','details','done'].forEach(id=>{const step=$(`step-${id}`);step.classList.toggle('active',id===stage);if(id===stage)step.setAttribute('aria-current','step');else step.removeAttribute('aria-current');});
}
function resetStage(){setStage('date');}
function review(){
 if(!availableTimes(selectedDate,totals().minutes).includes(selectedTime)){selectedTime=null;renderTimes();toast('Please select an available example time.');return;}
 $('review-summary').replaceChildren(text('strong',`${fullDate(selectedDate)} at ${selectedTime}`),text('p',services().map(s=>s.name).join(' + ')),text('p',`${duration(totals().minutes)} · ${money(totals().price)}`));setStage('details');$('first-name').focus({preventScroll:true});
}
function showSettings(){
 $('studio-name').value=prefs.name;draftPalette=prefs.palette;$('category-settings').replaceChildren();
 config.categories.forEach(c=>{const label=document.createElement('label');label.className='checkbox';const input=document.createElement('input');input.type='checkbox';input.value=c.id;input.checked=prefs.categories.includes(c.id);label.append(input,text('span',c.name));$('category-settings').append(label);});
 renderPalettes();$('settings-dialog').showModal();
}
function renderPalettes(){document.querySelectorAll('[data-palette]').forEach(b=>{if(b.tagName==='BUTTON')b.setAttribute('aria-pressed',String(b.dataset.palette===draftPalette));});}
function saveSettings(value){
 prefs=value;const persisted=putStored('muse-studio',prefs);for(const s of services())if(!prefs.categories.includes(s.category))selected.delete(s.id);
 applyBrand();renderCategories();renderVisit();resetStage();selectedTime=null;renderTimes();$('settings-dialog').close();toast(persisted?'Your studio style has been updated.':'Studio updated for this session. Browser storage is unavailable.');
}
function calendarFile(visit){
 const [h,m]=visit.time.split(':').map(Number),start=fromKey(visit.date);start.setHours(h,m,0,0);const end=new Date(start.getTime()+visit.minutes*60000);
 const stamp=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 const escape=s=>s.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
 return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Maison Muse//Demo Visit//EN','BEGIN:VEVENT',`UID:${visit.uid}@maison-muse-demo`,`DTSTAMP:${stamp(new Date())}`,`DTSTART:${stamp(start)}`,`DTEND:${stamp(end)}`,`SUMMARY:${escape(`DEMO — ${prefs.name} visit`)}`,`DESCRIPTION:${escape(`Demonstration only. No salon appointment has been booked. ${visit.names.join(' + ')}. Example total ${money(visit.price)}.`)}`,'STATUS:TENTATIVE','END:VEVENT','END:VCALENDAR'].join('\r\n');
}
document.addEventListener('click',e=>{const link=e.target.closest('[data-category-link]');if(link)setCategory(link.dataset.categoryLink);});
$('service-tabs').addEventListener('keydown',e=>{
 if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=[...$('service-tabs').children];let i=tabs.findIndex(t=>t.dataset.category===activeCategory);i=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;setCategory(tabs[i].dataset.category);tabs[i].focus();
});
$('prev-month').addEventListener('click',()=>{viewMonth.setMonth(viewMonth.getMonth()-1);renderCalendar();});
$('next-month').addEventListener('click',()=>{viewMonth.setMonth(viewMonth.getMonth()+1);renderCalendar();});
$('continue-booking').addEventListener('click',review);
$('back-date').addEventListener('click',()=>{setStage('date');$('continue-booking').focus();});
$('choose-date').addEventListener('click',e=>{if(!selected.size){e.preventDefault();toast('Choose a treatment to start your visit.');$('service-tabs').scrollIntoView({block:'center'});}});
$('details-stage').addEventListener('submit',e=>{
 e.preventDefault();if(!$('details-stage').reportValidity())return;
 const name=$('first-name').value.trim();if(!name){$('first-name').setCustomValidity('Please enter a first name.');$('first-name').reportValidity();return;}
 if(!availableTimes(selectedDate,totals().minutes).includes(selectedTime)){resetStage();renderTimes();toast('Please choose a new example time.');return;}
 const t=totals();savedVisit={date:selectedDate,time:selectedTime,serviceIds:[...selected],names:services().map(s=>s.name),minutes:t.minutes,price:t.price,uid:crypto.randomUUID()};
 const stored=putStored('muse-demo-visit',savedVisit);$('success-name').textContent=`, ${name}`;$('view-saved').hidden=!stored;$('success-summary').textContent=`${fullDate(savedVisit.date)} at ${savedVisit.time} · ${duration(t.minutes)} · ${money(t.price)}`;
 $('success-stage').querySelector('.demo-note').textContent=stored?'Your demo visit is saved on this device. No salon has been contacted and no payment has been taken.':'Your demo visit is ready for this session. Browser storage is unavailable. No salon has been contacted and no payment has been taken.';
 $('details-stage').reset();setStage('done');$('download-calendar').focus({preventScroll:true});
});
$('first-name').addEventListener('input',()=>$('first-name').setCustomValidity(''));
$('download-calendar').addEventListener('click',()=>{if(!savedVisit)return;const url=URL.createObjectURL(new Blob([calendarFile(savedVisit)],{type:'text/calendar;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='maison-muse-demo-visit.ics';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('start-again').addEventListener('click',()=>{selected.clear();selectedDate=null;selectedTime=null;resetStage();renderServices();renderVisit();renderCalendar();renderTimes();$('prices').scrollIntoView();});
document.querySelector('.menu-toggle').addEventListener('click',()=>{const open=$('mobile-nav').hidden;$('mobile-nav').hidden=!open;const button=document.querySelector('.menu-toggle');button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Close menu':'Open menu');});
$('mobile-nav').addEventListener('click',e=>{if(e.target.closest('a')){$('mobile-nav').hidden=true;document.querySelector('.menu-toggle').setAttribute('aria-expanded','false');document.querySelector('.menu-toggle').setAttribute('aria-label','Open menu');}});
$('studio-settings').addEventListener('click',showSettings);
document.querySelectorAll('button[data-palette]').forEach(b=>b.addEventListener('click',()=>{draftPalette=b.dataset.palette;renderPalettes();}));
$('save-settings').addEventListener('click',()=>{const name=$('studio-name').value.trim(),categories=[...$('category-settings').querySelectorAll('input:checked')].map(i=>i.value);if(!name){$('studio-name').focus();toast('Give your studio a name.');return;}if(!categories.length){toast('Choose at least one service category.');return;}saveSettings({name,palette:draftPalette,categories});});
$('reset-settings').addEventListener('click',()=>saveSettings({...defaults,categories:[...defaults.categories]}));
$('clear-data').addEventListener('click',()=>{try{localStorage.removeItem('muse-demo-visit');savedVisit=null;$('view-saved').hidden=true;resetStage();toast('Saved demo visit cleared.');}catch{toast('Browser storage is unavailable.');}});
$('year').textContent=new Date().getFullYear();applyBrand();renderCategories();renderVisit();renderCalendar();renderTimes();setStage('date');

const previousVisit=getStored('muse-demo-visit');
if(previousVisit && /^\d{4}-\d{2}-\d{2}$/.test(previousVisit.date) && /^\d{2}:\d{2}$/.test(previousVisit.time) && Number.isFinite(previousVisit.price) && Number.isFinite(previousVisit.minutes) && Array.isArray(previousVisit.names)){savedVisit=previousVisit;$('view-saved').hidden=false;}
$('view-saved').addEventListener('click',()=>{if(!savedVisit)return;$('success-name').textContent='';$('success-summary').textContent=`${fullDate(savedVisit.date)} at ${savedVisit.time} · ${duration(savedVisit.minutes)} · ${money(savedVisit.price)}`;setStage('done');$('booking').scrollIntoView();});
