<script lang="ts">
  import { fade, slide } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import ServiceDetails from "./ServiceDetails.svelte";

  type Service = {
    title: string;
    description: string;
    features: string[];
    longDescription?: string;
  };

  type Props = {
    services: Service[];
  };

  const { services }: Props = $props();

  let activeIndex = $state<number | null>(null);
  const activeService = $derived.by(() =>
    activeIndex === null ? null : (services[activeIndex] ?? null),
  );

  function select(idx: number) {
    activeIndex = idx;
  }
</script>

<div class="flex items-start justify-between gap-4 mb-6">
  <div class="min-w-0">
    <h3 class="text-base sm:text-lg font-semibold text-gray-900">
      Select a service
    </h3>
    <p class="mt-1 text-sm text-gray-600">
      {#if activeIndex === null}
        Tap a card to see full details.
      {:else}
        Details update instantly.
      {/if}
    </p>
  </div>

  <div class="hidden md:flex items-center gap-2 text-sm text-gray-500">
    <span>Details</span>
    <svg class="w-4 h-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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

<div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
  <!-- Cards -->
  <div class="md:col-span-7 lg:col-span-7 xl:col-span-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      <div class="sr-only" aria-live="polite">
        {#if activeService}
          Showing details for {activeService.title}.
        {:else}
          No service selected.
        {/if}
      </div>

      {#each services as service, idx (service.title)}
        <button
          type="button"
          class={"text-left rounded-2xl bg-white/95 ring-1 shadow-sm transition-all duration-200 " +
            (idx === activeIndex
              ? "ring-orange-500/40 shadow-md"
              : "ring-black/5 hover:shadow-md hover:ring-black/10")}
          role="option"
          aria-selected={idx === activeIndex}
          onclick={() => select(idx)}
        >
          <div class="p-5 sm:p-6">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <div class="flex items-center gap-3">
                  <div
                    class={"w-11 h-11 sm:w-12 sm:h-12 rounded-xl text-white font-semibold flex items-center justify-center shadow-sm flex-shrink-0 " +
                      (idx === activeIndex
                        ? "bg-gradient-to-br from-orange-500 to-orange-600"
                        : "bg-gradient-to-br from-gray-900 to-gray-700")}
                    aria-hidden="true"
                  >
                    {service.title.charAt(0)}
                  </div>
                  <h3
                    class={"text-lg sm:text-xl font-bold leading-snug " +
                      (idx === activeIndex ? "text-gray-900" : "text-gray-900")}
                  >
                    {service.title}
                  </h3>
                </div>

                <p
                  class="mt-3 text-sm sm:text-[15px] text-gray-600 leading-relaxed"
                >
                  {service.description}
                </p>
              </div>

              <div
                class={"shrink-0 inline-flex items-center justify-center rounded-xl w-11 h-11 transition-colors " +
                  (idx === activeIndex
                    ? "bg-orange-500/10 text-orange-700"
                    : "bg-black/5 text-gray-900")}
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
              {#each service.features.slice(0, 3) as feature (feature)}
                <span
                  class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 text-gray-700 text-xs sm:text-[13px] leading-none"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600"
                    aria-hidden="true"
                  ></span>
                  <span class="truncate max-w-[16rem] sm:max-w-[18rem]"
                    >{feature}</span
                  >
                </span>
              {/each}

              {#if service.features.length > 3}
                <span
                  class="inline-flex items-center px-3 py-1.5 rounded-full bg-black/4 text-gray-500 text-xs sm:text-[13px] leading-none"
                >
                  +{service.features.length - 3} more
                </span>
              {/if}
            </div>

            <div
              class={"mt-4 text-sm font-medium transition-colors " +
                (idx === activeIndex ? "text-orange-600" : "text-gray-500")}
            >
              {idx === activeIndex
                ? "Selected • See details below"
                : "View details"}
            </div>

            <!-- Mobile-only inline details to avoid scrolling to a separate panel -->
            {#if idx === activeIndex}
              <div
                class="mt-5 pt-5 border-t border-black/5 md:hidden"
                transition:slide={{ duration: 220, easing: cubicOut }}
              >
                <ServiceDetails {service} showHeader={false} />
              </div>
            {/if}
          </div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Details panel -->
  <div class="hidden md:block md:col-span-5 lg:col-span-5 xl:col-span-4">
    <div
      class="md:sticky md:top-24 rounded-2xl bg-white/95 ring-1 ring-black/5 shadow-sm p-5 sm:p-6"
    >
      {#if activeService}
        {#key activeService.title}
          <div in:fade={{ duration: 160, easing: cubicOut }}>
            <ServiceDetails service={activeService} />
          </div>
        {/key}
      {:else}
        <div class="p-1">
          <h3 class="text-lg font-semibold text-gray-900">Service details</h3>
          <p class="mt-2 text-sm text-gray-600">
            Select a service card on the left to view full details here.
          </p>

          <div class="mt-4 rounded-xl bg-black/3 p-4 text-sm text-gray-700">
            Tip: look for the <span class="font-medium">“View details”</span> label
            on each card.
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  @media (prefers-reduced-motion: reduce) {
    :global(*) {
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
    }
  }
</style>
