/* محمد خليفة & سارة عيد — حفلة خطوبة */
const CONFIG = {
  // عدّلي هذا النص فقط لو حبيتي تغيّري المكان لاحقًا.
  locationQuery: 'نادي الزهراء الرياضي القاهرة مصر',
  // لو عندك رابط Google Form / RSVP حقيقي، ضعيه هنا. اتركيه فارغًا ليظهر الاختيار الداخلي.
  rsvpUrl: '',
  photosUrl: ''
};

const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const openBtn = document.getElementById('openInvitation');
const transition = document.getElementById('transition');
const canvas = document.getElementById('matrixCanvas');
const music = document.getElementById('bgMusic');
const clickSound = document.getElementById('clickSound');
const toast = document.getElementById('toast');
const modal = document.getElementById('rsvpModal');

let musicStarted = false;
let transitioning = false;
let animationId;
let columns = [];

function playClick(){
  try { clickSound.currentTime = 0; clickSound.play().catch(()=>{}); } catch(e){}
}
function startMusic(){
  if(musicStarted) return;
  musicStarted = true;
  music.volume = 0.65;
  music.play().catch(()=>{ musicStarted=false; });
}
function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.t);
  showToast.t = setTimeout(()=>toast.classList.remove('show'),2600);
}

function setupMatrix(){
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth, h = window.innerHeight;
  canvas.width = w*dpr; canvas.height = h*dpr;
  canvas.style.width = w+'px'; canvas.style.height = h+'px';
  const ctx = canvas.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0);
  const count = Math.ceil(w/22);
  columns = Array.from({length:count},(_,i)=>({x:i*22+Math.random()*8,y:-Math.random()*h,len:10+Math.floor(Math.random()*18),speed:4+Math.random()*8,red:Math.random()<.16}));
  return ctx;
}
function drawMatrix(ctx){
  const w=window.innerWidth,h=window.innerHeight;
  ctx.clearRect(0,0,w,h);
  ctx.font='13px Arial';
  columns.forEach(c=>{
    c.y += c.speed;
    if(c.y-c.len*18>h) c.y=-Math.random()*300;
    for(let i=0;i<c.len;i++){
      const y=c.y-i*18;
      const a=Math.max(0,1-i/c.len);
      ctx.fillStyle=c.red?`rgba(255,55,70,${a*.72})`:`rgba(225,228,230,${a*.82})`;
      const symbols = c.red ? '01' : '│╱╲·•';
      const s=symbols[Math.floor(Math.random()*symbols.length)];
      ctx.fillText(s,c.x,y);
    }
  });
  animationId=requestAnimationFrame(()=>drawMatrix(ctx));
}
function startTransition(){
  if(transitioning) return;
  transitioning=true;
  playClick(); startMusic();
  transition.classList.add('show');
  const ctx=setupMatrix();
  cancelAnimationFrame(animationId); drawMatrix(ctx);
  setTimeout(()=>{
    page1.classList.remove('active');
    page2.classList.add('active');
    page2.setAttribute('aria-hidden','false');
    page1.setAttribute('aria-hidden','true');
  },720);
  setTimeout(()=>{
    transition.classList.remove('show');
    cancelAnimationFrame(animationId);
    transitioning=false;
  },1450);
}
openBtn.addEventListener('click',startTransition);

window.addEventListener('resize',()=>{ if(transition.classList.contains('show')) { const ctx=setupMatrix(); cancelAnimationFrame(animationId); drawMatrix(ctx); }});

document.querySelectorAll('.action').forEach(btn=>btn.addEventListener('click',()=>{
  playClick(); startMusic();
  const action=btn.dataset.action;
  if(action==='location'){
    const url='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(CONFIG.locationQuery);
    window.open(url,'_blank','noopener');
  }
  if(action==='share'){
    const data={title:'محمد خليفة & سارة عيد',text:'دعوتكم لحضور حفلة خطوبتنا يوم الإثنين ٢٢ يونيو ٢٠٢٦ الساعة ٦ مساءً ❤️',url:location.href};
    if(navigator.share) navigator.share(data).catch(()=>{});
    else {navigator.clipboard?.writeText(location.href).then(()=>showToast('تم نسخ رابط الدعوة ❤️')).catch(()=>showToast('انسخي رابط الدعوة من شريط المتصفح'))}
  }
  if(action==='photos'){
    if(CONFIG.photosUrl) window.open(CONFIG.photosUrl,'_blank','noopener');
    else showToast('صور الحفلة هتكون متاحة قريبًا ❤️');
  }
  if(action==='rsvp'){
    if(CONFIG.rsvpUrl) window.open(CONFIG.rsvpUrl,'_blank','noopener');
    else modal.classList.add('open');
  }
}));

document.getElementById('closeModal').addEventListener('click',()=>modal.classList.remove('open'));
modal.addEventListener('click',e=>{if(e.target===modal) modal.classList.remove('open')});
document.querySelectorAll('[data-rsvp]').forEach(btn=>btn.addEventListener('click',()=>{
  const answer=btn.dataset.rsvp==='yes'?'سأحضر ❤️':'أعتذر عن الحضور';
  navigator.clipboard?.writeText(`محمد خليفة & سارة عيد — ${answer}`).catch(()=>{});
  modal.classList.remove('open');
  showToast('تم اختيار الرد: '+answer);
}));

document.getElementById('musicToggle').addEventListener('click',()=>{
  if(music.paused){music.play().catch(()=>{});showToast('تم تشغيل الموسيقى 🎵')}else{music.pause();showToast('تم إيقاف الموسيقى')}
});
