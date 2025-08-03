<script lang="ts">
  import { slide, fade } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  let { title, description, features } = $props();

  let isModalOpen = $state(false);
  let rippleX = $state(0);
  let rippleY = $state(0);
  let showRipple = $state(false);

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      isModalOpen = true;
    } else if (event.key === "Escape") {
      isModalOpen = false;
    }
  }

  function handleClick(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    rippleX = event.clientX - target.offsetLeft;
    rippleY = event.clientY - target.offsetTop;
    showRipple = false;
    setTimeout(() => {
      showRipple = true;
    }, 10);
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
  }
</script>

<!-- Card -->
<div
  class="group relative p-8 bg-black/40 border border-white/5 rounded-lg transition-all duration-500 cursor-pointer
         hover:bg-black/50 hover:border-[#ff3d00]/20"
  onclick={handleClick}
  onkeydown={handleKeydown}
  role="button"
  tabindex="0"
  aria-expanded={isModalOpen}
  aria-label={`${title} service details. Click to learn more`}
>
  {#if showRipple}
    <div
      class="absolute rounded-full bg-[#ff3d00]/20 animate-ripple"
      style="left: {rippleX}px; top: {rippleY}px;"
      transition:slide={{ duration: 400, easing: quintOut }}
    ></div>
  {/if}

  <!-- Subtle accent line -->
  <div
    class="absolute h-px w-12 bg-[#ff3d00]/20 -top-px left-8 transition-all duration-500 ease-out group-hover:w-full"
  ></div>

  <div class="space-y-6 relative z-10">
    <div class="flex items-center justify-between group">
      <h3
        class="text-2xl font-medium text-white/90 transition-colors duration-300 group-hover:text-[#ff3d00]/90"
      >
        {title}
      </h3>
      <svg
        class="w-5 h-5 text-white/50 transition-colors duration-300 group-hover:text-[#ff3d00]/50"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          d="M10 7v6m3-3H7"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <p
      class="text-white/60 text-lg leading-relaxed line-clamp-2 group-hover:text-white/70 transition-colors duration-300"
    >
      {description}
    </p>
  </div>
</div>

<!-- Modal -->
{#if isModalOpen}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center px-4"
    onclick={closeModal}
    onkeydown={(e) => e.key === "Escape" && closeModal()}
    transition:fade={{ duration: 200 }}
    role="presentation"
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

    <!-- Modal Content -->
    <div
      class="relative w-full max-w-2xl bg-black/90 border border-white/10 rounded-xl p-8 shadow-2xl"
      transition:slide={{ duration: 300, easing: quintOut }}
    >
      <!-- Close button -->
      <button
        class="absolute top-4 right-4 p-2 text-white/50 hover:text-white/90 transition-colors duration-200"
        onclick={closeModal}
        aria-label="Close modal"
      >
        <svg
          class="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M6 18L18 6M6 6l12 12"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <!-- Title -->
      <h2
        class="text-3xl font-bold mb-6 bg-gradient-to-r from-[#ff3d00] to-[#ff8a00] bg-clip-text text-transparent"
      >
        {title}
      </h2>

      <!-- Description -->
      <p class="text-white/80 text-lg leading-relaxed mb-8">
        {description}
      </p>

      <!-- Features -->
      <div class="space-y-6">
        <h3 class="text-xl font-semibold text-white/90">Key Features</h3>
        <ul class="space-y-4">
          {#each features as feature}
            <li
              class="flex items-start gap-3 text-white/70 transition-all duration-300 hover:translate-x-2 hover:text-white/90"
              transition:slide={{ duration: 200, easing: quintOut }}
            >
              <span
                class="mt-2 w-[3px] h-[3px] rounded-full bg-[#ff3d00]/50 transition-all duration-300"
              ></span>
              <span>{feature}</span>
            </li>
          {/each}
        </ul>
      </div>

      <!-- CTA Button -->
      <div class="mt-10 flex justify-center">
        <a
          href="/contact/"
          class="px-8 py-4 bg-gradient-to-r from-[#ff3d00] to-[#ff8a00] rounded-full text-white font-medium hover:shadow-lg hover:shadow-[#ff3d00]/20 transition-all duration-300 hover:scale-105"
        >
          Get Started
        </a>
      </div>
    </div>
  </div>
{/if}

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .animate-ripple {
    animation: ripple 0.6s linear;
    transform-origin: center;
  }

  @keyframes ripple {
    0% {
      width: 0px;
      height: 0px;
      opacity: 0.5;
      transform: translate(-50%, -50%);
    }
    100% {
      width: 500px;
      height: 500px;
      opacity: 0;
      transform: translate(-50%, -50%);
    }
  }
</style>
