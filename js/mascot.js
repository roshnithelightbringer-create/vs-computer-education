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

  // Scroll reveal (backup in case gate dismisses)
  function onScroll() {
    if (isVisible) return;
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 180) {
      forceReveal();
    }
  }

  // Periodic messages
  let messageInterval = null;
  function startPeriodicMessages() {
    if (messageInterval) return;
    messageInterval = setInterval(showMessage, 8000);
  }

  // Core reveal function
  function forceReveal() {
    if (isVisible) return;
    isVisible = true;
    mascot.classList.add('revealed');
    // Welcome wave
    setTimeout(() => {
      mascot.classList.add('wave-active');
      setTimeout(() => mascot.classList.remove('wave-active'), 1200);
    }, 600);
    // First message
    setTimeout(showMessage, 1400);
    // Periodic messages
    setTimeout(startPeriodicMessages, 3000);
  }

  // Reveal immediately — gate overlay is at z-index 9999,
  // mascot is at 10000, so she floats on top of the dark overlay
  setTimeout(forceReveal, 100);

  // Also try on scroll as fallback
  window.addEventListener('scroll', onScroll, { passive: true });

  // Tap to jump
  mascot.addEventListener('click', jump);
  mascot.addEventListener('touchstart', function(e) {
    e.preventDefault();
    jump();
  }, { passive: false });
})();
