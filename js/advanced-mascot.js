// ========================================================
// Ultimate Mascot - Red-haired Schoolgirl
// VS Computer Education
// ========================================================

(function() {
  'use strict';

  // ---------- CONFIG ----------
  const CONFIG = {
    idleMessages: [
      "Need help choosing a course? 😊",
      "We have a girls batch! 💁‍♀️",
      "Free demo class available! 🎓",
      "DCA, ADCA, ADCT, PGDCA — we got 'em!",
      "Tally Prime training is our specialty!",
      "Ask me anything! ✨",
      "Hi there! 👋"
    ],
    expressions: ['😊', '😄', '😘', '💖', '✨', '🤗', '😌'],
    danceDuration: 2500,
    floatCycle: 6000,
    starTrailChance: 0.15
  };

  // ---------- STATE ----------
  let state = {
    mode: 'idle',        // idle | follow | dance | float | sit | lay
    isDancing: false,
    isJumping: false,
    mouseX: window.innerWidth - 180,
    mouseY: window.innerHeight - 180,
    lastMouseTime: 0,
    lastDanceTime: 0,
    lastMessageTime: 0,
    lastExpressionChange: 0,
    expressionIndex: 0,
    messageIndex: 0,
    floatAngle: 0,
    targetX: window.innerWidth - 180,
    targetY: window.innerHeight - 180,
    currentX: window.innerWidth - 180,
    currentY: window.innerHeight - 180
  };

  // ---------- DOM ----------
  const container = document.createElement('div');
  container.id = 'mascot-container';
  container.innerHTML = `
    <div id="mascot-bubble">
      <span id="mascot-bubble-text">Hi! 👋</span>
      <div class="mascot-bubble-tail"></div>
    </div>
    <div id="mascot-body">
      <img src="assets/mascot1.png" alt="Mascot" id="mascot-img" class="mascot-img" draggable="false">
      <div id="mascot-expression">😊</div>
      <div id="mascot-stars"></div>
    </div>
  `;

  // Styles
  const style = document.createElement('style');
  style.textContent = `
    #mascot-container {
      position: fixed;
      z-index: 10001;
      pointer-events: none;
      transition: none;
      will-change: transform;
    }
    #mascot-body {
      position: relative;
      width: 120px;
      height: 160px;
      cursor: pointer;
      pointer-events: all;
      transition: transform 0.3s ease;
    }
    #mascot-body:active {
      transform: scale(0.95);
    }
    .mascot-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      pointer-events: none;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
      transition: filter 0.3s ease;
    }
    #mascot-expression {
      position: absolute;
      top: -5px;
      right: -10px;
      font-size: 28px;
      line-height: 1;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
      animation: expressionPop 0.4s ease;
      transition: opacity 0.3s ease;
    }
    @keyframes expressionPop {
      0% { transform: scale(0); opacity: 0; }
      60% { transform: scale(1.3); }
      100% { transform: scale(1); opacity: 1; }
    }
    #mascot-bubble {
      position: absolute;
      bottom: 155px;
      left: 30px;
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 16px;
      padding: 10px 16px;
      font-size: 0.8rem;
      color: #1e293b;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.35s ease, transform 0.35s ease;
      transform: translateY(8px) scale(0.95);
      max-width: 200px;
      white-space: nowrap;
      pointer-events: none;
      z-index: 10002;
      font-family: system-ui, -apple-system, sans-serif;
    }
    #mascot-bubble.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }
    .mascot-bubble-tail {
      position: absolute;
      bottom: -8px;
      left: 20px;
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid white;
    }
    #mascot-stars {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: visible;
    }
    .star-particle {
      position: absolute;
      font-size: 14px;
      pointer-events: none;
      animation: starFloat 1.2s ease-out forwards;
    }
    @keyframes starFloat {
      0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; }
      100% { transform: translate(var(--tx), var(--ty)) scale(0) rotate(180deg); opacity: 0; }
    }

    /* Dance animation */
    #mascot-container.dancing #mascot-body {
      animation: mascotDance 0.6s ease infinite;
    }
    @keyframes mascotDance {
      0%, 100% { transform: rotate(0deg) translateY(0); }
      25% { transform: rotate(-8deg) translateY(-8px); }
      75% { transform: rotate(8deg) translateY(-8px); }
    }

    /* Jump animation */
    #mascot-container.jumping #mascot-body {
      animation: mascotJump 0.5s ease;
    }
    @keyframes mascotJump {
      0% { transform: translateY(0) scale(1); }
      30% { transform: translateY(-40px) scale(1.1); }
      50% { transform: translateY(-50px) scale(0.95); }
      70% { transform: translateY(-20px) scale(1.05); }
      100% { transform: translateY(0) scale(1); }
    }

    /* Float animation */
    #mascot-container.floating #mascot-body {
      animation: mascotFloat 3s ease-in-out infinite;
    }
    @keyframes mascotFloat {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      33% { transform: translateY(-12px) rotate(-2deg); }
      66% { transform: translateY(-6px) rotate(2deg); }
    }

    /* Wave animation */
    .mascot-img.waving {
      animation: mascotWave 0.8s ease;
    }
    @keyframes mascotWave {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-5deg); }
      75% { transform: rotate(5deg); }
    }

    /* Glow on hover */
    #mascot-body:hover .mascot-img {
      filter: drop-shadow(0 4px 12px rgba(255,100,150,0.35));
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(container);

  // ---------- DOM refs ----------
  const bubble = container.querySelector('#mascot-bubble');
  const bubbleText = container.querySelector('#mascot-bubble-text');
  const mascotImg = container.querySelector('#mascot-img');
  const expressionEl = container.querySelector('#mascot-expression');
  const starsContainer = container.querySelector('#mascot-stars');
  const mascotBody = container.querySelector('#mascot-body');

  // ---------- FUNCTIONS ----------

  function showMessage(text) {
    bubbleText.textContent = text;
    bubble.classList.add('visible');
    clearTimeout(bubble._timer);
    bubble._timer = setTimeout(() => bubble.classList.remove('visible'), 4000);
  }

  function changeExpression() {
    state.expressionIndex = (state.expressionIndex + 1) % CONFIG.expressions.length;
    expressionEl.textContent = CONFIG.expressions[state.expressionIndex];
    // Re-trigger animation
    expressionEl.style.animation = 'none';
    requestAnimationFrame(() => {
      expressionEl.style.animation = 'expressionPop 0.4s ease';
    });
  }

  function spawnStars(count = 3) {
    for (let i = 0; i < count; i++) {
      const star = document.createElement('span');
      star.className = 'star-particle';
      star.textContent = ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)];
      star.style.left = (20 + Math.random() * 60) + '%';
      star.style.top = (10 + Math.random() * 50) + '%';
      const tx = (Math.random() - 0.5) * 80;
      const ty = -40 - Math.random() * 60;
      star.style.setProperty('--tx', tx + 'px');
      star.style.setProperty('--ty', ty + 'px');
      starsContainer.appendChild(star);
      setTimeout(() => star.remove(), 1200);
    }
  }

  function dance() {
    if (state.isDancing) return;
    state.isDancing = true;
    container.classList.add('dancing');
    changeExpression();
    spawnStars(5);
    showMessage(['💃 Dance time!', '🎶 La la la!', '😊 Feeling good!'][Math.floor(Math.random() * 3)]);
    setTimeout(() => {
      container.classList.remove('dancing');
      state.isDancing = false;
    }, CONFIG.danceDuration);
  }

  function jump() {
    if (state.isJumping) return;
    state.isJumping = true;
    container.classList.add('jumping');
    changeExpression();
    spawnStars(4);
    setTimeout(() => {
      container.classList.remove('jumping');
      state.isJumping = false;
    }, 500);
  }

  function wave() {
    mascotImg.classList.add('waving');
    setTimeout(() => mascotImg.classList.remove('waving'), 800);
  }

  function startFloat() {
    container.classList.add('floating');
    state.mode = 'float';
  }

  function stopFloat() {
    container.classList.remove('floating');
    state.mode = 'idle';
  }

  // ---------- MOUSE TRACKING ----------
  document.addEventListener('mousemove', (e) => {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;
    state.lastMouseTime = Date.now();
    state.mode = 'follow';
    stopFloat();
  });

  // ---------- CLICK ----------
  mascotBody.addEventListener('click', (e) => {
    e.stopPropagation();
    jump();
    showMessage(CONFIG.idleMessages[state.messageIndex % CONFIG.idleMessages.length]);
    state.messageIndex++;
  });

  // ---------- MAIN LOOP ----------
  function update() {
    const now = Date.now();
    const timeSinceMouse = now - state.lastMouseTime;
    const timeSinceDance = now - state.lastDanceTime;
    const timeSinceMessage = now - state.lastMessageTime;

    // Follow cursor
    if (timeSinceMouse < 800) {
      const idealX = state.mouseX - 60;
      const idealY = state.mouseY - 80;
      state.targetX = Math.max(10, Math.min(window.innerWidth - 130, idealX));
      state.targetY = Math.max(10, Math.min(window.innerHeight - 170, idealY));
      state.currentX += (state.targetX - state.currentX) * 0.12;
      state.currentY += (state.targetY - state.currentY) * 0.12;
      container.style.left = state.currentX + 'px';
      container.style.top = state.currentY + 'px';

      // Star trail while moving
      if (Math.random() < CONFIG.starTrailChance) spawnStars(1);
    } else {
      // Idle / float around
      if (timeSinceMouse > 3000 && state.mode !== 'float') {
        startFloat();
        // Set random target for floating
        state.floatAngle += 0.02;
        const floatRadius = 40;
        state.targetX = window.innerWidth - 180 + Math.sin(state.floatAngle) * floatRadius;
        state.targetY = window.innerHeight - 180 + Math.cos(state.floatAngle * 0.7) * floatRadius;
      }

      if (state.mode === 'float') {
        state.floatAngle += 0.015;
        const floatRadius = 50;
        state.targetX = window.innerWidth - 180 + Math.sin(state.floatAngle) * floatRadius;
        state.targetY = window.innerHeight - 180 + Math.cos(state.floatAngle * 0.7) * floatRadius;
        state.currentX += (state.targetX - state.currentX) * 0.05;
        state.currentY += (state.targetY - state.currentY) * 0.05;
        container.style.left = state.currentX + 'px';
        container.style.top = state.currentY + 'px';
      }
    }

    // Random dance (when idle)
    if (timeSinceDance > 15000 && Math.random() < 0.003) {
      dance();
      state.lastDanceTime = now;
    }

    // Random messages
    if (timeSinceMessage > 8000 && Math.random() < 0.004) {
      showMessage(CONFIG.idleMessages[state.messageIndex % CONFIG.idleMessages.length]);
      state.messageIndex++;
      state.lastMessageTime = now;
    }

    // Random expression change
    if (now - state.lastExpressionChange > 12000) {
      changeExpression();
      state.lastExpressionChange = now;
    }

    requestAnimationFrame(update);
  }

  // ---------- INIT ----------
  // Initial position: bottom-right
  state.currentX = window.innerWidth - 180;
  state.currentY = window.innerHeight - 200;
  container.style.left = state.currentX + 'px';
  container.style.top = state.currentY + 'px';

  // Initial wave and message
  setTimeout(() => {
    wave();
    showMessage("Hi! I'm your guide 👋");
  }, 500);

  // Start loop
  state.lastExpressionChange = Date.now();
  update();

  console.log('✨ Ultimate Mascot loaded!');
})();
