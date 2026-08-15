// Ultimate Mascot - Red-haired schoolgirl with animations
(function() {
  const messages = [
    "Need help choosing? 😊", 
    "Ask anything! ✨", 
    "Free demo available 🎓", 
    "Girls batch too 💁‍♀️", 
    "We're here! 💕"
  ];
  
  let messageIndex = 0;
  let speechTimer = null;
  let isDancing = false;
  let starTrail = [];
  let mouseX = -100;
  let mouseY = -100;
  
  const mascotContainer = document.createElement('div');
  mascotContainer.id = 'ultimate-mascot';
  mascotContainer.style.cssText = `
    position: fixed;
    z-index: 10001;
    pointer-events: none;
    font-size: 24px;
    transition: transform 0.1s ease-out;
    will-change: transform, top, left;
  `;
  
  const bubble = document.createElement('div');
  bubble.id = 'mascot-bubble';
  bubble.textContent = "Hi! Need help?";
  bubble.style.cssText = `
    position: fixed;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 14px;
    padding: 12px 16px;
    font-size: 0.85rem;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, transform 0.3s ease;
    max-width: 240px;
    z-index: 10002;
  `;
  
  function showBubble(text, x, y) {
    if (!bubble) return;
    bubble.textContent = text;
    bubble.style.opacity = '1';
    bubble.style.visibility = 'visible';
    bubble.style.transform = 'translateY(0) scale(1)';
    
    // Position near cursor or mascot
    const bubbleRect = bubble.getBoundingClientRect();
    const adjustX = Math.min(Math.max(x - 120, 10), window.innerWidth - 250);
    const adjustY = Math.min(Math.max(y + 20, 10), window.innerHeight - 100);
    bubble.style.left = adjustX + 'px';
    bubble.style.top = adjustY + 'px';
    
    clearTimeout(speechTimer);
    setTimeout(() => {
      bubble.style.opacity = '0';
      bubble.style.visibility = 'hidden';
    }, 4000);
  }
  
  function createStar() {
    const star = document.createElement('span');
    star.innerHTML = '✨';
    star.style.position = 'fixed';
    star.style.fontSize = Math.random() * 12 + 12 + 'px';
    star.style.left = (Math.random() * 20 - 10) + '%';
    star.style.bottom = '20%';
    star.style.opacity = Math.random();
    star.style.pointerEvents = 'none';
    star.style.transition = 'all 1.5s ease-out';
    star.style.zIndex = '9999';
    
    document.body.appendChild(star);
    
    setTimeout(() => {
      star.style.transform = 'translateY(-100px) rotate(360deg)';
      star.style.opacity = '0';
    }, 10);
    
    setTimeout(() => star.remove(), 1550);
  }
  
  function randomizeExpression() {
    const expressions = ['😊', '😘', '👀', '💖', '✨'];
    return expressions[Math.floor(Math.random() * expressions.length)];
  }
  
  function dance() {
    if (isDancing) return;
    isDancing = true;
    
    let frame = 0;
    const danceInterval = setInterval(() => {
      frame++;
      const bounce = Math.sin(frame * 0.8) * 15;
      const tilt = Math.cos(frame * 0.6) * 10;
      mascotContainer.style.transform = `translate(${tilt}px, ${bounce}px)`;
      
      if (frame > 20) {
        clearInterval(danceInterval);
        isDancing = false;
        mascotContainer.style.transform = '';
      }
    }, 50);
    
    // Show happy expression during dance
    showBubble(randomizeExpression(), mouseX, mouseY);
  }
  
  // Track mouse movement
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    lastMouseTime = Date.now();
  });
  
  let lastMouseTime = Date.now();
  let lastDanceTime = Date.now();
  let lastMessageTime = Date.now();
  
  function animate() {
    const now = Date.now();
    const timeSinceMouse = now - lastMouseTime;
    const timeSinceDance = now - lastDanceTime;
    const timeSinceMessage = now - lastMessageTime;
    
    // Follow cursor smoothly
    if (timeSinceMouse < 1000) {
      const offsetX = (mouseX - 60) - parseInt(mascotContainer.offsetLeft || 0);
      const offsetY = (mouseY - 60) - parseInt(mascotContainer.offsetTop || 0);
      const newX = Math.max(10, Math.min(window.innerWidth - 120, parseFloat(mascotContainer.offsetLeft || 0) + offsetX * 0.1));
      const newY = Math.max(10, Math.min(window.innerHeight - 120, parseFloat(mascotContainer.offsetTop || 0) + offsetY * 0.1));
      mascotContainer.style.left = newX + 'px';
      mascotContainer.style.top = newY + 'px';
      
      // Create star trail
      if (Math.random() < 0.3) {
        createStar();
      }
      
      // Random dance
      if (Math.random() < 0.005 && timeSinceDance > 3000) {
        dance();
        lastDanceTime = now;
      }
      
      // Random messages
      if (Math.random() < 0.002 && timeSinceMessage > 5000) {
        showBubble(messages[messageIndex % messages.length], mouseX, mouseY);
        messageIndex++;
        lastMessageTime = now;
      }
    } else {
      // Float randomly when no mouse activity
      const floatOffset = Math.sin(now * 0.001) * 20;
      const driftOffset = Math.cos(now * 0.0007) * 15;
      const currentTop = parseInt(mascotContainer.offsetTop || 0) + floatOffset;
      const currentLeft = parseInt(mascotContainer.offsetLeft || 0) + driftOffset;
      
      mascotContainer.style.top = Math.min(window.innerHeight - 100, Math.max(10, currentTop)) + 'px';
      mascotContainer.style.left = Math.min(window.innerWidth - 120, Math.max(10, currentLeft)) + 'px';
    }
    
    requestAnimationFrame(animate);
  }
  
  // Add emoji to container
  mascotContainer.textContent = randomizeExpression();
  mascotContainer.style.fontSize = '48px';
  mascotContainer.style.lineHeight = '1';
  
  document.body.appendChild(mascotContainer);
  document.body.appendChild(bubble);
  
  // Start animation loop
  animate();
  
  console.log('Ultimate Mascot activated! ✨');
})();
