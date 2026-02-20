<script lang="ts">
  type Service = {
    title: string;
    description: string;
    features: string[];
    longDescription?: string;
  };

  type Props = {
    service: Service;
    showHeader?: boolean;
  };

  const { service, showHeader = true }: Props = $props();
</script>

<div>
  {#if showHeader}
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0">
        <div class="flex items-center gap-3">
          <div
            class="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white font-semibold flex items-center justify-center shadow-sm flex-shrink-0"
            aria-hidden="true"
          >
            {service.title.charAt(0)}
          </div>
          <h3 class="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
            {service.title}
          </h3>
        </div>

        <p class="mt-3 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
          {service.description}
        </p>
      </div>
    </div>
  {/if}

  {#if service.longDescription}
    <div class={showHeader ? "mt-6" : ""}>
      <h4 class="text-xs font-semibold tracking-wide text-gray-500 uppercase">
        Overview
      </h4>
      <p class="mt-2 text-sm sm:text-[15px] text-gray-700 leading-relaxed">
        {service.longDescription}
      </p>
    </div>
  {/if}

  <div class={service.longDescription ? "mt-6" : (showHeader ? "mt-6" : "mt-5")}>
    <h4 class="text-xs font-semibold tracking-wide text-gray-500 uppercase">
      What you get
    </h4>
    <ul class="mt-3 grid grid-cols-1 gap-2">
      {#each service.features as feature, i (feature + i)}
        <li class="flex items-start gap-3 rounded-xl bg-black/3 px-3 py-2.5 text-sm text-gray-700">
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

  <div class="mt-7">
    <a
      href="/contact/"
      class="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-orange-500 text-white font-semibold shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all duration-300"
    >
      Get Started
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9 5l7 7-7 7"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </a>
  </div>
</div>

