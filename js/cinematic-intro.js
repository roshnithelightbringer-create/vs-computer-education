// ========================================================
// Cinematic Portal Intro - Laptop Breakout Animation
// VS Computer Education
// ========================================================

(function() {
  'use strict';

  if (sessionStorage.getItem('vs_intro_played')) return;
  sessionStorage.setItem('vs_intro_played', '1');

  const style = document.createElement('style');
  style.textContent = `
    #cinematic-overlay {
      position: fixed; top:0; left:0; width:100%; height:100%;
      z-index: 99999; background: #0a0a0f;
      display:flex; align-items:center; justify-content:center;
      overflow: hidden; pointer-events: none;
      transition: opacity 0.8s ease;
    }
    #cinematic-overlay.fade-out { opacity:0; }
    #cinematic-laptop {
      position:relative; width:520px; height:360px; perspective:1200px;
      animation: lapFloat 3s ease-in-out infinite;
    }
    @keyframes lapFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
    #cinematic-lid {
      position:absolute; top:0; left:20px; width:480px; height:300px;
      background:linear-gradient(145deg,#1a1a2e,#16213e);
      border:3px solid #2a2a4a; border-radius:16px 16px 0 0;
      transform-origin:bottom center;
      box-shadow:0 20px 60px rgba(0,0,0,0.6),inset 0 0 40px rgba(100,100,255,0.05);
      overflow:hidden;
    }
    #cinematic-screen {
      position:absolute; top:18px; left:18px; width:444px; height:264px;
      background:#0d1117; border-radius:8px; overflow:hidden;
      box-shadow:inset 0 0 30px rgba(0,0,0,0.5);
      display:flex; flex-direction:column; align-items:center; justify-content:center;
    }
    #cinematic-terminal {
      font-family:'Courier New',monospace; color:#00ff88;
      font-size:1rem; text-align:left; padding:20px;
      width:100%; height:100%; box-sizing:border-box;
    }
    .term-line { opacity:0; white-space:nowrap; overflow:hidden; margin:4px 0; }
    .term-line.show { opacity:1; }
    .cursor-b {
      display:inline-block; width:8px; height:14px;
      background:#00ff88; animation:blink 0.8s step-end infinite;
      vertical-align:text-bottom; margin-left:2px;
    }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    #cinematic-screen.glow {
      animation:scGlow 0.8s ease-out;
    }
    @keyframes scGlow {
      0%{box-shadow:inset 0 0 30px rgba(0,0,0,0.5)}
      30%{box-shadow:inset 0 0 80px rgba(0,255,136,0.3),0 0 60px rgba(0,255,136,0.2)}
      60%{box-shadow:inset 0 0 120px rgba(0,255,136,0.5),0 0 100px rgba(0,255,136,0.3)}
      100%{box-shadow:inset 0 0 30px rgba(0,0,0,0.5)}
    }
    #cinematic-base {
      position:absolute; bottom:0; left:0; width:520px; height:60px;
      background:linear-gradient(180deg,#1a1a2e,#12122a);
      border:3px solid #2a2a4a; border-top:none; border-radius:0 0 16px 16px;
      box-shadow:0 10px 30px rgba(0,0,0,0.4);
    }
    .k-row { display:flex; gap:4px; justify-content:center; margin-bottom:3px; }
    .k { width:20px; height:16px; background:#2a2a4a; border-radius:2px; border-bottom:2px solid #1a1a3a; }
    .k.sp { width:80px; }
    #cinematic-trackpad {
      position:absolute; bottom:8px; left:50%; transform:translateX(-50%);
      width:80px; height:30px; background:#1e1e3e; border-radius:4px; border:1px solid #2a2a4a;
    }
    .b-particle {
      position:fixed; z-index:99999; pointer-events:none;
      animation:pFly 1.2s ease-out forwards;
    }
    @keyframes pFly {
      0%{transform:translate(0,0) scale(1) rotate(0);opacity:1}
      100%{transform:translate(var(--px),var(--py)) scale(0) rotate(360deg);opacity:0}
    }
    #cinematic-fly {
      position:fixed; z-index:99999;
      font-family:'Inter',system-ui,sans-serif; font-weight:800;
      color:#00ff88; text-shadow:0 0 40px rgba(0,255,136,0.5),0 0 80px rgba(0,255,136,0.2);
      pointer-events:none; opacity:0;
    }
    #cinematic-crack { position:absolute; top:0;left:0; width:100%;height:100%; pointer-events:none; opacity:0; }
    #cinematic-crack.show { opacity:1; }
    .cr { position:absolute; background:rgba(0,255,136,0.6); box-shadow:0 0 10px rgba(0,255,136,0.4); }
    #cinematic-shine {
      position:absolute; top:-50%;left:-50%; width:200%;height:200%;
      background:linear-gradient(45deg,transparent 30%,rgba(255,255,255,0.03) 50%,transparent 70%);
      animation:shSlide 4s linear infinite; pointer-events:none;
    }
    @keyframes shSlide { 0%{transform:translateX(-100%) translateY(-100%)} 100%{transform:translateX(100%) translateY(100%)} }
  `;
  document.head.appendChild(style);

  const ov = document.createElement('div');
  ov.id = 'cinematic-overlay';
  ov.innerHTML = `
    <div id="cinematic-laptop">
      <div id="cinematic-lid">
        <div id="cinematic-screen">
          <div id="cinematic-terminal">
            <div class="term-line" style="color:#888">$ ./bootstrap.sh</div>
            <div class="term-line" style="color:#888">> Initializing VS Computer Education...</div>
            <div class="term-line" style="color:#888">> Loading courses...</div>
            <div class="term-line" style="color:#888" id="l-course">> <span id="c-text"></span><span class="cursor-b"></span></div>
          </div>
        </div>
        <div id="cinematic-shine"></div>
        <div id="cinematic-crack">
          <div class="cr" style="top:50%;left:30%;width:40%;height:2px;transform:rotate(-15deg)"></div>
          <div class="cr" style="top:40%;left:50%;width:30%;height:2px;transform:rotate(25deg)"></div>
          <div class="cr" style="top:60%;left:40%;width:25%;height:2px;transform:rotate(-40deg)"></div>
          <div class="cr" style="top:45%;left:35%;width:20%;height:2px;transform:rotate(10deg)"></div>
        </div>
      </div>
      <div id="cinematic-base">
        <div style="padding:8px 20px 0">
          <div class="k-row">${'<div class="k"></div>'.repeat(13)}</div>
          <div class="k-row"><div class="k" style="width:28px"></div>${'<div class="k"></div>'.repeat(11)}</div>
          <div class="k-row"><div class="k" style="width:32px"></div>${'<div class="k"></div>'.repeat(9)}<div class="k" style="width:40px"></div></div>
        </div>
        <div id="cinematic-trackpad"></div>
      </div>
    </div>
  `;
  document.body.appendChild(ov);

  const scr = ov.querySelector('#cinematic-screen');
  const lap = ov.querySelector('#cinematic-laptop');
  const crack = ov.querySelector('#cinematic-crack');
  const cText = ov.querySelector('#c-text');

  const courses = ['Computer Skills','Tally Prime','Graphic Design','Hardware & Networking'];

  setTimeout(() => {
    document.querySelectorAll('.term-line').forEach((l,i) => {
      setTimeout(() => l.classList.add('show'), i*300);
    });
  }, 200);

  let ci=0, ch=0;
  const typeC = () => {
    if(ci>=courses.length){ setTimeout(breakout, 600); return; }
    const cs = courses[ci];
    if(ch<=cs.length){ cText.textContent=cs.substring(0,ch++); setTimeout(typeC,60); }
    else { setTimeout(()=>{ cText.textContent=''; ch=0; ci++; setTimeout(typeC,400); },500); }
  };
  setTimeout(typeC, 1400);

  function breakout() {
    scr.classList.add('glow');
    crack.classList.add('show');
    let si=2;
    const sii = setInterval(()=>{
      lap.style.transform = `translate(${Math.random()*si*2-si}px,${Math.random()*si*2-si}px)`;
      si+=1;
    },30);

    setTimeout(()=>{
      clearInterval(sii);
      lap.style.transform='';
      for(let i=0;i<40;i++){
        const p=document.createElement('div');
        p.className='b-particle';
        p.textContent=['✨','💻','⚡','💫','🌟','🔮'][Math.floor(Math.random()*6)];
        p.style.left=(window.innerWidth/2+Math.random()*100-50)+'px';
        p.style.top=(window.innerHeight/2+Math.random()*60-30)+'px';
        p.style.fontSize=(12+Math.random()*20)+'px';
        p.style.setProperty('--px',(Math.random()-0.5)*600+'px');
        p.style.setProperty('--py',(Math.random()-0.5)*400+'px');
        document.body.appendChild(p);
        setTimeout(()=>p.remove(),1200);
      }

      const ft=document.createElement('div');
      ft.id='cinematic-fly';
      ft.textContent='VS Computer Education';
      ft.style.fontSize='3rem';
      ft.style.left=(window.innerWidth/2-200)+'px';
      ft.style.top=(window.innerHeight/2-30)+'px';
      ft.style.opacity='1';
      ft.style.transform='scale(0.5)';
      document.body.appendChild(ft);

      setTimeout(()=>{
        ft.style.transition='all 1.2s cubic-bezier(0.34,1.56,0.64,1)';
        ft.style.fontSize='3.5rem';
        ft.style.left='50%';
        ft.style.top='30%';
        ft.style.transform='translate(-50%,-50%) scale(1)';
        ft.style.color='white';
        ft.style.textShadow='0 0 40px rgba(0,255,136,0.3)';
      },100);

      lap.style.transition='all 0.8s ease';
      lap.style.opacity='0';
      lap.style.transform='scale(0.8) translateY(40px)';

      setTimeout(()=>{
        ov.classList.add('fade-out');
        setTimeout(()=>{
          ft.style.transition='all 0.5s ease';
          ft.style.opacity='0';
          ft.style.transform='translate(-50%,-50%) scale(0.8)';
          setTimeout(()=>{ ft.remove(); ov.remove(); style.remove(); document.dispatchEvent(new CustomEvent('intro-complete')); },500);
        },1500);
      },800);
    },800);
  }

  setTimeout(()=>{
    if(document.body.contains(ov)){ ov.classList.add('fade-out'); setTimeout(()=>{if(document.body.contains(ov))ov.remove();},800); }
  },7000);

  console.log('🎬 Cinematic intro loaded!');
})();
