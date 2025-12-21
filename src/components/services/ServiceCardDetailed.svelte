<script lang="ts">
  import { tick } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";

  type Props = {
    title: string;
    description: string;
    features: string[];
    longDescription?: string;
  };

  const {
    title,
    description,
    features,
    longDescription = "",
  }: Props = $props();

  let isOpen = $state(false);
  let closeButtonRef = $state<HTMLButtonElement | null>(null);
  let lastActiveElement = $state<HTMLElement | null>(null);

  const titleId = `service-${title.toLowerCase().replace(/\s+/g, "-")}-title`;
  const panelId = `service-${title.toLowerCase().replace(/\s+/g, "-")}-panel`;

  async function open() {
    lastActiveElement = document.activeElement as HTMLElement | null;
    isOpen = true;
    await tick();
    closeButtonRef?.focus();
  }

  function close() {
    isOpen = false;
    // Return focus for keyboard users
    lastActiveElement?.focus?.();
  }

  function onCardKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  }

  function onDialogKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") close();
  }
</script>

<article
  class="group relative h-full rounded-2xl bg-white/95 ring-1 ring-black/5 shadow-sm hover:shadow-md transition-shadow duration-300"
>
  <!-- Card is compact; details open in an overlay to avoid grid layout jumps -->
  <button
    type="button"
    class="w-full text-left p-5 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 rounded-2xl"
    aria-haspopup="dialog"
    aria-controls={panelId}
    onclick={open}
    onkeydown={onCardKeydown}
  >
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0">
        <div class="flex items-center gap-3">
          <div
            class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white font-semibold flex items-center justify-center shadow-sm flex-shrink-0"
            aria-hidden="true"
          >
            {title.charAt(0)}
          </div>

          <h3 class="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
            {title}
          </h3>
        </div>

        <p class="mt-3 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>

      <div
        class="shrink-0 inline-flex items-center justify-center rounded-xl w-11 h-11 bg-black/5 group-hover:bg-black/10 text-gray-900 transition-colors"
        aria-hidden="true"
      >
        <svg class="w-5 h-5" viewBox="0 0 20 20" fill="none">
          <path
            d="M7 5l6 5-6 5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>

    <div class="mt-4 flex flex-wrap gap-2">
      {#each features.slice(0, 3) as feature (feature)}
        <span
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 text-gray-700 text-xs sm:text-[13px] leading-none"
        >
          <span
            class="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600"
            aria-hidden="true"
          ></span>
          <span class="truncate max-w-[16rem] sm:max-w-[18rem]">{feature}</span>
        </span>
      {/each}

      {#if features.length > 3}
        <span
          class="inline-flex items-center px-3 py-1.5 rounded-full bg-black/4 text-gray-500 text-xs sm:text-[13px] leading-none"
        >
          +{features.length - 3} more
        </span>
      {/if}
    </div>

    <div class="mt-4 text-sm font-medium text-orange-600">View details</div>
  </button>
</article>

{#if isOpen}
  <div
    class="fixed inset-0 z-50"
    role="presentation"
    onkeydown={onDialogKeydown}
  >
    <button
      type="button"
      class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      transition:fade={{ duration: 160 }}
      onclick={close}
      aria-label="Close dialog"
    ></button>

    <!-- Bottom sheet on mobile, side drawer on desktop -->
    <div
      id={panelId}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      class="absolute inset-x-0 bottom-0 sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[min(560px,100vw)] bg-white rounded-t-3xl sm:rounded-t-none sm:rounded-l-3xl shadow-2xl ring-1 ring-black/10"
      transition:fly={{ y: 18, duration: 220, easing: cubicOut }}
    >
      <div class="p-5 sm:p-8 h-full max-h-[85vh] sm:max-h-none overflow-y-auto">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <div class="flex items-center gap-3">
              <div
                class="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white font-semibold flex items-center justify-center shadow-sm flex-shrink-0"
                aria-hidden="true"
              >
                {title.charAt(0)}
              </div>
              <h3
                id={titleId}
                class="text-xl sm:text-2xl font-bold text-gray-900 leading-snug"
              >
                {title}
              </h3>
            </div>
            <p
              class="mt-3 text-sm sm:text-[15px] text-gray-600 leading-relaxed"
            >
              {description}
            </p>
          </div>

          <button
            bind:this={closeButtonRef}
            type="button"
            class="shrink-0 inline-flex items-center justify-center rounded-xl w-11 h-11 bg-black/5 hover:bg-black/10 text-gray-900 transition-colors"
            onclick={close}
          >
            <span class="sr-only">Close</span>
            <svg
              class="w-5 h-5"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 6l8 8M14 6l-8 8"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>

        {#if longDescription}
          <div class="mt-6">
            <h4
              class="text-xs font-semibold tracking-wide text-gray-500 uppercase"
            >
              Overview
            </h4>
            <p
              class="mt-2 text-sm sm:text-[15px] text-gray-700 leading-relaxed"
            >
              {longDescription}
            </p>
          </div>
        {/if}

        <div class="mt-6">
          <h4
            class="text-xs font-semibold tracking-wide text-gray-500 uppercase"
          >
            What you get
          </h4>

          <ul class="mt-3 grid grid-cols-1 gap-2">
            {#each features as feature, i (feature + i)}
              <li
                class="flex items-start gap-3 rounded-xl bg-black/3 px-3 py-2.5 text-sm text-gray-700"
              >
                <svg
                  class="w-5 h-5 text-orange-600 mt-0.5 shrink-0"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M16 6l-7.5 8L4 9.5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span class="leading-relaxed">{feature}</span>
              </li>
            {/each}
          </ul>
        </div>

        <div class="mt-7 flex flex-col sm:flex-row gap-3">
          <a
            href="/contact/"
            class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium shadow-sm hover:shadow-md transition-shadow"
          >
            Get Started
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 5l7 7-7 7"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </a>

          <button
            type="button"
            class="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-black/5 hover:bg-black/10 text-gray-900 font-medium transition-colors"
            onclick={close}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Respect reduced motion — keep the UI snappy without animated transforms. */
  @media (prefers-reduced-motion: reduce) {
    :global(*) {
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
    }
  }
</style>
