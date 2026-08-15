// ========================================================
// Mascot v5 - Chill, Draggable, Stays Out of the Way
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

  const POSES_CHILL = ['float','float2','sit','lay'];
  const MESSAGES = [
    "Need help? 😊",
    "Girls batch available 💁‍♀️",
    "Free demo class 🎓",
    "DCA, ADCA, ADCT, PGDCA ✨",
    "Tally Prime 💪",
    "Hi there! 👋"
  ];

  let state = {
    x: window.innerWidth - 180,
    y: window.innerHeight - 220,
    targetX: 0, targetY: 0,
    mouseX: 0, mouseY: 0,
    lastMouse: Date.now(),
    lastPoseChange: Date.now(),
    lastMsg: Date.now() + 2000,
    lastDance: Date.now() + 15000,
    dancing: false,
    jumping: false,
    currentPose: 'float',
    floatAngle: Math.random() * Math.PI * 2,
    isSleeping: false,
    // Drag state
    dragging: false,
    dragOffsetX: 0,
    dragOffsetY: 0,
    dragStartTime: 0,
    // Wander
    wanderTarget: { x: 0, y: 0 },
    wanderTimer: 0,
    // Corner preference
    corner: 'br' // br = bottom-right
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
      touch-action: none;
    }
    #mascot-body {
      position: relative;
      width: 90px;
      height: 130px;
      cursor: grab;
      pointer-events: all;
      transition: width 0.3s ease, height 0.3s ease;
    }
    #mascot-body:active { cursor: grabbing; }
    #mascot-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      pointer-events: none;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.12));
      transition: filter 0.3s, transform 0.2s;
    }
    #mascot-body:active #mascot-img {
      transform: scale(0.92);
    }
    #mascot-body:hover #mascot-img {
      filter: drop-shadow(0 4px 20px rgba(255,80,120,0.35)) brightness(1.05);
    }
    #mascot-bubble {
      position: absolute;
      bottom: 125px;
      left: 0;
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 14px;
      padding: 8px 14px;
      font-size: 0.75rem;
      color: #1e293b;
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s, transform 0.3s;
      transform: translateY(8px) scale(0.93);
      max-width: 200px;
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
      left: 18px;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid white;
    }
    /* Animations - all subtle now */
    .mascot-float #mascot-body { animation: floatAnim 4s ease-in-out infinite; }
    @keyframes floatAnim {
      0%, 100% { transform: translateY(0) rotate(0); }
      50% { transform: translateY(-10px) rotate(3deg); }
    }
    .mascot-sit #mascot-body { animation: sitAnim 2s ease-in-out infinite; }
    @keyframes sitAnim {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-2px); }
    }
    .mascot-lay {
      width: 120px !important;
      height: 80px !important;
    }
    .mascot-lay #mascot-body { animation: layBreath 3s ease-in-out infinite; }
    @keyframes layBreath {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-2px) scale(1.01); }
    }
    .mascot-wave #mascot-body { animation: waveAnim 1.2s ease-in-out infinite; }
    @keyframes waveAnim {
      0%, 100% { transform: rotate(0); }
      50% { transform: rotate(-8deg); }
    }
    .mascot-sleep #mascot-body { animation: sleepBreath 4s ease-in-out infinite; }
    @keyframes sleepBreath {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-2px); }
    }
    .mascot-dance #mascot-body { animation: danceAnim 0.5s ease infinite; }
    @keyframes danceAnim {
      0%, 100% { transform: rotate(0) translateY(0); }
      25% { transform: rotate(-8deg) translateY(-8px); }
      75% { transform: rotate(8deg) translateY(-8px); }
    }
    .mascot-jump #mascot-body { animation: jumpAnim 0.4s ease; }
    @keyframes jumpAnim {
      0% { transform: translateY(0) scale(1); }
      30% { transform: translateY(-30px) scale(1.08); }
      50% { transform: translateY(-35px) scale(0.95); }
      100% { transform: translateY(0) scale(1); }
    }
    .star-particle {
      position: fixed; font-size: 12px; pointer-events: none; z-index: 9999;
      animation: starFly 1s ease-out forwards;
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
  const body = el.querySelector('#mascot-body');

  // ---------- HELPERS ----------
  function setPose(pose) {
    if (state.currentPose === pose && pose !== 'float' && pose !== 'float2') return;
    state.currentPose = pose;
    el.classList.remove('mascot-float','mascot-sit','mascot-lay','mascot-wave','mascot-sleep');
    img.src = POSES[pose] || POSES.float;
    body.style.width = ''; body.style.height = '';
    switch(pose) {
      case 'float': case 'float2': el.classList.add('mascot-float'); break;
      case 'sit': el.classList.add('mascot-sit'); body.style.width='100px'; body.style.height='120px'; break;
      case 'lay': el.classList.add('mascot-lay'); break;
      case 'wave': el.classList.add('mascot-wave'); break;
      case 'sleep': el.classList.add('mascot-sleep'); break;
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
      s.textContent = ['✨','⭐','💫'][Math.floor(Math.random()*3)];
      s.style.left = (state.x + 20 + Math.random()*50) + 'px';
      s.style.top = (state.y + 10 + Math.random()*30) + 'px';
      s.style.setProperty('--sx', (Math.random()-0.5)*60 + 'px');
      s.style.setProperty('--sy', (-30-Math.random()*40) + 'px');
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1000);
    }
  }

  function dance() {
    if (state.dancing) return;
    state.dancing = true;
    el.classList.add('mascot-dance');
    spawnStars(4);
    showMsg(['💃 Dance!','🎶 La la!','✨✨'][Math.floor(Math.random()*3)]);
    setTimeout(() => { el.classList.remove('mascot-dance'); state.dancing = false; }, 2000);
  }

  function jump() {
    if (state.jumping) return;
    state.jumping = true;
    el.classList.add('mascot-jump');
    spawnStars(3);
    setTimeout(() => { el.classList.remove('mascot-jump'); state.jumping = false; }, 400);
  }

  function randomChillPose() {
    return POSES_CHILL[Math.floor(Math.random() * POSES_CHILL.length)];
  }

  // ---------- DRAG (mouse + touch) ----------
  function startDrag(clientX, clientY) {
    state.dragging = true;
    state.dragOffsetX = clientX - state.x;
    state.dragOffsetY = clientY - state.y;
    state.dragStartTime = Date.now();
    el.style.transition = 'none';
    el.classList.remove('mascot-float','mascot-sit','mascot-lay','mascot-wave','mascot-sleep');
    img.style.transform = 'scale(0.92)';
  }

  function moveDrag(clientX, clientY) {
    if (!state.dragging) return;
    state.x = Math.max(0, Math.min(window.innerWidth - 140, clientX - state.dragOffsetX));
    state.y = Math.max(0, Math.min(window.innerHeight - 190, clientY - state.dragOffsetY));
    el.style.left = state.x + 'px';
    el.style.top = state.y + 'px';
  }

  function endDrag() {
    if (!state.dragging) return;
    state.dragging = false;
    img.style.transform = '';
    const dragDuration = Date.now() - state.dragStartTime;
    // If dragged, don't wander back
    state.lastMouse = Date.now();
    // Let her settle
    setPose('float');
    spawnStars(2);
    showMsg('Here is fine! 😊');
  }

  // Mouse events
  body.addEventListener('mousedown', e => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  });
  document.addEventListener('mousemove', e => {
    if (state.dragging) moveDrag(e.clientX, e.clientY);
    else {
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;
      state.lastMouse = Date.now();
      state.isSleeping = false;
    }
  });
  document.addEventListener('mouseup', () => { if (state.dragging) endDrag(); });

  // Touch events
  body.addEventListener('touchstart', e => {
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  }, { passive: true });
  document.addEventListener('touchmove', e => {
    if (state.dragging) {
      const t = e.touches[0];
      moveDrag(t.clientX, t.clientY);
    }
  }, { passive: true });
  document.addEventListener('touchend', () => { if (state.dragging) endDrag(); });

  // Click for jump
  body.addEventListener('click', e => {
    e.stopPropagation();
    if (!state.dragging) {
      jump();
      showMsg(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
    }
  });

  // ---------- MAIN LOOP ----------
  function loop() {
    const now = Date.now();
    const dt = now - state.lastMouse;

    // --- Movement ---
    if (state.dragging) {
      // Don't move while dragging
    } else if (dt < 2000) {
      // Slight follow - offset to not block content
      state.targetX = Math.max(10, Math.min(innerWidth-140, state.mouseX - 80));
      state.targetY = Math.max(10, Math.min(innerHeight-190, state.mouseY - 130));
      state.x += (state.targetX - state.x) * 0.08;
      state.y += (state.targetY - state.y) * 0.08;
    } else {
      // Gentle drift near bottom-right corner
      const targetX = window.innerWidth - 190 + Math.sin(now * 0.001) * 60;
      const targetY = window.innerHeight - 230 + Math.cos(now * 0.0007) * 40;
      state.x += (targetX - state.x) * 0.02;
      state.y += (targetY - state.y) * 0.02;
    }

    el.style.left = state.x + 'px';
    el.style.top = state.y + 'px';

    // --- Pose changes every 6-12s (chill pace) ---
    if (!state.dragging && !state.dancing && now - state.lastPoseChange > 6000 + Math.random() * 6000) {
      state.lastPoseChange = now;

      if (dt > 30000 && Math.random() < 0.3) {
        state.isSleeping = true;
        setPose('sleep');
      } else if (state.isSleeping && dt < 30000) {
        state.isSleeping = false;
        setPose(randomChillPose());
      } else if (!state.isSleeping) {
        setPose(randomChillPose());
      }
    }

    // --- Random dance (rare - once per 30s) ---
    if (now - state.lastDance > 30000 && Math.random() < 0.002 && dt > 5000 && !state.dragging) {
      dance();
      state.lastDance = now;
    }

    // --- Random msg (chill) ---
    if (now - state.lastMsg > 12000 && Math.random() < 0.002) {
      showMsg(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
      state.lastMsg = now;
    }

    requestAnimationFrame(loop);
  }

  // ---------- INIT ----------
  state.x = window.innerWidth - 180;
  state.y = window.innerHeight - 220;
  el.style.left = state.x + 'px';
  el.style.top = state.y + 'px';
  setPose('float');

  setTimeout(() => showMsg("Hi! I'm your guide 👋"), 1000);

  loop();
  console.log('✨ Mascot v5 - chill & draggable');
})();
