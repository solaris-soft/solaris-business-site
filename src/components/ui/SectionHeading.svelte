<script lang="ts">
  import { onMount } from 'svelte';

  const { id, title, subtitle } = $props();

  let headingElement: HTMLElement;
  let isVisible = $state(false);

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" }
    );

    if (headingElement) {
      observer.observe(headingElement);
    }

    return () => observer.disconnect();
  });
</script>

<div 
  class="section-heading"
  class:visible={isVisible}
  bind:this={headingElement}
  role="presentation"
>
  <h2
    class="heading"
    id={id}
  >
    <div class="line">
      <div class="line-gradient"></div>
      <div class="line-glow"></div>
    </div>

    <div class="title-wrapper">
      <span class="title">
        {title}
      </span>
      
      <span 
        class="title-glow"
        aria-hidden="true"
      >
        {title}
      </span>
    </div>
  </h2>

  {#if subtitle}
    <p class="subtitle">
      {subtitle}
    </p>
  {/if}
</div>

<style>
  .section-heading {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 4rem;
    position: relative;
    transform: translateZ(0);
    will-change: transform;
  }

  .heading {
    font-size: 1.5rem;
    line-height: 2rem;
    letter-spacing: 0.2em;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 700;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .line {
    height: 3px;
    width: 0;
    position: relative;
    overflow: hidden;
    transition: width 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .visible .line {
    width: 60px;
  }

  .section-heading:hover .line {
    width: 80px;
  }

  .line-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, #ff3d00, #ff6b00, #ff8a00);
    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .line-glow {
    position: absolute;
    inset: 0;
    background: #ff3d00;
    filter: blur(3px);
    opacity: 0;
    transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .visible .line-glow {
    opacity: 0.4;
  }

  .title-wrapper {
    position: relative;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .visible .title-wrapper {
    opacity: 1;
    transform: translateY(0);
  }

  .section-heading:hover .title-wrapper {
    transform: scale(1.05);
  }

  .title {
    position: relative;
    z-index: 10;
    background: linear-gradient(to right, white, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .title-glow {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, white, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    filter: blur(2px);
    opacity: 0;
    transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .visible .title-glow {
    opacity: 0.5;
  }

  .subtitle {
    font-size: 1.125rem;
    line-height: 1.75rem;
    color: rgba(255, 255, 255, 0.7);
    max-width: 48rem;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .visible .subtitle {
    opacity: 1;
    transform: translateY(0);
  }

  .section-heading:hover .subtitle {
    color: rgba(255, 255, 255, 0.8);
  }

  @media (min-width: 768px) {
    .heading {
      font-size: 2.25rem;
      line-height: 2.5rem;
    }
    .subtitle {
      font-size: 1.25rem;
      line-height: 1.75rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .line,
    .title-wrapper,
    .subtitle,
    .line-glow,
    .title-glow {
      transition: none !important;
    }
    .line-gradient {
      animation: none !important;
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
</style> 