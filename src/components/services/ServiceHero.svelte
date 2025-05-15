<script>
  export let title;
  export let description;
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { onMount } from 'svelte';
  
  let visible = false;
  onMount(() => {
    visible = true;
  });
</script>

{#if visible}
<section class="relative py-20 md:py-32">
  <!-- Subtle gradient background -->
  <div class="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/50 to-black pointer-events-none" />
  
  <div class="relative z-10 max-w-4xl mx-auto px-6">
    <a
      href="/services"
      class="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-16 group transition-colors duration-300"
      in:fade={{ duration: 300 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 mr-2 transform transition-transform duration-300 group-hover:-translate-x-1"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
          clip-rule="evenodd"
        />
      </svg>
      Back to Services
    </a>

    <div class="space-y-6">
      <h1
        in:fly={{ y: -20, duration: 800, delay: 200, easing: cubicOut }}
        class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
      >
        {title}
      </h1>
      <p
        in:fly={{ y: 20, duration: 800, delay: 400 }}
        class="text-lg md:text-xl text-zinc-400 max-w-2xl"
      >
        {description}
      </p>
    </div>
  </div>
</section>
{/if}

<style>
  h1 {
    background: linear-gradient(to right, #fff 20%, rgba(255, 255, 255, 0.7));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
</style> 