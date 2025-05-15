<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  let { title, description, id } = $props();

  let visible = $state(false);
  onMount(() => {
    visible = true;
  });
</script>

{#if visible}
<div 
  in:fly={{ y: 20, duration: 800, easing: cubicOut }}
  class="group relative w-full h-full"
>
  <!-- Card Background with Gradient Border -->
  <div class="absolute -inset-0.5 bg-gradient-to-r from-[#ff3d00] to-[#ff8a00] rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
  
  <!-- Main Card Content -->
  <div class="relative h-full bg-black/90 rounded-2xl p-8 border border-white/10 group-hover:border-transparent transition-all duration-500">
    <!-- Orbital Decoration -->
    <div class="absolute right-4 top-4 w-20 h-20 opacity-50">
      <div class="absolute inset-0 rounded-full border border-[#ff3d00]/20 animate-orbit" style="animation-duration: 8s;">
        <div class="absolute w-1.5 h-1.5 bg-[#ff3d00] rounded-full -top-[2px] left-1/2 -translate-x-1/2 shadow-[0_0_10px_#ff3d00]"></div>
      </div>
      <div class="absolute inset-0 rounded-full border border-[#ff8a00]/10 animate-orbit" style="animation-duration: 12s; animation-direction: reverse;">
        <div class="absolute w-1 h-1 bg-[#ff8a00] rounded-full -top-[1px] left-1/2 -translate-x-1/2 shadow-[0_0_8px_#ff8a00]"></div>
      </div>
    </div>

    <!-- Service Icon -->
    <div class="relative w-16 h-16 mb-6">
      <div class="absolute inset-0 bg-gradient-to-br from-[#ff3d00] to-[#ff8a00] rounded-xl p-[1px] animate-pulse">
        <div class="w-full h-full rounded-xl bg-black/90 flex items-center justify-center">
          <div class="w-8 h-8 bg-gradient-to-br from-[#ff3d00] to-[#ff8a00] rounded-lg"></div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="space-y-4">
      <h3 class="text-xl font-bold bg-gradient-to-r from-[#ff3d00] to-[#ff8a00] bg-clip-text text-transparent group-hover:from-[#ff8a00] group-hover:to-[#ff3d00] transition-all duration-300">
        {title}
      </h3>
      
      <p class="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
        {description}
      </p>

      <!-- Learn More Link -->
      <div class="pt-4 flex items-center gap-2 text-sm font-medium">
        <span class="bg-gradient-to-r from-[#ff3d00] to-[#ff8a00] bg-clip-text text-transparent">
          Learn More
        </span>
        <svg
          class="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 12H20M20 12L14 6M20 12L14 18"
            stroke="url(#arrow-gradient)"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <defs>
            <linearGradient
              id="arrow-gradient"
              x1="4"
              y1="12"
              x2="20"
              y2="12"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#ff3d00" />
              <stop offset="1" stop-color="#ff8a00" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  </div>
</div>
{/if}

<style>
  @keyframes orbit {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .animate-orbit {
    animation: orbit linear infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(0.95);
    }
  }

  .animate-pulse {
    animation: pulse 3s ease-in-out infinite;
  }
</style> 