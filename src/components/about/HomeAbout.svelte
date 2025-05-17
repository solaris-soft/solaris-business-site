<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, crossfade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  let isVisible = $state(false);
  let currentStage = $state(0);
  let container: HTMLElement;
  let isTransitioning = $state(false);
  let direction = $state(1); // 1 for forward, -1 for backward

  const [send, receive] = crossfade({
    duration: 400,
    easing: quintOut,
    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === 'none' ? '' : style.transform;
      
      return {
        duration: 400,
        easing: quintOut,
        css: t => `
          transform: ${transform} translate(${(1 - t) * (direction * 100)}%);
          opacity: ${t}
        `
      };
    }
  });

  const stages = [
    {
      title: "Design & Analysis",
      description: "We begin with a deep dive into your requirements, conducting thorough analysis and creating detailed design specifications to ensure perfect alignment with your business goals.",
      icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
    },
    {
      title: "Implementation & Feedback",
      description: "Through agile development cycles, we implement your solution while maintaining constant communication and incorporating your feedback for optimal results.",
      icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    },
    {
      title: "Delivery & Finalization",
      description: "We ensure a smooth deployment process, comprehensive documentation, and continued support to guarantee your complete satisfaction with the final product.",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    }
  ];

  function nextStage() {
    if (isTransitioning) return;
    isTransitioning = true;
    direction = 1;
    currentStage = (currentStage + 1) % stages.length;
    setTimeout(() => isTransitioning = false, 400);
  }

  function prevStage() {
    if (isTransitioning) return;
    isTransitioning = true;
    direction = -1;
    currentStage = (currentStage - 1 + stages.length) % stages.length;
    setTimeout(() => isTransitioning = false, 400);
  }

  function goToStage(index: number) {
    if (isTransitioning || index === currentStage) return;
    isTransitioning = true;
    direction = index > currentStage ? 1 : -1;
    currentStage = index;
    setTimeout(() => isTransitioning = false, 400);
  }

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            isVisible = true;
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    
    if (container) {
      observer.observe(container);
    }
    
    return () => observer.disconnect();
  });
</script>

<div 
  bind:this={container}
  class="relative py-12 md:py-24"
>
  <!-- Background Elements -->
  <div class="absolute inset-0 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black"></div>
    <div class="absolute inset-0">
      <div class="absolute w-full h-full">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] aspect-square">
          <div class="absolute inset-0 rounded-full bg-gradient-radial from-orange-500/5 via-orange-500/2 to-transparent blur-3xl"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Content -->
  <div class="relative z-10 max-w-7xl mx-auto px-4">
    <!-- Section Header -->
    {#if isVisible}
      <div 
        in:fade={{ duration: 800 }}
        class="text-center mb-12 md:mb-20 space-y-4"
      >
        <h2 class="text-2xl lg:text-3xl font-semibold tracking-wider text-orange-200/90">
          OUR PROCESS
        </h2>
        <p class="text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
          A streamlined approach to delivering exceptional software solutions
        </p>
      </div>

      <!-- Interactive Stage Display -->
      <div class="relative max-w-4xl mx-auto">
        <!-- Stage Content -->
        <div class="relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-3xl p-6 md:p-12 overflow-hidden group">
          <!-- Navigation Buttons - Mobile -->
          <div class="flex justify-between md:hidden mb-6">
            <button
              class="p-2 text-white/60 hover:text-white transition-colors disabled:opacity-30"
              onclick={prevStage}
              disabled={isTransitioning}
              aria-label="Previous stage"
            >
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            
            <button
              class="p-2 text-white/60 hover:text-white transition-colors disabled:opacity-30"
              onclick={nextStage}
              disabled={isTransitioning}
              aria-label="Next stage"
            >
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <!-- Content Container with Fixed Height -->
          <div class="h-[50vh] md:h-[320px] relative">
            {#key currentStage}
              <div
                class="absolute inset-0 flex flex-col items-center gap-6 md:gap-8"
                in:receive={{key: currentStage}}
                out:send={{key: currentStage}}
              >
                <!-- Icon -->
                <div class="relative w-16 h-16 md:w-20 md:h-20 shrink-0">
                  <div class="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff3d00] to-[#ff8a00] blur-lg opacity-50"></div>
                  <div class="relative w-full h-full rounded-full bg-gradient-to-br from-[#ff3d00] to-[#ff8a00] p-[2px]">
                    <div class="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                      <!-- Solar prominences -->
                      <div class="absolute inset-0 bg-gradient-to-br from-[#ff3d00] via-[#ff8a00] to-[#ff3d00] opacity-40 scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                      <svg 
                        class="w-8 h-8 md:w-10 md:h-10 text-orange-500 transform group-hover:scale-110 transition-transform duration-300 relative z-10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d={stages[currentStage].icon}/>
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Text Content -->
                <div class="text-center space-y-4">
                  <h3 class="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    {stages[currentStage].title}
                  </h3>
                  <p class="text-base md:text-lg text-white/60 leading-relaxed max-w-2xl">
                    {stages[currentStage].description}
                  </p>
                </div>
              </div>
            {/key}
          </div>
        </div>

        <!-- Navigation Buttons - Desktop -->
        <button
          class="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 lg:-translate-x-16 p-3 text-white/60 hover:text-white transition-colors disabled:opacity-30"
          onclick={prevStage}
          disabled={isTransitioning}
          aria-label="Previous stage"
        >
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <button
          class="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 lg:translate-x-16 p-3 text-white/60 hover:text-white transition-colors disabled:opacity-30"
          onclick={nextStage}
          disabled={isTransitioning}
          aria-label="Next stage"
        >
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- Stage Indicators -->
        <div class="flex justify-center gap-3 mt-6 md:mt-8">
          {#each stages as _, index}
            <button
              class="w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 {index === currentStage ? 'bg-orange-500 scale-125' : 'bg-white/20 hover:bg-white/40'}"
              onclick={() => goToStage(index)}
              disabled={isTransitioning}
              aria-label="Go to stage {index + 1}"
            ></button>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  /* Optimize performance */
  .transition-all {
    transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  /* Text rendering optimization */
  h2, h3, p {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  button:disabled {
    cursor: not-allowed;
  }

  /* Prevent layout shifts during transitions */
  div {
    backface-visibility: hidden;
    transform-style: preserve-3d;
  }
</style> 