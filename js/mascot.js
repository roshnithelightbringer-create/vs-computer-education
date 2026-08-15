// VS Computer Education - Mascot Assistant
(function() {
  const messages = [
    "Need help choosing a course? 😊",
    "Chat with us on WhatsApp anytime!",
    "We have a special girls batch too! 💁‍♀️",
    "DCA, ADCA, ADCT, PGDCA — we got 'em all!",
    "Free demo class available! 🎓",
    "Tally Prime training is our specialty!",
    "Ask us anything about our courses! ✨"
  ];
  let messageIndex = 0;
  let speechTimer = null;
  let isJumping = false;
  let isVisible = false;

  const mascot = document.getElementById('site-mascot');
  const bubble = document.getElementById('mascot-bubble');
  const bubbleText = document.getElementById('mascot-bubble-text');
  const body = document.getElementById('mascot-body');

  if (!mascot) return;

  function showMessage() {
    if (!bubble || !bubbleText) return;
    bubbleText.textContent = messages[messageIndex % messages.length];
    messageIndex++;
    bubble.classList.add('visible');
    clearTimeout(speechTimer);
    speechTimer = setTimeout(() => {
      bubble.classList.remove('visible');
    }, 4500);
  }

  function jump() {
    if (isJumping) return;
    isJumping = true;
    mascot.classList.add('mascot-jump');
    showMessage();
    setTimeout(() => {
      mascot.classList.remove('mascot-jump');
      isJumping = false;
    }, 600);
  }

  // Scroll reveal
  let scrollRAF = null;
  function onScroll() {
    if (scrollRAF) return;
    scrollRAF = requestAnimationFrame(() => {
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > 180 && !isVisible) {
        isVisible = true;
        mascot.classList.add('revealed');
        // Welcome wave + first message
        setTimeout(() => {
          mascot.classList.add('wave-active');
          setTimeout(() => mascot.classList.remove('wave-active'), 1200);
        }, 800);
        // First message after wave
        setTimeout(showMessage, 2000);
        // Start periodic messages
        startPeriodicMessages();
      }
      scrollRAF = null;
    });
  }

  let messageInterval = null;
  function startPeriodicMessages() {
    if (messageInterval) return;
    messageInterval = setInterval(showMessage, 8000);
  }

  // Click handler
  mascot.addEventListener('click', jump);

  // Listen for scroll
  window.addEventListener('scroll', onScroll, { passive: true });

  // Check initial position immediately + after gate dismisses
  onScroll();
  // Retry after a short delay in case body overflow was hiding scroll
  setTimeout(onScroll, 500);
  setTimeout(onScroll, 1500);
  // Also watch for gate dismissal
  const gateObserver = new MutationObserver(() => {
    if (document.getElementById('studentGate')?.style?.display === 'none' || 
        !document.getElementById('studentGate')) {
      onScroll();
    }
  });
  const gate = document.getElementById('studentGate');
  if (gate) {
    gateObserver.observe(gate, { attributes: true, attributeFilter: ['style'] });
  }

  // Expose so we can clean up
  window.__mascotCleanup = function() {
    window.removeEventListener('scroll', onScroll);
    clearInterval(messageInterval);
    clearTimeout(speechTimer);
  };
})();
