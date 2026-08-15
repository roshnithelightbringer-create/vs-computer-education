// ========================================================
// Ultimate Mascot v2 - Red-haired Schoolgirl
// VS Computer Education
// ========================================================

(function() {
  'use strict';

  const MESSAGES = [
    "Need help choosing a course? 😊",
    "We have a girls batch! 💁‍♀️",
    "Free demo class available! 🎓",
    "DCA, ADCA, ADCT, PGDCA! ✨",
    "Tally Prime is our specialty! 💪",
    "Ask me anything! 💕",
    "Hi there! 👋"
  ];

  const EXPRESSIONS = ['😊', '😄', '😘', '💖', '✨', '🤗'];

  let state = {
    x: window.innerWidth - 180,
    y: window.innerHeight - 200,
    targetX: window.innerWidth - 180,
    targetY: window.innerHeight - 200,
    mouseX: window.innerWidth - 180,
    mouseY: window.innerHeight - 200,
    lastMouse: 0,
    lastDance: 0,
    lastMsg: 0,
    lastExpr: 0,
    msgIdx: 0,
    exprIdx: 0,
    dancing: false,
    jumping: false,
    floatAngle: 0,
    usingAlt: false
  };

  // ---- DOM ----
  const el = document.createElement('div');
  el.id = 'mascot-wrap';
  el.innerHTML = `
    <div id="mascot-bubble"><span id="mascot-bubble-text"></span></div>
    <div id="mascot-body">
      <img src="assets/mascot.png" alt="Mascot" id="mascot-img" draggable="false">
      <div id="mascot-expr"></div>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #mascot-wrap {
      position: fixed;
      z-index: 10001;
      pointer-events: none;
      will-change: transform;
      transition: none;
    }
    #mascot-body {
      position: relative;
      width: 130px;
      height: 170px;
      cursor: pointer;
      pointer-events: all;
    }
    #mascot-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      pointer-events: none;
      transition: filter 0.3s;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.12));
    }
    #mascot-body:hover #mascot-img {
      filter: drop-shadow(0 4px 20px rgba(255,80,120,0.4));
    }
    #mascot-expr {
      position: absolute;
      top: -8px;
      right: -12px;
      font-size: 30px;
      line-height: 1;
      filter: drop-shadow(0 2px 6px rgba(0,0,0,0.2));
      animation: exprPop 0.4s ease;
    }
    @keyframes exprPop {
      0% { transform: scale(0); opacity: 0; }
      60% { transform: scale(1.3); }
      100% { transform: scale(1); opacity: 1; }
    }
    #mascot-bubble {
      position: absolute;
      bottom: 165px;
      left: 10px;
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 16px;
      padding: 10px 16px;
      font-size: 0.8rem;
      color: #1e293b;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.35s, transform 0.35s;
      transform: translateY(8px) scale(0.95);
      max-width: 220px;
      white-space: nowrap;
      pointer-events: none;
      z-index: 10002;
      font-family: system-ui, -apple-system, sans-serif;
    }
    #mascot-bubble.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }
    #mascot-bubble::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 20px;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid white;
    }
    .mascot-dance #mascot-body {
      animation: danceAnim 0.5s ease infinite;
    }
    @keyframes danceAnim {
      0%, 100% { transform: rotate(0) translateY(0); }
      25% { transform: rotate(-10deg) translateY(-10px); }
      75% { transform: rotate(10deg) translateY(-10px); }
    }
    .mascot-jump #mascot-body {
      animation: jumpAnim 0.5s ease;
    }
    @keyframes jumpAnim {
      0% { transform: translateY(0) scale(1); }
      30% { transform: translateY(-45px) scale(1.1); }
      50% { transform: translateY(-55px) scale(0.95); }
      70% { transform: translateY(-20px) scale(1.05); }
      100% { transform: translateY(0) scale(1); }
    }
    .mascot-float #mascot-body {
      animation: floatAnim 3s ease-in-out infinite;
    }
    @keyframes floatAnim {
      0%, 100% { transform: translateY(0) rotate(0); }
      33% { transform: translateY(-14px) rotate(-3deg); }
      66% { transform: translateY(-7px) rotate(3deg); }
    }
    .star-particle {
      position: fixed;
      font-size: 16px;
      pointer-events: none;
      z-index: 9999;
      animation: starFly 1.2s ease-out forwards;
    }
    @keyframes starFly {
      0% { transform: translate(0,0) scale(1) rotate(0); opacity: 1; }
      100% { transform: translate(var(--sx), var(--sy)) scale(0) rotate(180deg); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(el);

  const img = el.querySelector('#mascot-img');
  const bubble = el.querySelector('#mascot-bubble');
  const bubbleText = el.querySelector('#mascot-bubble-text');
  const exprEl = el.querySelector('#mascot-expr');
  const body = el.querySelector('#mascot-body');

  // ---- Helpers ----
  function showMsg(text) {
    bubbleText.textContent = text;
    bubble.classList.add('show');
    clearTimeout(bubble._t);
    bubble._t = setTimeout(() => bubble.classList.remove('show'), 4500);
  }

  function changeExpr() {
    state.exprIdx = (state.exprIdx + 1) % EXPRESSIONS.length;
    exprEl.textContent = EXPRESSIONS[state.exprIdx];
    exprEl.style.animation = 'none';
    requestAnimationFrame(() => exprEl.style.animation = 'exprPop 0.4s ease');
  }

  function spawnStars(n) {
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'star-particle';
      s.textContent = ['✨','⭐','💫','🌟'][Math.floor(Math.random()*4)];
      s.style.left = (state.x + 20 + Math.random()*60) + 'px';
      s.style.top = (state.y + 10 + Math.random()*40) + 'px';
      s.style.setProperty('--sx', (Math.random()-0.5)*80 + 'px');
      s.style.setProperty('--sy', (-40-Math.random()*60) + 'px');
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1200);
    }
  }

  function dance() {
    if (state.dancing) return;
    state.dancing = true;
    el.classList.add('mascot-dance');
    changeExpr();
    spawnStars(5);
    showMsg(['💃 Dance time!','🎶 La la la!','😊 Feeling good!','✨✨✨'][Math.floor(Math.random()*4)]);
    setTimeout(() => {
      el.classList.remove('mascot-dance');
      state.dancing = false;
    }, 2500);
  }

  function jump() {
    if (state.jumping) return;
    state.jumping = true;
    el.classList.add('mascot-jump');
    changeExpr();
    spawnStars(4);
    setTimeout(() => {
      el.classList.remove('mascot-jump');
      state.jumping = false;
    }, 500);
  }

  function toggleImg() {
    state.usingAlt = !state.usingAlt;
    img.src = state.usingAlt ? 'assets/mascot-alt.png' : 'assets/mascot.png';
  }

  // ---- Events ----
  document.addEventListener('mousemove', e => {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;
    state.lastMouse = Date.now();
    el.classList.remove('mascot-float');
  });

  body.addEventListener('click', e => {
    e.stopPropagation();
    jump();
    showMsg(MESSAGES[state.msgIdx % MESSAGES.length]);
    state.msgIdx++;
    toggleImg();
  });

  // ---- Loop ----
  function loop() {
    const now = Date.now();
    const dt = now - state.lastMouse;

    if (dt < 800) {
      // Follow cursor
      state.targetX = Math.max(10, Math.min(innerWidth-140, state.mouseX - 65));
      state.targetY = Math.max(10, Math.min(innerHeight-180, state.mouseY - 85));
      state.x += (state.targetX - state.x) * 0.12;
      state.y += (state.targetY - state.y) * 0.12;
      el.style.left = state.x + 'px';
      el.style.top = state.y + 'px';
      if (Math.random() < 0.2) spawnStars(1);
    } else {
      // Float
      el.classList.add('mascot-float');
      state.floatAngle += 0.012;
      const r = 60;
      state.targetX = innerWidth - 190 + Math.sin(state.floatAngle) * r;
      state.targetY = innerHeight - 210 + Math.cos(state.floatAngle*0.7) * r;
      state.x += (state.targetX - state.x) * 0.04;
      state.y += (state.targetY - state.y) * 0.04;
      el.style.left = state.x + 'px';
      el.style.top = state.y + 'px';
    }

    // Random dance
    if (now - state.lastDance > 12000 && Math.random() < 0.004) {
      dance();
      state.lastDance = now;
    }

    // Random message
    if (now - state.lastMsg > 8000 && Math.random() < 0.005) {
      showMsg(MESSAGES[state.msgIdx % MESSAGES.length]);
      state.msgIdx++;
      state.lastMsg = now;
    }

    // Expression change
    if (now - state.lastExpr > 10000) {
      changeExpr();
      state.lastExpr = now;
    }

    requestAnimationFrame(loop);
  }

  // ---- Init ----
  state.x = innerWidth - 180;
  state.y = innerHeight - 200;
  el.style.left = state.x + 'px';
  el.style.top = state.y + 'px';
  exprEl.textContent = '😊';
  state.lastExpr = Date.now();

  setTimeout(() => {
    showMsg("Hi! I'm your guide 👋");
    changeExpr();
  }, 600);

  loop();
  console.log('✨ Mascot v2 loaded!');
})();
