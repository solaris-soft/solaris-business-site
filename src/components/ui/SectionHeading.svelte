<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { cubicOut, elasticOut } from 'svelte/easing';

  const { id, title, subtitle } = $props();

  let headingElement: HTMLElement;
  let lineElement: HTMLElement;
  let textElement: HTMLElement;
  let subtitleElement: HTMLElement | null = $state(null);
  let isVisible = $state(false);
  let isAnimationComplete = $state(false);
  let glowOpacity = $state(0);
  let lineWidth = $state(0);
  let textPosition = $state({ x: 0, y: 20 });
  let subtitleOpacity = $state(0);

  function handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isVisible) {
        isVisible = true;
        animateIn();
      }
    });
  }

  async function animateIn() {
    lineWidth = 60;
    await tick();

    for (let i = 0; i <= 1; i += 0.05) {
      textPosition = {
        x: 0,
        y: 30 * (1 - elasticOut(i))
      };
      glowOpacity = cubicOut(i);
      await new Promise(resolve => setTimeout(resolve, 15));
    }

    subtitleOpacity = 1;

    setTimeout(() => {
      isAnimationComplete = true;
    }, 1200);
  }

  function handleHover() {
    if (!isAnimationComplete) return;
    lineWidth = 80;
  }

  function handleHoverEnd() {
    if (!isAnimationComplete) return;
    lineWidth = 40;
  }

  onMount(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
      rootMargin: "0px 0px -10% 0px"
    });

    if (headingElement) {
      observer.observe(headingElement);
    }

    return () => {
      observer.disconnect();
    };
  });
</script>

<div 
  class="flex flex-col gap-4 mb-16 relative group"
  bind:this={headingElement}
  onmouseenter={handleHover}
  onmouseleave={handleHoverEnd}
  role="presentation"
>
  <h2
    class="text-2xl md:text-4xl tracking-widest text-white/90 font-bold m-0 flex items-center gap-6"
    id={id}
  >
    <div 
      class="relative h-[3px] overflow-hidden transition-all duration-700 ease-out"
      bind:this={lineElement}
      style:width="{lineWidth}px"
    >
      <div class="absolute inset-0 bg-gradient-to-r from-[#ff3d00] via-[#ff6b00] to-[#ff8a00] animate-pulse"></div>
      <div class="absolute inset-0 bg-[#ff3d00] blur-[3px] transition-opacity duration-700"
        style:opacity={glowOpacity * 0.4}></div>
    </div>

    <div 
      class="relative group-hover:scale-105 transition-transform duration-500"
      bind:this={textElement}
      style:transform="translate({textPosition.x}px, {textPosition.y}px)"
      style:transition="all 0.7s cubic-bezier(0.16, 1, 0.3, 1)"
    >
      <span class="relative z-10 bg-gradient-to-r from-white via-white/95 to-white/90 bg-clip-text text-transparent">
        {title}
      </span>
      
      <span 
        class="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/90 bg-clip-text text-transparent blur-[2px] transition-opacity duration-700"
        style:opacity={glowOpacity * 0.5}
        aria-hidden="true"
      >
        {title}
      </span>
    </div>
  </h2>

  {#if subtitle}
    <p 
      class="text-lg md:text-xl text-white/70 max-w-3xl leading-relaxed transition-all duration-700 ease-out group-hover:text-white/80"
      bind:this={subtitleElement}
      style:opacity={subtitleOpacity}
      style:transform="translateY({20 * (1 - subtitleOpacity)}px)"
    >
      {subtitle}
    </p>
  {/if}
</div>

<style>
  .relative {
    transform: translateZ(0);
    will-change: transform, opacity;
  }

  h2, p {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .transition-all {
    transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }

  @media (prefers-reduced-motion: reduce) {
    .transition-all,
    .transition-opacity,
    .transition-transform {
      transition: none !important;
    }

    .relative {
      transform: none !important;
    }
  }

  :global(html:not(.js)) .relative {
    opacity: 1 !important;
    transform: none !important;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }

  .animate-pulse {
    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style> 