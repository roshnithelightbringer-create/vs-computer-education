// ========================================================
// Ultimate Mascot v4 - Free Anime Character
// VS Computer Education
// ========================================================

(function() {
  'use strict';

  const POSES = {
    float:  'assets/mascot-float.png',
    float2: 'assets/mascot-float2.png',
    sit:    'assets/mascot-sit.png',
    lay:    'assets/mascot-lay.png',
    wave:   'assets/mascot-wave.png',
    sleep:  'assets/mascot-sleep.png'
  };

  const POSE_LIST = ['float','float2','sit','lay','wave','sleep'];

  const MESSAGES = [
    "Need help choosing a course? 😊",
    "Girls batch available! 💁‍♀️",
    "Free demo class 🎓",
    "DCA, ADCA, ADCT, PGDCA ✨",
    "Tally Prime is our specialty! 💪",
    "Hi there! 👋"
  ];

  let state = {
    x: window.innerWidth * 0.7,
    y: window.innerHeight * 0.6,
    targetX: 0, targetY: 0,
    mouseX: 0, mouseY: 0,
    lastMouse: Date.now(),
    lastPoseChange: Date.now(),
    lastMsg: Date.now() + 2000,
    lastDance: Date.now() + 10000,
    lastFloatSwitch: Date.now(),
    dancing: false,
    jumping: false,
    currentPose: 'float',
    floatAngle: Math.random() * Math.PI * 2,
    isSleeping: false,
    hoveredElement: null,
    pointingAt: null,
    wanderTarget: { x: 0, y: 0 },
    wanderTimer: 0
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
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.12));
      transition: filter 0.3s, transform 0.3s;
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
      transition: opacity 0.3s, transform 0.3s;
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
      25% { transform: rotate(-14deg) translateY(-14px); }
      75% { transform: rotate(14deg) translateY(-14px); }
    }
    .mascot-jump #mascot-body { animation: jumpAnim 0.5s ease; }
    @keyframes jumpAnim {
      0% { transform: translateY(0) scale(1); }
      30% { transform: translateY(-50px) scale(1.1); }
      50% { transform: translateY(-60px) scale(0.95); }
      70% { transform: translateY(-20px) scale(1.05); }
      100% { transform: translateY(0) scale(1); }
    }
    .mascot-float #mascot-body { animation: floatAnim 3s ease-in-out infinite; }
    @keyframes floatAnim {
      0%, 100% { transform: translateY(0) rotate(0); }
      33% { transform: translateY(-14px) rotate(-3deg); }
      66% { transform: translateY(-7px) rotate(3deg); }
    }
    .mascot-sit #mascot-body { animation: sitAnim 1.5s ease-in-out infinite; }
    @keyframes sitAnim {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    .mascot-lay {
      width: 130px !important;
      height: 90px !important;
    }
    .mascot-lay #mascot-body { animation: layBreath 2.5s ease-in-out infinite; }
    @keyframes layBreath {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-3px) scale(1.01); }
    }
    .mascot-wave #mascot-body { animation: waveAnim 0.7s ease-in-out infinite; }
    @keyframes waveAnim {
      0%, 100% { transform: rotate(0) translateY(0); }
      25% { transform: rotate(-12deg) translateY(-5px); }
      75% { transform: rotate(12deg) translateY(-5px); }
    }
    .mascot-sleep #mascot-body { animation: sleepBreath 3s ease-in-out infinite; }
    @keyframes sleepBreath {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-2px) scale(1.02); }
    }
    .mascot-point #mascot-body { animation: pointAnim 1.2s ease-in-out infinite; }
    @keyframes pointAnim {
      0%, 100% { transform: translateX(0); }
      50% { transform: translateX(8px) rotate(5deg); }
    }
    .star-particle {
      position: fixed; font-size: 14px; pointer-events: none; z-index: 9999;
      animation: starFly 1.2s ease-out forwards;
    }
    @keyframes starFly {
      0% { transform: translate(0,0) scale(1) rotate(0); opacity: 1; }
      100% { transform: translate(var(--sx), var(--sy)) scale(0) rotate(180deg); opacity: 0; }
    }
    .zzz-particle {
      position: fixed; font-size: 16px; pointer-events: none; z-index: 9999;
      animation: zzzFloat 2s ease-out forwards;
    }
    @keyframes zzzFloat {
      0% { transform: translate(0,0) scale(0.5); opacity: 0; }
      20% { opacity: 1; }
      100% { transform: translate(20px, -50px) scale(1.3); opacity: 0; }
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
    el.classList.remove('mascot-float','mascot-sit','mascot-lay','mascot-wave','mascot-sleep','mascot-point');
    img.src = POSES[pose] || POSES.float;
    switch(pose) {
      case 'float': case 'float2':
        el.classList.add('mascot-float');
        body.style.width = '100px'; body.style.height = '140px';
        break;
      case 'sit':
        el.classList.add('mascot-sit');
        body.style.width = '110px'; body.style.height = '130px';
        break;
      case 'lay':
        el.classList.add('mascot-lay');
        body.style.width = '130px'; body.style.height = '90px';
        break;
      case 'wave':
        el.classList.add('mascot-wave');
        body.style.width = '100px'; body.style.height = '140px';
        break;
      case 'sleep':
        el.classList.add('mascot-sleep');
        body.style.width = '100px'; body.style.height = '130px';
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
    spawnStars(6);
    showMsg(['💃 Dance!','🎶 La la la!','😊✨','Feeling good!','✨💖✨'][Math.floor(Math.random()*5)]);
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

  function randomPose() {
    const poses = ['float','float2','sit','lay','wave'];
    return poses[Math.floor(Math.random() * poses.length)];
  }

  function setNewWanderTarget() {
    const margin = 100;
    state.wanderTarget.x = margin + Math.random() * (window.innerWidth - margin * 2 - 140);
    state.wanderTarget.y = margin + Math.random() * (window.innerHeight - margin * 2 - 190);
    state.wanderTimer = 3000 + Math.random() * 5000;
  }

  // ---------- EVENTS ----------
  document.addEventListener('mousemove', e => {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;
    state.lastMouse = Date.now();
    state.isSleeping = false;
  });

  body.addEventListener('click', e => {
    e.stopPropagation();
    jump();
    showMsg(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
  });

  // ---------- MAIN LOOP ----------
  function loop() {
    const now = Date.now();
    const dt = now - state.lastMouse;

    // --- WANDER / FOLLOW ---
    if (dt < 1000) {
      // Follow cursor (offset slightly so she's not blocking)
      state.targetX = Math.max(10, Math.min(innerWidth-140, state.mouseX - 30));
      state.targetY = Math.max(10, Math.min(innerHeight-190, state.mouseY - 100));
      state.x += (state.targetX - state.x) * 0.12;
      state.y += (state.targetY - state.y) * 0.12;
    } else {
      // Wander around freely
      if (state.wanderTimer <= 0) setNewWanderTarget();
      state.wanderTimer -= 16;
      state.x += (state.wanderTarget.x - state.x) * 0.03;
      state.y += (state.wanderTarget.y - state.y) * 0.03;
      // Extra float motion
      state.floatAngle += 0.01;
      state.x += Math.sin(state.floatAngle) * 0.3;
      state.y += Math.cos(state.floatAngle * 0.7) * 0.3;
    }

    el.style.left = state.x + 'px';
    el.style.top = state.y + 'px';

    // --- POSE CHANGES (every 4-8 seconds, fast!) ---
    if (!state.dancing && now - state.lastPoseChange > 4000 + Math.random() * 4000) {
      state.lastPoseChange = now;

      if (state.isSleeping) {
        setPose('sleep');
        if (Math.random() < 0.05) spawnZzz();
      } else if (dt > 25000 && Math.random() < 0.3) {
        state.isSleeping = true;
        setPose('sleep');
      } else {
        // Pick random pose
        const newPose = randomPose();
        setPose(newPose);
        // Occasionally switch between float poses
        if (newPose === 'float' || newPose === 'float2') {
          state.lastFloatSwitch = now;
        }
        // Random message sometimes
        if (Math.random() < 0.2) {
          showMsg(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
        }
      }
    }

    // --- RANDOM DANCE ---
    if (now - state.lastDance > 12000 && Math.random() < 0.004 && dt > 3000) {
      dance();
      state.lastDance = now;
    }

    // --- RANDOM MSG ---
    if (now - state.lastMsg > 8000 && Math.random() < 0.003) {
      showMsg(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
      state.lastMsg = now;
    }

    requestAnimationFrame(loop);
  }

  // ---------- INIT ----------
  state.x = window.innerWidth * 0.7;
  state.y = window.innerHeight * 0.6;
  el.style.left = state.x + 'px';
  el.style.top = state.y + 'px';
  setPose('float');
  setNewWanderTarget();

  setTimeout(() => showMsg("Hi! I'm your guide 👋"), 1000);

  loop();
  console.log('✨ Mascot v4 loaded!');
})();
