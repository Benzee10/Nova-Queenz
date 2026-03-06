
<script>
  import { onMount } from 'svelte';
  
  let showCTA = false;
  let scrollProgress = 0;
  
  onMount(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = (scrollTop / docHeight) * 100;
      
      // Show CTA after 60% scroll
      if (scrollProgress > 60 && !showCTA) {
        showCTA = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

{#if showCTA}
  <div class="scroll-cta" class:visible={showCTA}>
    <div class="progress-bar">
      <div class="progress-fill" style="width: {scrollProgress}%"></div>
    </div>
    <div class="cta-content">
      <span class="cta-text">🎯 Enjoying the content?</span>
      <a href="https://redirecting-kappa.vercel.app/" class="cta-btn">
        Get More Premium Content
      </a>
    </div>
  </div>
{/if}

<style>
  .scroll-cta {
    position: fixed;
    bottom: -100px;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(10px);
    padding: 15px 20px;
    z-index: 1000;
    transition: bottom 0.3s ease;
  }
  
  .scroll-cta.visible {
    bottom: 0;
  }
  
  .progress-bar {
    height: 3px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    margin-bottom: 10px;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #ff6b6b, #ee5a24);
    border-radius: 2px;
    transition: width 0.3s ease;
  }
  
  .cta-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
  }
  
  .cta-text {
    color: white;
    font-weight: 500;
  }
  
  .cta-btn {
    background: linear-gradient(45deg, #ff6b6b, #ee5a24);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: bold;
    white-space: nowrap;
    transition: transform 0.2s ease;
  }
  
  .cta-btn:hover {
    transform: scale(1.05);
  }
</style>
