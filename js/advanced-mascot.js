// ========================================================
// Ultimate Mascot v3 - Full Anime Character
// VS Computer Education
// ========================================================

(function() {
  'use strict';

  // ---------- CONFIG ----------
  const POSES = {
    float:  'assets/mascot-float.png',
    float2: 'assets/mascot-float2.png',
    sit:    'assets/mascot-sit.png',
    lay:    'assets/mascot-lay.png',
    wave:   'assets/mascot-wave.png',
    sleep:  'assets/mascot-sleep.png'
  };

  const MESSAGES = [
    "Need help choosing a course? 😊",
    "We have a girls batch! 💁‍♀️",
    "Free demo class available! 🎓",
    "DCA, ADCA, ADCT, PGDCA! ✨",
    "Tally Prime is our specialty! 💪",
    "Ask me anything! 💕",
    "Hi there! 👋"
  ];

  // ---------- STATE ----------
  let state = {
    x: window.innerWidth - 180,
    y: window.innerHeight - 200,
    targetX: window.innerWidth - 180,
    targetY: window.innerHeight - 200,
    mouseX: window.innerWidth - 180,
    mouseY: window.innerHeight - 200,
    lastMouse: Date.now(),
    lastDance: Date.now() + 8000,
    lastMsg: Date.now() + 3000,
    lastBlink: Date.now() + 4000,
    lastPoseSwitch: Date.now(),
    msgIdx: 0,
    dancing: false,
    jumping: false,
    currentPose: 'float',
    floatAngle: 0,
    isBlinking: false,
    isSleeping: false,
    mouseDist: 999,
    onWhatsApp: false,
    onCourseSection: false
  };

  // ---------- DOM ----------
  const el = document.createElement('div');
  el.id = 'mascot-wrap';
  el.innerHTML = `
    <div id="mascot-bubble"><span id="mascot-bubble-text"></span></div>
    <div id="mascot-body">
      <img src="${POSES.float}" alt="Mascot" id="mascot-img" draggable="false">
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
      width: 100px;
      height: 140px;
      cursor: pointer;
      pointer-events: all;
      transition: width 0.4s ease, height 0.4s ease;
    }
    #mascot-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      pointer-events: none;
      transition: filter 0.3s, transform 0.3s;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.12));
      image-rendering: auto;
    }
    #mascot-body:hover #mascot-img {
      filter: drop-shadow(0 4px 20px rgba(255,80,120,0.4)) brightness(1.05);
    }
    #mascot-bubble {
      position: absolute;
      bottom: 135px;
      left: 0;
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
      25% { transform: rotate(-12deg) translateY(-12px); }
      75% { transform: rotate(12deg) translateY(-12px); }
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
      animation: floatAnim 3.5s ease-in-out infinite;
    }
    @keyframes floatAnim {
      0%, 100% { transform: translateY(0) rotate(0); }
      33% { transform: translateY(-16px) rotate(-4deg); }
      66% { transform: translateY(-8px) rotate(4deg); }
    }
    .mascot-sit #mascot-body {
      animation: sitAnim 2s ease-in-out infinite;
    }
    @keyframes sitAnim {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
    .mascot-leg-dangle {
      animation: legDangle 0.6s ease-in-out infinite !important;
    }
    @keyframes legDangle {
      0%, 100% { transform: rotate(-3deg); }
      50% { transform: rotate(3deg); }
    }
    .mascot-lay {
      width: 130px !important;
      height: 90px !important;
    }
    .mascot-lay #mascot-body {
      animation: layBreath 3s ease-in-out infinite;
    }
    @keyframes layBreath {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-3px) scale(1.01); }
    }
    .mascot-wave #mascot-body {
      animation: waveAnim 0.8s ease-in-out infinite;
    }
    @keyframes waveAnim {
      0%, 100% { transform: rotate(0) translateY(0); }
      25% { transform: rotate(-15deg) translateY(-5px); }
      75% { transform: rotate(15deg) translateY(-5px); }
    }
    .mascot-sleep #mascot-body {
      animation: sleepBreath 4s ease-in-out infinite;
    }
    @keyframes sleepBreath {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-2px) scale(1.02); }
    }
    .star-particle {
      position: fixed;
      font-size: 14px;
      pointer-events: none;
      z-index: 9999;
      animation: starFly 1.2s ease-out forwards;
    }
    @keyframes starFly {
      0% { transform: translate(0,0) scale(1) rotate(0); opacity: 1; }
      100% { transform: translate(var(--sx), var(--sy)) scale(0) rotate(180deg); opacity: 0; }
    }
    .zzz-particle {
      position: fixed;
      font-size: 18px;
      pointer-events: none;
      z-index: 9999;
      animation: zzzFloat 2s ease-out forwards;
    }
    @keyframes zzzFloat {
      0% { transform: translate(0,0) scale(0.5); opacity: 0; }
      20% { opacity: 1; }
      100% { transform: translate(20px, -60px) scale(1.3); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(el);

  const img = el.querySelector('#mascot-img');
  const bubble = el.querySelector('#mascot-bubble');
  const bubbleText = el.querySelector('#mascot-bubble-text');
  const body = el.querySelector('#mascot-body');

  // ---------- HELPERS ----------
  function setPose(pose) {
    if (state.currentPose === pose) return;
    state.currentPose = pose;

    // Reset classes
    el.classList.remove('mascot-float', 'mascot-sit', 'mascot-lay', 'mascot-wave', 'mascot-sleep', 'mascot-leg-dangle');

    img.src = POSES[pose] || POSES.float;

    switch(pose) {
      case 'float': case 'float2':
        el.classList.add('mascot-float');
        body.style.width = '100px';
        body.style.height = '140px';
        break;
      case 'sit':
        el.classList.add('mascot-sit', 'mascot-leg-dangle');
        body.style.width = '110px';
        body.style.height = '130px';
        break;
      case 'lay':
        el.classList.add('mascot-lay');
        body.style.width = '130px';
        body.style.height = '90px';
        break;
      case 'wave':
        el.classList.add('mascot-wave');
        body.style.width = '100px';
        body.style.height = '140px';
        break;
      case 'sleep':
        el.classList.add('mascot-sleep');
        body.style.width = '100px';
        body.style.height = '130px';
        break;
    }
  }

  function showMsg(text) {
    bubbleText.textContent = text;
    bubble.classList.add('show');
    clearTimeout(bubble._t);
    bubble._t = setTimeout(() => bubble.classList.remove('show'), 4500);
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

  function spawnZzz() {
    const s = document.createElement('span');
    s.className = 'zzz-particle';
    s.textContent = '💤';
    s.style.left = (state.x + 50) + 'px';
    s.style.top = (state.y - 10) + 'px';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 2000);
  }

  function dance() {
    if (state.dancing) return;
    state.dancing = true;
    el.classList.add('mascot-dance');
    setPose('wave');
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
    spawnStars(4);
    setTimeout(() => {
      el.classList.remove('mascot-jump');
      state.jumping = false;
    }, 500);
  }

  // ---------- SCENE DETECTION ----------
  function checkScene() {
    const waBtn = document.querySelector('.whatsapp-float, .whatsapp-btn, [class*="whatsapp"], a[href*="wa.me"]');
    const coursesSection = document.querySelector('#courses, .courses-section, section#courses, .courses-grid, [class*="course"]');

    let nearWA = false;
    let nearCourses = false;

    if (waBtn) {
      const r = waBtn.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const cy = r.top + r.height/2;
      const dx = state.x + 50 - cx;
      const dy = state.y + 70 - cy;
      nearWA = Math.sqrt(dx*dx + dy*dy) < 200;
    }

    if (coursesSection) {
      const r = coursesSection.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const cy = r.top + r.height/2;
      const dx = state.x + 50 - cx;
      const dy = state.y + 70 - cy;
      nearCourses = Math.sqrt(dx*dx + dy*dy) < 300;
    }

    state.onWhatsApp = nearWA;
    state.onCourseSection = nearCourses;
  }

  // ---------- EVENTS ----------
  document.addEventListener('mousemove', e => {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;
    state.lastMouse = Date.now();
    state.isSleeping = false;

    // Calculate distance from mouse to mascot
    const dx = state.mouseX - (state.x + 50);
    const dy = state.mouseY - (state.y + 70);
    state.mouseDist = Math.sqrt(dx*dx + dy*dy);

    // Wave when close
    if (state.mouseDist < 100 && state.currentPose !== 'wave' && !state.dancing) {
      setPose('wave');
    } else if (state.mouseDist >= 100 && state.currentPose === 'wave' && !state.dancing) {
      setPose('float');
    }
  });

  body.addEventListener('click', e => {
    e.stopPropagation();
    jump();
    showMsg(MESSAGES[state.msgIdx % MESSAGES.length]);
    state.msgIdx++;
    // Switch between float poses
    if (state.currentPose === 'float') setPose('float2');
    else if (state.currentPose === 'float2') setPose('float');
  });

  // ---------- MAIN LOOP ----------
  function loop() {
    const now = Date.now();
    const dt = now - state.lastMouse;

    checkScene();

    // ---- Pose Logic ----
    if (state.dancing) {
      // Don't change pose while dancing
    } else if (state.onWhatsApp) {
      setPose('lay');
    } else if (state.onCourseSection) {
      setPose('sit');
    } else if (dt > 30000 && !state.isSleeping) {
      // Idle for 30s -> sleep
      state.isSleeping = true;
      setPose('sleep');
      if (Math.random() < 0.05) spawnZzz();
    } else if (dt > 30000 && state.isSleeping) {
      if (Math.random() < 0.03) spawnZzz();
    } else if (state.mouseDist < 100 && state.currentPose !== 'wave') {
      setPose('wave');
    } else if (state.mouseDist >= 100 && state.currentPose === 'wave') {
      setPose('float');
    } else if (state.currentPose === 'wave' && state.mouseDist >= 100) {
      setPose('float');
    }

    // ---- Movement ----
    if (dt < 800) {
      // Follow cursor smoothly
      state.targetX = Math.max(10, Math.min(innerWidth-140, state.mouseX - 50));
      state.targetY = Math.max(10, Math.min(innerHeight-180, state.mouseY - 70));
      state.x += (state.targetX - state.x) * 0.1;
      state.y += (state.targetY - state.y) * 0.1;
    } else {
      // Float around
      state.floatAngle += 0.008;
      const r = state.onCourseSection ? 20 : 50;
      state.targetX = (state.onCourseSection ? innerWidth * 0.7 : innerWidth - 190) + Math.sin(state.floatAngle) * r;
      state.targetY = (state.onCourseSection ? innerHeight * 0.5 : innerHeight - 210) + Math.cos(state.floatAngle * 0.7) * r;
      state.x += (state.targetX - state.x) * 0.03;
      state.y += (state.targetY - state.y) * 0.03;
    }

    el.style.left = state.x + 'px';
    el.style.top = state.y + 'px';

    // ---- Random Dance ----
    if (now - state.lastDance > 15000 && Math.random() < 0.003 && dt > 5000) {
      dance();
      state.lastDance = now;
    }

    // ---- Random Message ----
    if (now - state.lastMsg > 10000 && Math.random() < 0.004) {
      showMsg(MESSAGES[state.msgIdx % MESSAGES.length]);
      state.msgIdx++;
      state.lastMsg = now;
    }

    requestAnimationFrame(loop);
  }

  // ---------- INIT ----------
  state.x = window.innerWidth - 180;
  state.y = window.innerHeight - 200;
  el.style.left = state.x + 'px';
  el.style.top = state.y + 'px';
  setPose('float');

  setTimeout(() => {
    showMsg("Hi! I'm your guide 👋");
  }, 800);

  loop();
  console.log('✨ Mascot v3 loaded!');
})();
