<script>
  export let sections;
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  
  let visible = false;
  let sectionElements = [];
  
  function handleScroll() {
    sectionElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
      
      if (isVisible) {
        el.classList.add('visible');
      }
    });
  }

  onMount(() => {
    visible = true;
    sectionElements = document.querySelectorAll('.section-content');
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<svelte:window on:scroll={handleScroll} />

{#if visible}
  <section class="py-24 relative">
    <!-- Subtle separator -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
    
    <div class="max-w-3xl mx-auto px-6">
      {#each sections as section, i}
        <div
          class="section-content opacity-0 transform translate-y-4 transition-all duration-1000 ease-out"
          style="transition-delay: {i * 100}ms"
        >
          <div class="group mb-12">
            <div class="relative">
              <div class="absolute -inset-0.5 bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-lg opacity-0 group-hover:opacity-100 transition duration-500" />
              <div class="relative bg-black rounded-lg p-8 border border-zinc-800 group-hover:border-transparent transition duration-500">
                <div class="flex gap-6">
                  <!-- Section number -->
                  <div class="flex-none">
                    <span class="text-sm font-mono text-zinc-600">
                      {(i + 1).toString().padStart(2, '0')}
                    </span>
                  </div>
                  
                  <!-- Content -->
                  <div class="flex-1 space-y-4">
                    <p class="text-zinc-300 leading-relaxed">
                      {section.trim()}
                    </p>
                    <div class="h-px w-full bg-gradient-to-r from-zinc-800 to-transparent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </section>
{/if}

<style>
  section {
    background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.2));
  }

  .section-content.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Custom scrollbar styles */
  :global(body) {
    scrollbar-width: thin;
    scrollbar-color: rgba(161, 161, 170, 0.3) transparent;
  }

  :global(body::-webkit-scrollbar) {
    width: 6px;
  }

  :global(body::-webkit-scrollbar-track) {
    background: transparent;
  }

  :global(body::-webkit-scrollbar-thumb) {
    background-color: rgba(161, 161, 170, 0.3);
    border-radius: 3px;
  }

  :global(body::-webkit-scrollbar-thumb:hover) {
    background-color: rgba(161, 161, 170, 0.5);
  }
</style> 