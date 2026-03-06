
<script>
  import { onMount } from 'svelte';

  let showPopup = false;

  const redirectUrl = "https://whatsappad.vercel.app/";

  function checkAndShowPopup() {
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem('popupLastShown');
    
    if (lastShown !== today) {
      showPopup = true;
      localStorage.setItem('popupLastShown', today);
    }
  }

  function handleClick() {
    window.open(redirectUrl, '_blank');
    showPopup = false;
  }

  function handleClose() {
    window.open(redirectUrl, '_blank');
    showPopup = false;
  }

  onMount(() => {
    setTimeout(checkAndShowPopup, 2000); // Show after 2 seconds
  });
</script>

{#if showPopup}
  <div class="popup-overlay" on:click={handleClose} role="button" tabindex="0">
    <div class="popup-content" on:click|stopPropagation={() => {}}>
      <div class="popup-header">
        <button class="close-btn" on:click={handleClose} aria-label="Close">×</button>
      </div>
      
      <div class="popup-body">
        <div class="emoji">🔥</div>
        <h2>Exclusive Content Awaits!</h2>
        <p class="naughty-text">Something <em>special</em> is waiting for you...</p>
        <p class="unlock-text">Ready to unlock the hottest content?</p>
        
        <button class="unlock-btn" on:click={handleClick}>
          <span class="btn-text">🔓 Click Here to Unlock</span>
          <div class="btn-glow"></div>
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    cursor: pointer;
  }

  .popup-content {
    background: linear-gradient(135deg, #ff6b6b, #ff8e8e, #ff6b6b);
    border-radius: 20px;
    padding: 0;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(255, 107, 107, 0.3);
    animation: popupEnter 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    cursor: default;
    overflow: hidden;
    position: relative;
  }

  .popup-header {
    display: flex;
    justify-content: flex-end;
    padding: 15px 15px 0;
  }

  .close-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 24px;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }

  .popup-body {
    padding: 0 30px 30px;
    text-align: center;
    color: white;
  }

  .emoji {
    font-size: 48px;
    margin-bottom: 20px;
    animation: pulse 2s infinite;
  }

  h2 {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 15px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  .naughty-text {
    font-size: 18px;
    margin-bottom: 10px;
    opacity: 0.9;
  }

  .naughty-text em {
    font-style: italic;
    font-weight: bold;
    text-decoration: underline;
  }

  .unlock-text {
    font-size: 16px;
    margin-bottom: 25px;
    opacity: 0.8;
  }

  .unlock-btn {
    background: linear-gradient(45deg, #ff4757, #ff3838);
    border: none;
    padding: 18px 35px;
    border-radius: 50px;
    color: white;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 8px 25px rgba(255, 71, 87, 0.4);
  }

  .unlock-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(255, 71, 87, 0.6);
  }

  .btn-text {
    position: relative;
    z-index: 1;
  }

  .btn-glow {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
  }

  .unlock-btn:hover .btn-glow {
    left: 100%;
  }

  @keyframes popupEnter {
    0% {
      opacity: 0;
      transform: scale(0.5) translateY(-50px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  @media (max-width: 480px) {
    .popup-content {
      margin: 20px;
      max-width: none;
    }
    
    h2 {
      font-size: 24px;
    }
    
    .unlock-btn {
      font-size: 16px;
      padding: 15px 25px;
    }
  }
</style>
