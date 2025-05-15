<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  export let features: string[];
  
  let visible = false;
  onMount(() => {
    visible = true;
  });
</script>

{#if visible}
<section class="py-16">
  <h2 class="text-3xl font-bold mb-12 text-center">
    <span class="bg-gradient-to-r from-[#ff3d00] to-[#ff8a00] bg-clip-text text-transparent">
      Key Features
    </span>
  </h2>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {#each features as feature, i}
      <div 
        in:fade={{ delay: 100 * i, duration: 500 }}
        class="bg-black/50 border border-white/10 rounded-xl p-6 hover:border-[#ff3d00]/30 transition-all duration-300"
      >
        <div class="flex items-start gap-4">
          <div class="mt-1 w-6 h-6 flex-shrink-0 rounded bg-gradient-to-br from-[#ff3d00] to-[#ff8a00] flex items-center justify-center text-black font-bold">
            {i + 1}
          </div>
          <p class="text-white/80">{feature}</p>
        </div>
      </div>
    {/each}
  </div>
</section>
{/if} 