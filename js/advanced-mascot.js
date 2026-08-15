// ========================================================
// Ultimate Mascot v3 - Full Anime Interaction System
// VS Computer Education
// ========================================================

(function() {
  'use strict';

  // ------- POSES -------
  const POSES = {
    STAND: 'assets/mascot.png',
    ALT: 'assets/mascot-alt.png',
    WAVE: 'assets/mascot-waving.png',
    SIT: 'assets/mascot-sitting.png',
    LAY: 'assets/mascot-laying.png',
    SLEEP: 'assets/mascot-sleep.png'
  };

  const MESSAGES = [
    "Need help? 😊",
    "Girls batch available! 💁‍♀️",
    "Free demo class 🎓",
    "DCA, ADCA, ADCT, PGDCA ✨",
    "Tally Pro hai! 💪",
    "Hi there! 👋"
  ];

  const EXPRESSIONS = ['😊', '😄', '😘', '💖', '✨', '🤗'];

  const ELEMENT_ANCHORS = {
    courses: { selector: '#courses', pose: 'SIT', offsetX: -20, offsetY: -40 },
    whatsapp: { selector: '.whatsapp-btn, [class*="whatsapp"], a[href*="wa.me"]', pose: 'LAY', offsetX: -60, offsetY: -120 },
    footer: { selector: 'footer', pose: 'SIT', offsetX: 10, offsetY: -30 },
    hero: { selector: '#hero, .hero', pose: 'WAVE', offsetX: -70, offsetY: -10 }
  };

  let state = {
    x: window.innerWidth - 180,
    y: window.innerHeight - 200,
    targetX: window.innerWidth - 180,
    targetY: window.innerHeight - 200,
    mouseX: window.innerWidth - 180,
    mouseY: window.innerHeight - 200,
    lastMouse: Date.now(),
    lastDance: Date.now(),
    lastMsg: Date.now(),
    lastExpr: Date.now(),
    msgIdx: 0,
    exprIdx: 0,
    currentPose: 'STAND',
    dancing: false,
    jumping: false,
    sleeping: false,
    blinkState: false,
    anchorEl: null,
    anchorType: null,
    floatAngle: 0,
  };

  // ------- DOM BUILD -------
  const el = document.createElement('div');
  el.id = 'mascot-wrap';

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
      width: 140px;
      height: 180px;
      cursor: pointer;
      pointer-events: all;
      transition: filter 0.2s;
    }
    #mascot-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      pointer-events: none;
      filter: drop-shadow(0 4px 16px rgba(0,0,0,0.12));
      image-rendering: auto;
    }
    #mascot-expr {
      position: absolute;
      top: -10px;
      right: -15px;
      font-size: 32px;
      line-height: 1;
      filter: drop-shadow(0 2px 6px rgba(0,0,0,0.2));
      animation: exprPop 0.4s ease;
    }
    @keyframes exprPop {
      0% { transform: scale(0) rotate(-10deg); opacity: 0; }
      60% { transform: scale(1.3) rotate(5deg); }
      100% { transform: scale(1) rotate(0); opacity: 1; }
    }
    #mascot-bubble {
      position: absolute;
      bottom: 175px;
      left: 5px;
      background: white;
      border: 2px solid #f1f5f9;
      border-radius: 18px;
      padding: 10px 18px;
      font-size: 0.8rem;
      color: #1e293b;
      box-shadow: 0 8px 28px rgba(0,0,0,0.12);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.35s, transform 0.35s;
      transform: translateY(10px) scale(0.92);
      max-width: 230px;
      white-space: nowrap;
      pointer-events: none;
      z-index: 10002;
      font-family: system-ui, -apple-system, sans-serif;
      font-weight: 500;
    }
    #mascot-bubble.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }
    #mascot-bubble::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 24px;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid white;
    }
    
    /* Animation classes */
    .mascot-dance #mascot-body {
      animation: danceAnim 0.5s ease infinite;
    }
    @keyframes danceAnim {
      0%, 100% { transform: rotate(0) translateY(0); }
      25% { transform: rotate(-12deg) translateY(-12px); }
      75% { transform: rotate(12deg) translateY(-12px); }
    }
    .mascot-jump #mascot-body {
      animation: jumpAnim 0.5s ease;
    }
    @keyframes jumpAnim {
      0% { transform: translateY(0) scale(1); }
      30% { transform: translateY(-50px) scale(1.12); }
      50% { transform: translateY(-60px) scale(0.92); }
      70% { transform: translateY(-20px) scale(1.08); }
      100% { transform: translateY(0) scale(1); }
    }
    .mascot-float #mascot-body {
      animation: floatAnim 3s ease-in-out infinite;
    }
    @keyframes floatAnim {
      0%, 100% { transform: translateY(0) rotate(0); }
      33% { transform: translateY(-16px) rotate(-3deg); }
      66% { transform: translateY(-8px) rotate(3deg); }
    }
    .mascot-idle #mascot-body {
      animation: idleSway 2s ease-in-out infinite;
    }
    @keyframes idleSway {
      0%, 100% { transform: translateY(0) rotate(0); }
      50% { transform: translateY(-3px) rotate(2deg); }
    }
    .mascot-sit #mascot-body {
      animation: sitSway 1.5s ease-in-out infinite;
    }
    @keyframes sitSway {
      0%, 100% { transform: rotate(0); }
      50% { transform: rotate(2deg) translateX(2px); }
    }
    .mascot-lay #mascot-body {
      animation: layBounce 2s ease-in-out infinite;
    }
    @keyframes layBounce {
      0%, 100% { transform: rotate(0); }
      50% { transform: rotate(-2deg) translateY(-2px); }
    }
    .mascot-dangle #mascot-body {
      animation: legDangle 1.2s ease-in-out infinite;
    }
    @keyframes legDangle {
      0%, 100% { transform: rotate(0) translateY(0); }
      25% { transform: rotate(-4deg) translateY(-2px); }
      75% { transform: rotate(4deg) translateY(-2px); }
    }

    /* Star particles */
    .star-particle {
      position: fixed;
      font-size: 18px;
      pointer-events: none;
      z-index: 9999;
      animation: starFly 1.3s ease-out forwards;
    }
    @keyframes starFly {
      0% { transform: translate(0,0) scale(1) rotate(0); opacity: 1; }
      100% { transform: translate(var(--sx), var(--sy)) scale(0) rotate(220deg); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  el.innerHTML = `
    <div id="mascot-bubble"><span id="mascot-bubble-text"></span></div>
    <div id="mascot-body"><img id="mascot-img"></div>
    <div id="mascot-expr"></div>
  `;
  document.body.appendChild(el);

  const img = el.querySelector('#mascot-img');
  const bubble = el.querySelector('#mascot-bubble');
  const bubbleText = el.querySelector('#mascot-bubble-text');
  const exprEl = el.querySelector('#mascot-expr');
  const body = el.querySelector('#mascot-body');

  // ------- HELPERS -------
  function setPose(pose) {
    if (state.currentPose === pose) return;
    state.currentPose = pose;
    const src = POSES[pose] || POSES.STAND;
    img.src = src;
    // Reset animation classes
    el.classList.remove('mascot-dance', 'mascot-jump', 'mascot-float', 'mascot-idle', 'mascot-sit', 'mascot-lay', 'mascot-dangle');
    if (pose === 'SIT') el.classList.add('mascot-sit', 'mascot-dangle');
    else if (pose === 'LAY') el.classList.add('mascot-lay');
    else if (pose === 'WAVE') el.classList.add('mascot-float');
    else el.classList.add('mascot-idle');
  }

  function showMsg(text) {
    bubbleText.textContent = text;
    bubble.classList.add('show');
    clearTimeout(bubble._t);
    bubble._t = setTimeout(() => bubble.classList.remove('show'), 4500);
  }

  function changeExpr() {
    state.exprIdx = (state.exprIdx + 1) % EXPRESSIONS.length;
    exprEl.textContent = EXPRESSIONS[state.exprIdx];
  }

  function spawnStars(n) {
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'star-particle';
      s.textContent = ['✨','⭐','💫','🌟'][Math.floor(Math.random()*4)];
      s.style.left = (state.x + 20 + Math.random()*70) + 'px';
      s.style.top = (state.y + 10 + Math.random()*50) + 'px';
      s.style.setProperty('--sx', (Math.random()-0.5)*100 + 'px');
      s.style.setProperty('--sy', (-50-Math.random()*70) + 'px');
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1300);
    }
  }

  function dance() {
    if (state.dancing) return;
    state.dancing = true;
    el.classList.add('mascot-dance');
    setPose('WAVE');
    changeExpr();
    spawnStars(6);
    showMsg(['💃 Dance time!','🎶 La la la!','😊 Feeling good!','✨✨✨'][Math.floor(Math.random()*4)]);
    setTimeout(() => { el.classList.remove('mascot-dance'); state.dancing = false; }, 2500);
  }

  function jumpOver() {
    if (state.jumping) return;
    state.jumping = true;
    el.classList.add('mascot-jump');
    changeExpr();
    spawnStars(5);
    setTimeout(() => { el.classList.remove('mascot-jump'); state.jumping = false; }, 500);
  }

  // ------- FIND ELEMENT ANCHORS -------
  function findAnchors() {
    for (const [key, anchor] of Object.entries(ELEMENT_ANCHORS)) {
      const els = document.querySelectorAll(anchor.selector);
      for (const targetEl of els) {
        const rect = targetEl.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          return { key, el: targetEl, rect, anchor };
        }
      }
    }
    return null;
  }

  function checkAnchors() {
    if (state.dancing) return;

    const found = findAnchors();
    if (found) {
      const { key, rect, anchor } = found;
      if (state.anchorType !== key) {
        state.anchorType = key;
        state.anchorEl = found.el;
        setPose(anchor.pose);
      }
      if (key === 'courses') {
        state.targetX = rect.left + anchor.offsetX;
        state.targetY = rect.top + anchor.offsetY;
        el.classList.remove('mascot-float');
      } else if (key === 'whatsapp') {
        state.targetX = rect.left + anchor.offsetX;
        state.targetY = rect.top + anchor.offsetY;
        el.classList.remove('mascot-float');
      } else if (key === 'footer') {
        state.targetX = rect.left + anchor.offsetX;
        state.targetY = rect.top + anchor.offsetY;
        el.classList.remove('mascot-float');
      } else if (key === 'hero') {
        state.targetX = rect.left + anchor.offsetX;
        state.targetY = rect.top + anchor.offsetY;
        el.classList.remove('mascot-float');
      }
      return true;
    }

    if (state.anchorType !== null) {
      state.anchorType = null;
      state.anchorEl = null;
      setPose('STAND');
    }
    return false;
  }

  // ------- EVENTS -------
  document.addEventListener('mousemove', e => {
    if (state.anchorType) return; // Don't follow cursor when anchored
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;
    state.lastMouse = Date.now();
    el.classList.remove('mascot-float');
  });

  body.addEventListener('click', e => {
    e.stopPropagation();
    jumpOver();
    setPose('WAVE');
    showMsg(MESSAGES[state.msgIdx % MESSAGES.length]);
    state.msgIdx++;
    setTimeout(() => {
      if (!state.anchorType) setPose('STAND');
    }, 1500);
  });

  window.addEventListener('scroll', () => {
    // Re-check anchors on scroll
    state.anchorType = null; // Force re-check
  });

  // ------- MAIN LOOP -------
  function loop() {
    const now = Date.now();
    const dt = now - state.lastMouse;

    // Check anchored positions
    const anchored = checkAnchors();

    if (anchored) {
      // Smooth move to anchor
      state.x += (state.targetX - state.x) * 0.08;
      state.y += (state.targetY - state.y) * 0.08;
      el.style.left = state.x + 'px';
      el.style.top = state.y + 'px';
    } else if (dt < 500) {
      // Follow cursor
      state.targetX = Math.max(10, Math.min(window.innerWidth - 140, state.mouseX - 65));
      state.targetY = Math.max(10, Math.min(window.innerHeight - 190, state.mouseY - 85));
      state.x += (state.targetX - state.x) * 0.12;
      state.y += (state.targetY - state.y) * 0.12;
      el.style.left = state.x + 'px';
      el.style.top = state.y + 'px';
      if (Math.random() < 0.15) spawnStars(1);
    } else {
      // Float
      el.classList.add('mascot-float');
      state.floatAngle += 0.01;
      const r = 70;
      state.targetX = window.innerWidth - 200 + Math.sin(state.floatAngle) * r;
      state.targetY = window.innerHeight - 220 + Math.cos(state.floatAngle * 0.6) * r;
      state.x += (state.targetX - state.x) * 0.04;
      state.y += (state.targetY - state.y) * 0.04;
      el.style.left = state.x + 'px';
      el.style.top = state.y + 'px';
    }

    // Random dance
    if (!state.anchorType && now - state.lastDance > 15000 && Math.random() < 0.005) {
      dance();
      state.lastDance = now;
    }

    // Random message
    if (now - state.lastMsg > 10000 && Math.random() < 0.005) {
      showMsg(MESSAGES[state.msgIdx % MESSAGES.length]);
      state.msgIdx++;
      state.lastMsg = now;
    }

    // Expression changes
    if (now - state.lastExpr > 10000) {
      changeExpr();
      state.lastExpr = now;
    }

    requestAnimationFrame(loop);
  }

  // ------- INIT -------
  state.x = window.innerWidth - 180;
  state.y = window.innerHeight - 200;
  el.style.left = state.x + 'px';
  el.style.top = state.y + 'px';
  img.src = POSES.STAND;
  exprEl.textContent = '😊';
  el.classList.add('mascot-idle');
  state.lastExpr = Date.now();

  setTimeout(() => {
    showMsg("Hi! I'm your guide 👋");
    changeExpr();
  }, 800);

  loop();
  console.log('🎀 Mascot v3 loaded with element interaction!');

  // Expose for debugging
  window.__mascot = { state, setPose, dance, jumpOver };
})();
