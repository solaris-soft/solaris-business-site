<script lang="ts">
  import { fade } from "svelte/transition";

  interface Props {
    href?: string;
    label: string;
    children?: import("svelte").Snippet;
  }

  let { href, label, children }: Props = $props();

  let cardElement = $state<HTMLElement>();
  let isHovered = $state(false);

  function handleMouseEnter() {
    isHovered = true;
  }

  function handleMouseLeave() {
    isHovered = false;
  }
</script>

<!-- Container similar to index.astro structure -->
<div class="w-full max-w-md mx-auto">
  {#if href}
    <a
      {href}
      class="block relative group no-underline"
      bind:this={cardElement}
      onmouseenter={handleMouseEnter}
      onmouseleave={handleMouseLeave}
    >
      <div
        class="relative bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl rounded-lg p-6 transition-all duration-300 border border-orange-500/20 group-hover:border-orange-400/50 group-hover:shadow-lg group-hover:shadow-orange-500/10"
      >
        <!-- Simple header with clean icon -->
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center"
          >
            <span class="text-white text-xs font-bold">
              {label[0].toUpperCase()}
            </span>
          </div>
          <span
            class="text-orange-400 text-sm font-medium uppercase tracking-wide"
          >
            {label}
          </span>
        </div>

        <!-- Content area -->
        <div
          class="text-white group-hover:text-orange-200 transition-colors duration-300"
        >
          {#if children}{@render children()}{/if}
        </div>

        <!-- Subtle accent line on hover -->
        {#if isHovered}
          <div
            class="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-orange-400/60 to-transparent"
            transition:fade={{ duration: 200 }}
          ></div>
        {/if}
      </div>
    </a>
  {:else}
    <div
      class="relative group"
      bind:this={cardElement}
      onmouseenter={handleMouseEnter}
      onmouseleave={handleMouseLeave}
      role="button"
      tabindex="0"
    >
      <div
        class="relative bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl rounded-lg p-6 transition-all duration-300 border border-orange-500/20 group-hover:border-orange-400/50 group-hover:shadow-lg group-hover:shadow-orange-500/10"
      >
        <!-- Simple header with clean icon -->
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center"
          >
            <span class="text-white text-xs font-bold">
              {label[0].toUpperCase()}
            </span>
          </div>
          <span
            class="text-orange-400 text-sm font-medium uppercase tracking-wide"
          >
            {label}
          </span>
        </div>

        <!-- Content area -->
        <div
          class="text-white group-hover:text-orange-200 transition-colors duration-300"
        >
          {#if children}{@render children()}{/if}
        </div>

        <!-- Subtle accent line on hover -->
        {#if isHovered}
          <div
            class="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-orange-400/60 to-transparent"
            transition:fade={{ duration: 200 }}
          ></div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  /* Clean transitions */
  .transition-all {
    transition-timing-function: cubic-bezier(0.2, 0, 0.2, 1);
  }

  /* Enhanced text rendering */
  :global(div),
  :global(a) {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Clean focus states */
  :global(a:focus) {
    outline: none;
    box-shadow: 0 0 0 2px #ff3d00;
    border-radius: 8px;
  }

  /* Accessibility improvements */
  :global([role="button"]:focus) {
    outline: none;
    box-shadow: 0 0 0 2px #ff3d00;
    border-radius: 8px;
  }
</style>
