<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  const { features } = $props();

  let visible = $state(false);
  onMount(() => {
    visible = true;
  });
</script>

{#if visible}
  <section class="py-24 relative">
    <!-- Subtle separator -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent">
    </div>
    
    <div class="max-w-4xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        {#each features as feature, i}
          <div
            in:fly={{ y: 20, duration: 600, delay: 100 + (i * 100), easing: cubicOut }}
            class="group"
          >
            <div class="relative">
              <div class="absolute -inset-0.5 bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-lg opacity-0 group-hover:opacity-100 transition duration-500" />
              <div class="relative bg-black rounded-lg p-6 border border-zinc-800 group-hover:border-transparent transition duration-500">
                <div class="flex items-start space-x-4">
                  <div class="mt-1 w-px h-12 bg-gradient-to-b from-zinc-500 to-transparent" />
                  <div>
                    <h3 class="text-lg font-medium text-white mb-3">
                      {feature}
                    </h3>
                    <div class="h-px w-12 bg-gradient-to-r from-zinc-500 to-transparent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>
{/if}

<style>
  section {
    background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.2));
  }
</style> 