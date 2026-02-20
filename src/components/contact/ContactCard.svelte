<script lang="ts">
  interface Props {
    href?: string;
    label: string;
    children?: import("svelte").Snippet;
  }

  let { href, label, children }: Props = $props();
  let isHovered = $state(false);
</script>

<div class="w-full group">
  {#if href}
    <a
      {href}
      class="block no-underline relative overflow-hidden"
      onmouseenter={() => (isHovered = true)}
      onmouseleave={() => (isHovered = false)}
    >
      <div
        class="relative bg-white border-2 border-white hover:border-orange-500 transition-all duration-300 p-8 transform hover:-translate-y-2 hover:shadow-2xl"
      >
        <!-- Geometric accent -->
        <div
          class="absolute top-0 right-0 w-16 h-16 bg-orange-500 transform rotate-45 translate-x-8 -translate-y-8 transition-transform duration-300 {isHovered
            ? 'scale-150'
            : 'scale-100'}"
        ></div>

        <!-- Icon -->
        <div class="relative z-10 mb-6">
          <div
            class="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-xl"
          >
            {label[0].toUpperCase()}
          </div>
        </div>

        <!-- Content -->
        <div class="relative z-10">
          <div
            class="text-orange-500 text-sm font-bold uppercase tracking-widest mb-3"
          >
            {label}
          </div>
          <div class="text-black text-xl font-medium">
            {#if children}{@render children()}{/if}
          </div>
        </div>
      </div>
    </a>
  {:else}
    <div class="relative bg-white border-2 border-white p-8">
      <!-- Geometric accent -->
      <div
        class="absolute top-0 right-0 w-16 h-16 bg-orange-500/20 transform rotate-45 translate-x-8 -translate-y-8"
      ></div>

      <!-- Icon -->
      <div class="relative z-10 mb-6">
        <div
          class="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-xl"
        >
          {label[0].toUpperCase()}
        </div>
      </div>

      <!-- Content -->
      <div class="relative z-10">
        <div
          class="text-orange-500 text-sm font-bold uppercase tracking-widest mb-3"
        >
          {label}
        </div>
        <div class="text-black text-xl font-medium">
          {#if children}{@render children()}{/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  /* Enhanced text rendering */
  :global(a) {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Focus states */
  :global(a:focus) {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-orange-500);
  }
</style>
