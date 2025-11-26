    (function(){
      const correctDate = '26/10/2025';
      const loginView = document.getElementById('loginView');
      const mainView  = document.getElementById('mainView');
      const pwInput   = document.getElementById('pwInput');
      const enterBtn  = document.getElementById('enterBtn');
      const logoutBtn = document.getElementById('logout');
      const bannerBg  = document.getElementById('parallaxBg');
      const photos    = document.querySelectorAll('.photo');

      function sanitize(v){
        return v.replace(/[^\d\/]/g,'').trim();
      }

      function validFormat(v){
        return /^\d{2}\/\d{2}\/\d{4}$/.test(v);
      }

      function plausibleDate(v){
        if(!validFormat(v)) return false;
        const [dd,mm,yyyy] = v.split('/').map(Number);
        if(mm < 1 || mm > 12) return false;
        if(dd < 1 || dd > 31) return false;
        const mdays = [31, ( (yyyy%4 === 0 && yyyy%100 !== 0) || yyyy%400 === 0) ? 29 : 28,31,30,31,30,31,31,30,31,30,31];
        if(dd > mdays[mm-1]) return false;
        return true;
      }

      function unlock(){
        loginView.style.display='none';
        mainView.style.display='block';
        mainView.setAttribute('aria-hidden','false');
        requestAnimationFrame(()=> {
          document.querySelectorAll('.fade').forEach(el => el.classList.add('in'));
        });
        sessionStorage.setItem('monthUnlocked','true');
      }

      function lock(){
        loginView.style.display='flex';
        mainView.style.display='none';
        mainView.setAttribute('aria-hidden','true');
        document.querySelectorAll('.fade').forEach(el => el.classList.remove('in'));
        sessionStorage.removeItem('monthUnlocked');
      }

      if(sessionStorage.getItem('monthUnlocked') === 'true'){
        unlock();
      }

      enterBtn.addEventListener('click', tryEnter);
      pwInput.addEventListener('keydown', function(e){
        if(e.key === 'Enter') tryEnter();
      });

      function tryEnter(){
        let v = sanitize(pwInput.value);
        if(v.length === 8 && !v.includes('/')) {
          v = v.slice(0,2) + '/' + v.slice(2,4) + '/' + v.slice(4);
          pwInput.value = v;
        }
        if(!validFormat(v) || !plausibleDate(v)){
          pwInput.classList.add('invalid');
          setTimeout(()=> pwInput.classList.remove('invalid'), 500);
          pwInput.setAttribute('aria-invalid','true');
          return;
        }
        if(v === correctDate){
          celebrate();
          setTimeout(unlock, 520);
        } else {
          pwInput.classList.add('invalid');
          pwInput.setAttribute('aria-invalid','true');
          setTimeout(()=> pwInput.classList.remove('invalid'), 600);
        }
      }

      logoutBtn && logoutBtn.addEventListener('click', ()=>{
        lock();
        pwInput.value = '';
      });

      function celebrate(){
        for(let i=0;i<8;i++){
          const el = document.createElement('div');
          el.textContent = '💜';
          el.style.position='fixed';
          el.style.left = (50 + (Math.random()-0.5)*30) + '%';
          el.style.top  = (40 + (Math.random()-0.5)*20) + '%';
          el.style.fontSize = (12 + Math.random()*26) + 'px';
          el.style.zIndex = 9999;
          el.style.pointerEvents = 'none';
          el.style.opacity = '0';
          el.style.transition = 'transform 800ms ease, opacity 800ms ease';
          document.body.appendChild(el);
          requestAnimationFrame(()=> {
            el.style.opacity = '1';
            el.style.transform = 'translateY(-160px) rotate(' + (Math.random()*80 - 40) + 'deg)';
          });
          setTimeout(()=> el.style.opacity='0', 600 + Math.random()*200);
          setTimeout(()=> el.remove(), 1400);
        }
      }

      document.addEventListener('scroll', function(){
        const y = window.scrollY || document.documentElement.scrollTop;
        bannerBg.style.transform = 'translateY('+ (y * -0.08) +'px)';
      }, {passive:true});

      photos.forEach((p)=>{
        p.addEventListener('click', showPhoto);
        p.addEventListener('keypress', (e)=> { if(e.key === 'Enter') showPhoto.call(p) });
      });

function showPhoto(e){
  // 'this' é a <img class="photo"> clicada
  const src = this.src || this.getAttribute('data-src');
  const alt = this.alt || this.dataset.label || '';

  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(0,0,0,0.85)';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.gap = '14px';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = 99999;
  overlay.style.padding = '20px';

  overlay.innerHTML = `
    <div style="max-width:92vw; width:calc(100% - 40px); text-align:center;">
      <div style="font-family:Playfair Display, serif; font-size:18px; color:var(--purple); margin-bottom:8px;">${alt}</div>
      <img src="${src}" alt="${alt}" style="max-width:90vw; max-height:75vh; border-radius:12px; object-fit:contain; box-shadow: 0 12px 40px rgba(0,0,0,0.6);" />
      <div style="margin-top:12px; display:flex; gap:8px; justify-content:center;">
        <button id="closeOverlay" style="padding:10px 14px;border-radius:10px;border:none;background:var(--purple);color:#fff;font-weight:600">Fechar</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.querySelector('#closeOverlay').addEventListener('click', ()=> overlay.remove());
  overlay.addEventListener('click', (ev)=> { if(ev.target === overlay) overlay.remove(); });
}

      const io = new IntersectionObserver((entries)=>{
        entries.forEach(ent=>{
          if(ent.isIntersecting) ent.target.classList.add('in');
        });
      }, {threshold:0.12});
      document.querySelectorAll('.fade').forEach(el => io.observe(el));

      pwInput.addEventListener('input', () => {
        pwInput.value = sanitize(pwInput.value);
        pwInput.removeAttribute('aria-invalid');
      });

      if(('ontouchstart' in window) || navigator.maxTouchPoints > 0){
        document.documentElement.classList.add('touch');
      }

      pwInput.focus();

    })();

    function chuvaDeCoracoes() {
    const container = document.getElementById("heart-container");

    for (let i = 0; i < 20; i++) {
        const heart = document.createElement("div");
        heart.classList.add("falling-heart");
        heart.innerHTML = "💜";

        heart.style.left = Math.random() * 100 + "vw";

        heart.style.fontSize = (20 + Math.random() * 30) + "px";

        container.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 3000);
    }
}

const fotos = document.querySelectorAll('.photo');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

fotos.forEach(foto => {
    foto.addEventListener('click', () => {
        lightboxImg.src = foto.src;
        lightbox.classList.add('active');
    });
});

lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
});