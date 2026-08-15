// ========================================================
// Ultimate Mascot v4 - Fast & Expressive Anime Character
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
    "Hi there! 👋",
    "Check out our courses! 📚"
  ];

  const RANDOM_POSES = ['sit', 'lay', 'wave', 'float', 'float2'];

  // ---------- STATE ----------
  let state = {
    x: 120,
    y: 200,
    targetX: 120,
    targetY: 200,
    mouseX: 120,
    mouseY: 200,
    lastMouse: Date.now(),
    lastDance: Date.now() + 5000,
    lastMsg: Date.now() + 2000,
    lastRandomPose: Date.now(),
    lastRoam: Date.now(),
    msgIdx: 0,
    dancing: false,
    jumping: false,
    currentPose: 'float',
    floatAngle: Math.random() * Math.PI * 2,
    roamTargetX: 120,
    roamTargetY: 200,
    isSleeping: false,
    mouseDist: 999,
    pointingAt: null
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
      transition: width 0.3s ease, height 0.3s ease;
    }
    #mascot-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      pointer-events: none;
      transition: filter 0.2s;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.12));
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
      transition: opacity 0.25s, transform 0.25s;
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
    .mascot-dance #mascot-body { animation: danceAnim 0.5s ease infinite; }
    @keyframes danceAnim {
      0%, 100% { transform: rotate(0) translateY(0); }
      25% { transform: rotate(-12deg) translateY(-12px); }
      75% { transform: rotate(12deg) translateY(-12px); }
    }
    .mascot-jump #mascot-body { animation: jumpAnim 0.5s ease; }
    @keyframes jumpAnim {
      0% { transform: translateY(0) scale(1); }
      30% { transform: translateY(-45px) scale(1.1); }
      50% { transform: translateY(-55px) scale(0.95); }
      70% { transform: translateY(-20px) scale(1.05); }
      100% { transform: translateY(0) scale(1); }
    }
    .mascot-float #mascot-body { animation: floatAnim 3s ease-in-out infinite; }
    @keyframes floatAnim {
      0%, 100% { transform: translateY(0) rotate(0); }
      33% { transform: translateY(-12px) rotate(-3deg); }
      66% { transform: translateY(-6px) rotate(3deg); }
    }
    .mascot-sit #mascot-body { animation: sitAnim 1.5s ease-in-out infinite; }
    @keyframes sitAnim {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    .mascot-leg-dangle { animation: legDangle 0.5s ease-in-out infinite !important; }
    @keyframes legDangle {
      0%, 100% { transform: rotate(-4deg); }
      50% { transform: rotate(4deg); }
    }
    .mascot-lay {
      width: 130px !important;
      height: 90px !important;
    }
    .mascot-lay #mascot-body { animation: layBreath 2.5s ease-in-out infinite; }
    @keyframes layBreath {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-2px) scale(1.01); }
    }
    .mascot-wave #mascot-body { animation: waveAnim 0.6s ease-in-out infinite; }
    @keyframes waveAnim {
      0%, 100% { transform: rotate(0) translateY(0); }
      25% { transform: rotate(-15deg) translateY(-5px); }
      75% { transform: rotate(15deg) translateY(-5px); }
    }
    .mascot-sleep #mascot-body { animation: sleepBreath 3s ease-in-out infinite; }
    @keyframes sleepBreath {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-2px) scale(1.02); }
    }
    .star-particle {
      position: fixed; font-size: 14px; pointer-events: none;
      z-index: 9999; animation: starFly 1.2s ease-out forwards;
    }
    @keyframes starFly {
      0% { transform: translate(0,0) scale(1) rotate(0); opacity: 1; }
      100% { transform: translate(var(--sx), var(--sy)) scale(0) rotate(180deg); opacity: 0; }
    }
    .zzz-particle {
      position: fixed; font-size: 18px; pointer-events: none;
      z-index: 9999; animation: zzzFloat 2s ease-out forwards;
    }
    @keyframes zzzFloat {
      0% { transform: translate(0,0) scale(0.5); opacity: 0; }
      20% { opacity: 1; }
      100% { transform: translate(20px, -60px) scale(1.3); opacity: 0; }
    }
    .mascot-point {
      transform: scaleX(-1) !important;
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
    if (state.currentPose === pose && pose !== 'float' && pose !== 'float2') return;
    state.currentPose = pose;

    el.classList.remove('mascot-float', 'mascot-sit', 'mascot-lay', 'mascot-wave', 'mascot-sleep', 'mascot-leg-dangle', 'mascot-point');

    const src = POSES[pose] || POSES.float;
    if (img.src !== src) img.src = src;

    body.style.width = '';
    body.style.height = '';

    switch(pose) {
      case 'float': case 'float2':
        el.classList.add('mascot-float');
        break;
      case 'sit':
        el.classList.add('mascot-sit', 'mascot-leg-dangle');
        break;
      case 'lay':
        el.classList.add('mascot-lay');
        break;
      case 'wave':
        el.classList.add('mascot-wave');
        break;
      case 'sleep':
        el.classList.add('mascot-sleep');
        break;
    }
  }

  function showMsg(text) {
    bubbleText.textContent = text;
    bubble.classList.add('show');
    clearTimeout(bubble._t);
    bubble._t = setTimeout(() => bubble.classList.remove('show'), 4000);
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
    spawnStars(6);
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
    spawnStars(5);
    setTimeout(() => {
      el.classList.remove('mascot-jump');
      state.jumping = false;
    }, 500);
  }

  function randomPose() {
    if (state.dancing) return;
    const pose = RANDOM_POSES[Math.floor(Math.random() * RANDOM_POSES.length)];
    setPose(pose);
    if (Math.random() < 0.3) spawnStars(3);
  }

  function newRoamTarget() {
    state.roamTargetX = 50 + Math.random() * (window.innerWidth - 200);
    state.roamTargetY = 80 + Math.random() * (window.innerHeight - 250);
  }

  // ---------- POINTING AT COURSES ----------
  function checkPointing() {
    const courseCards = document.querySelectorAll('.course-card, .card, [class*="course"], .course-item, h3, .course-title');
    let closest = null;
    let closestDist = 999;

    courseCards.forEach(card => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const cy = r.top + r.height/2;
      const dx = state.x + 50 - cx;
      const dy = state.y + 70 - cy;
      const dist = Math.sqrt(dx*dx + dy*dy);

      if (dist < 250 && dist < closestDist) {
        closest = { el: card, rect: r, dist };
        closestDist = dist;
      }
    });

    if (closest) {
      // Point toward the course card
      const cardCenterX = closest.rect.left + closest.rect.width/2;
      if (cardCenterX < state.x + 50) {
        // Course is to the left - flip mascot to point
        el.classList.add('mascot-point');
      } else {
        el.classList.remove('mascot-point');
      }

      if (!state.pointingAt || state.pointingAt !== closest.el) {
        state.pointingAt = closest.el;
        showMsg(['Check this out! 👆', 'This course is great! ✨', 'I recommend this! 💕', 'Learn this! 📚'][Math.floor(Math.random()*4)]);
      }
      return true;
    }

    state.pointingAt = null;
    el.classList.remove('mascot-point');
    return false;
  }

  // ---------- EVENTS ----------
  document.addEventListener('mousemove', e => {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;
    state.lastMouse = Date.now();
    state.isSleeping = false;

    const dx = state.mouseX - (state.x + 50);
    const dy = state.mouseY - (state.y + 70);
    state.mouseDist = Math.sqrt(dx*dx + dy*dy);
  });

  body.addEventListener('click', e => {
    e.stopPropagation();
    jump();
    showMsg(MESSAGES[state.msgIdx % MESSAGES.length]);
    state.msgIdx++;
    if (Math.random() < 0.5) {
      setPose(state.currentPose === 'float' ? 'float2' : 'float');
    }
  });

  // ---------- MAIN LOOP ----------
  function loop() {
    const now = Date.now();
    const dt = now - state.lastMouse;

    // ---- Pointing at course names ----
    const isPointing = checkPointing();

    // ---- Pose Logic ----
    if (state.dancing) {
      // dancing - do nothing
    } else if (isPointing) {
      // Keep current pose while pointing
    } else if (dt > 30000 && !state.isSleeping) {
      state.isSleeping = true;
      setPose('sleep');
    } else if (dt > 30000 && state.isSleeping) {
      if (Math.random() < 0.03) spawnZzz();
    } else if (state.mouseDist < 80 && state.currentPose !== 'wave') {
      setPose('wave');
    } else if (state.mouseDist >= 80 && state.currentPose === 'wave' && !isPointing) {
      setPose('float');
    }

    // ---- Random pose changes every 8-15s (FAST!) ----
    if (!state.dancing && !state.isSleeping && state.mouseDist > 100 && now - state.lastRandomPose > 8000 + Math.random() * 7000) {
      randomPose();
      state.lastRandomPose = now;
    }

    // ---- Movement (FAST) ----
    if (dt < 1500) {
      // Follow cursor - FASTER
      state.targetX = Math.max(10, Math.min(innerWidth-140, state.mouseX - 50));
      state.targetY = Math.max(10, Math.min(innerHeight-180, state.mouseY - 70));
      state.x += (state.targetX - state.x) * 0.18;
      state.y += (state.targetY - state.y) * 0.18;
    } else if (dt < 5000) {
      // Slow drift
      state.floatAngle += 0.01;
      state.targetX = (innerWidth - 190) + Math.sin(state.floatAngle) * 60;
      state.targetY = (innerHeight - 220) + Math.cos(state.floatAngle * 0.7) * 50;
      state.x += (state.targetX - state.x) * 0.05;
      state.y += (state.targetY - state.y) * 0.05;
    } else {
      // Roam around the screen
      const distToRoam = Math.hypot(state.roamTargetX - state.x, state.roamTargetY - state.y);
      if (distToRoam < 30 || now - state.lastRoam > 5000) {
        newRoamTarget();
        state.lastRoam = now;
      }
      state.x += (state.roamTargetX - state.x) * 0.04;
      state.y += (state.roamTargetY - state.y) * 0.04;
    }

    el.style.left = state.x + 'px';
    el.style.top = state.y + 'px';

    // ---- Random Dance ----
    if (now - state.lastDance > 12000 && Math.random() < 0.004 && dt > 3000) {
      dance();
      state.lastDance = now;
    }

    // ---- Random Message ----
    if (now - state.lastMsg > 8000 && Math.random() < 0.005) {
      showMsg(MESSAGES[state.msgIdx % MESSAGES.length]);
      state.msgIdx++;
      state.lastMsg = now;
    }

    requestAnimationFrame(loop);
  }

  // ---------- INIT ----------
  state.x = 120;
  state.y = 200;
  state.roamTargetX = 300;
  state.roamTargetY = 150;
  el.style.left = state.x + 'px';
  el.style.top = state.y + 'px';
  setPose('float');

  setTimeout(() => showMsg("Hi! I'm your guide 👋"), 800);

  loop();
  console.log('✨ Mascot v4 loaded!');
})();
