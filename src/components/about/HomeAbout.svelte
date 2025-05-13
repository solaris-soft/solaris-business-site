<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let isVisible = $state(false);
  let container: HTMLElement;

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
  class="relative py-24"
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
        class="text-center mb-20 space-y-4"
      >
        <h2 class="text-2xl lg:text-3xl font-semibold tracking-wider text-orange-200/90">
          OUR PROCESS
        </h2>
        <p class="text-xl text-white/60 max-w-2xl mx-auto">
          A streamlined approach to delivering exceptional software solutions
        </p>
      </div>

      <!-- Process Steps -->
      <div class="grid md:grid-cols-3 gap-8">
        {#each stages as stage, index}
          <div 
            in:fade={{ duration: 800, delay: 200 * index }}
            class="relative group"
          >
            <!-- Card Background -->
            <div class="absolute inset-0 rounded-3xl backdrop-blur-sm bg-white/[0.02] border border-white/[0.05] transition-all duration-300 group-hover:bg-white/[0.04]">
              <!-- Shine effect -->
              <div class="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </div>
            </div>

            <!-- Card Content -->
            <div class="relative p-8 h-full flex flex-col items-center text-center gap-6">
              <!-- Icon -->
              <div class="relative w-16 h-16">
                <div class="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff3d00] to-[#ff8a00] blur-lg opacity-50"></div>
                <div class="relative w-full h-full rounded-full bg-gradient-to-br from-[#ff3d00] to-[#ff8a00] p-[2px]">
                  <div class="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <svg 
                      class="w-8 h-8 text-orange-500 transform group-hover:scale-110 transition-transform duration-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d={stage.icon}/>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Text Content -->
              <h3 class="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                {stage.title}
              </h3>
              
              <p class="text-white/60 leading-relaxed">
                {stage.description}
              </p>
            </div>
          </div>
        {/each}
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
</style> 