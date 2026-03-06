<script>
  import { onMount } from 'svelte';

  let showPopup = false;
  let hasTriggered = false;
  let mouseLeaveHandler;

  const redirectUrl = "https://whatsappad.vercel.app/";

  function detectExitIntent(e) {
    // Trigger when mouse leaves the top of the viewport
    if (e.clientY <= 0 && !hasTriggered && !showPopup) {
      showPopup = true;
      hasTriggered = true;
      // Remove the event listener after triggering once
      document.removeEventListener('mouseleave', mouseLeaveHandler);
    }
  }

  function handleClick() {
    window.open(redirectUrl, '_blank');
    showPopup = false;
  }

  function handleClose() {
    showPopup = false;
  }

  onMount(() => {
    // Add delay before activating exit intent detection
    setTimeout(() => {
      mouseLeaveHandler = detectExitIntent;
      document.addEventListener('mouseleave', mouseLeaveHandler);
    }, 3000); // Wait 3 seconds before activating

    return () => {
      if (mouseLeaveHandler) {
        document.removeEventListener('mouseleave', mouseLeaveHandler);
      }
    };
  });
</script>

{#if showPopup}
  <div class="exit-popup-overlay" on:click={handleClose} role="button" tabindex="0">
    <div class="exit-popup-content" on:click|stopPropagation={() => {}}>
      <div class="exit-popup-header">
        <button class="exit-close-btn" on:click={handleClose} aria-label="Close">×</button>
      </div>

      <div class="exit-popup-body">
        <div class="exit-emoji">⚡</div>
        <h2>Wait! Don't Miss Out!</h2>
        <p class="exit-headline">You're about to miss something <em>incredible</em>...</p>
        <p class="exit-subtext">Get instant access to exclusive content that 99% of people never see!</p>

        <button class="exit-unlock-btn" on:click={handleClick}>
          <span class="exit-btn-text">🚀 Get Instant Access</span>
          <div class="exit-btn-shine"></div>
        </button>

        <p class="exit-warning">This offer disappears when you leave!</p>
      </div>
    </div>
  </div>
{/if}

<style>
  .exit-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    cursor: pointer;
  }

  .exit-popup-content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 25px;
    padding: 0;
    max-width: 450px;
    width: 90%;
    box-shadow: 0 25px 80px rgba(102, 126, 234, 0.4);
    animation: exitPopupBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    cursor: default;
    overflow: hidden;
    position: relative;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

  .exit-popup-header {
    display: flex;
    justify-content: flex-end;
    padding: 20px 20px 0;
  }

  .exit-close-btn {
    background: rgba(255, 255, 255, 0.15);
    border: none;
    color: white;
    font-size: 28px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .exit-close-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: rotate(90deg) scale(1.1);
  }

  .exit-popup-body {
    padding: 0 35px 35px;
    text-align: center;
    color: white;
  }

  .exit-emoji {
    font-size: 56px;
    margin-bottom: 25px;
    animation: exitPulse 2s infinite;
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
  }

  h2 {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 20px;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
    background: linear-gradient(45deg, #fff, #f0f0f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .exit-headline {
    font-size: 20px;
    margin-bottom: 15px;
    opacity: 0.95;
    font-weight: 500;
  }

  .exit-headline em {
    font-style: italic;
    font-weight: bold;
    color: #FFD700;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }

  .exit-subtext {
    font-size: 16px;
    margin-bottom: 30px;
    opacity: 0.85;
    line-height: 1.4;
  }

  .exit-unlock-btn {
    background: linear-gradient(45deg, #ff6b6b, #ee5a24);
    border: none;
    padding: 20px 40px;
    border-radius: 60px;
    color: white;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.4s ease;
    position: relative;
    overflow: hidden;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
    margin-bottom: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .exit-unlock-btn:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 15px 40px rgba(255, 107, 107, 0.6);
    background: linear-gradient(45deg, #ff5252, #d84315);
  }

  .exit-btn-text {
    position: relative;
    z-index: 1;
  }

  .exit-btn-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.6s ease;
  }

  .exit-unlock-btn:hover .exit-btn-shine {
    left: 100%;
  }

  .exit-warning {
    font-size: 14px;
    color: #FFD700;
    font-weight: bold;
    margin: 0;
    animation: exitBlink 2s infinite;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  }

  @keyframes exitPopupBounce {
    0% {
      opacity: 0;
      transform: scale(0.3) translateY(-100px) rotate(-10deg);
    }
    50% {
      transform: scale(1.05) translateY(10px) rotate(2deg);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0) rotate(0deg);
    }
  }

  @keyframes exitPulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.15);
    }
  }

  @keyframes exitBlink {
    0%, 50% {
      opacity: 1;
    }
    51%, 100% {
      opacity: 0.6;
    }
  }

  @media (max-width: 480px) {
    .exit-popup-content {
      margin: 20px;
      max-width: none;
    }

    h2 {
      font-size: 26px;
    }

    .exit-unlock-btn {
      font-size: 18px;
      padding: 18px 30px;
    }

    .exit-headline {
      font-size: 18px;
    }

    .exit-emoji {
      font-size: 48px;
    }
  }
</style>