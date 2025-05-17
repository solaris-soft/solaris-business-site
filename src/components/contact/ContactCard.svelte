<script lang="ts">
  import { spring } from 'svelte/motion';
  import { fade } from 'svelte/transition';
  
  export let href: string | undefined = undefined;
  export let label: string;
  
  let cardElement: HTMLElement;
  let isHovered = false;
  let springRotation = spring({ x: 0, y: 0 }, {
    stiffness: 0.1,
    damping: 0.6
  });
  
  $: transform = `
    perspective(1000px)
    rotateX(${$springRotation.x}deg)
    rotateY(${$springRotation.y}deg)
  `;
  
  function handleMouseMove(event: MouseEvent) {
    if (!cardElement) return;
    
    const bounds = cardElement.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    
    springRotation.set({
      x: (y - 0.5) * 10,
      y: (x - 0.5) * -10
    });
  }

  function handleMouseEnter() {
    isHovered = true;
  }

  function handleMouseLeave() {
    isHovered = false;
    springRotation.set({ x: 0, y: 0 });
  }
</script>

{#if href}
  <a
    {href}
    class="block relative group no-underline"
    bind:this={cardElement}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    on:mousemove={handleMouseMove}
    style:transform={transform}
  >
    <div class="relative h-full bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-lg p-6 shadow-xl border border-[#ff3d00]/20 transition-all duration-300 group-hover:border-[#ff3d00]/40">
      <!-- Solar flare effects -->
      <div class="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div class="absolute inset-0 bg-gradient-to-t from-[#ff3d00]/10 via-[#ff8a00]/5 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-[#ff3d00]/10 via-[#ff8a00]/5 to-transparent"></div>
      </div>
      
      <!-- Corona effect -->
      <div class="absolute -inset-[1px] rounded-lg opacity-30 group-hover:opacity-40 transition-all duration-500 overflow-hidden">
        <div class="absolute inset-0 bg-[#ff3d00]/20 blur-xl"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-[#ff3d00]/0 via-[#ff8a00]/20 to-[#ff3d00]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-2000"></div>
      </div>
      
      <!-- Label with solar icon -->
      <div class="flex items-center gap-3 mb-4">
        <div class="relative w-10 h-10">
          <!-- Pulsing glow -->
          <div class="absolute inset-0 bg-[#ff3d00]/30 rounded-full blur-xl animate-pulse"></div>
          <!-- Solar surface -->
          <div class="relative w-full h-full bg-gradient-to-br from-[#ff3d00] via-[#ff8a00] to-[#ff3d00] rounded-full p-[1.5px] rotate-0 group-hover:rotate-180 transition-transform duration-1000">
            <div class="w-full h-full rounded-full bg-[#16213e] flex items-center justify-center overflow-hidden">
              <!-- Solar prominences -->
              <div class="absolute inset-0 bg-gradient-to-br from-[#ff3d00] via-[#ff8a00] to-[#ff3d00] opacity-40 scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
              <span class="relative text-[#ff3d00] text-sm font-bold z-10">
                {label[0].toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        <span class="text-[#ff3d00] text-sm font-medium tracking-wide uppercase">
          {label}
        </span>
      </div>
      
      <!-- Content -->
      <div class="relative">
        <div class="text-lg text-white font-medium group-hover:text-[#ff8a00] transition-colors duration-300">
          <slot />
        </div>
      </div>
      
      <!-- Solar prominence effect -->
      {#if isHovered}
        <div
          class="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff3d00] to-transparent"
          transition:fade={{ duration: 300 }}
        >
          <div class="absolute inset-0 bg-[#ff3d00]/20 blur-sm"></div>
        </div>
      {/if}
    </div>
    
    <!-- Solar corona reflection -->
    <div class="absolute inset-0 rounded-lg bg-gradient-to-tr from-[#ff3d00]/0 to-[#ff3d00]/0 group-hover:from-[#ff3d00]/5 group-hover:to-[#ff8a00]/10 transition-all duration-500"></div>
  </a>
{:else}
  <div
    class="relative group"
    bind:this={cardElement}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    on:mousemove={handleMouseMove}
    style:transform={transform}
    role="button"
    tabindex="0"
  >
    <!-- Same content as above but without link wrapper -->
    <div class="relative h-full bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-lg p-6 shadow-xl border border-[#ff3d00]/20 transition-all duration-300 group-hover:border-[#ff3d00]/40">
      <slot />
    </div>
  </div>
{/if}

<style>
  /* Optimize performance */
  .transition-all {
    transition-timing-function: cubic-bezier(0.2, 0, 0.2, 1);
  }
  
  /* Enhance text rendering */
  :global(div), :global(a) {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Remove default focus outline and add custom one */
  :global(a:focus) {
    outline: none;
    box-shadow: 0 0 0 2px #ff3d00;
    border-radius: 4px;
  }
  
  /* Prevent layout shifts */
  div {
    backface-visibility: hidden;
    transform-style: preserve-3d;
    perspective: 1000px;
  }

  /* Solar animation */
  @keyframes pulse {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.2);
    }
  }

  .animate-pulse {
    animation: pulse 3s ease-in-out infinite;
  }
</style> 