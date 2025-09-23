<script lang="ts">
  import { onMount } from "svelte";
  import { gsap } from "gsap";

  let { title, description, features } = $props();

  let isFlipped = $state(false);
  let hovered = $state(false);
  let mouseX = $state(0);
  let mouseY = $state(0);
  let cardRef: HTMLElement;
  let frontRef: HTMLElement;
  let backRef: HTMLElement;
  let iconRef: HTMLElement;
  let flipIconRef: SVGSVGElement;

  let timeline: gsap.core.Timeline;

  onMount(() => {
    // Enhanced initial setup for buttery smooth animation
    gsap.set(cardRef, {
      transformPerspective: 1500,
      transformStyle: "preserve-3d",
    });

    // Set both faces with proper 3D positioning and hardware acceleration
    gsap.set([frontRef, backRef], {
      transformOrigin: "center center",
      backfaceVisibility: "hidden",
      force3D: true,
      willChange: "transform",
    });

    gsap.set(frontRef, {
      rotationY: 0,
      zIndex: 2,
    });

    gsap.set(backRef, {
      rotationY: 180,
      zIndex: 1,
    });

    // Create ultra-smooth flip timeline with perfect timing
    timeline = gsap.timeline({
      paused: true,
      defaults: {
        ease: "power2.inOut",
        force3D: true,
      },
    });

    timeline
      .to(
        frontRef,
        {
          duration: 0.7,
          rotationY: -180,
          transformOrigin: "center center",
        },
        0,
      )
      .to(
        backRef,
        {
          duration: 0.7,
          rotationY: 0,
          transformOrigin: "center center",
        },
        0,
      );

    // Enhanced hover animations with stagger
    const hoverTl = gsap.timeline({ paused: true });
    hoverTl
      .to(cardRef, {
        scale: 1.03,
        y: -10,
        duration: 0.4,
        ease: "power3.out",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      })
      .to(
        iconRef,
        {
          scale: 1.15,
          rotation: 5,
          duration: 0.4,
          ease: "elastic.out(1, 0.5)",
        },
        0,
      )
      .to(
        flipIconRef,
        {
          rotation: 180,
          scale: 1.1,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)",
        },
        0.1,
      );

    // Smooth event listeners with debouncing
    let hoverTimeout;
    cardRef.addEventListener("mouseenter", () => {
      clearTimeout(hoverTimeout);
      hovered = true;
      if (!isFlipped) {
        hoverTl.play();
      }
    });

    cardRef.addEventListener("mouseleave", () => {
      hovered = false;
      clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(() => {
        if (!isFlipped) {
          hoverTl.reverse();
        }
      }, 50);
    });

    return () => {
      timeline.kill();
      hoverTl.kill();
      clearTimeout(hoverTimeout);
    };
  });

  function handleMouseMove(event: MouseEvent) {
    if (!cardRef || isFlipped) return;
    const rect = cardRef.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;

    // Ultra-subtle mouse follow effect that won't interfere with flip
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (mouseY - centerY) * 0.01;
    const rotateY = (mouseX - centerX) * 0.01;

    gsap.to(cardRef, {
      duration: 0.3,
      rotationX: -rotateX,
      rotationY: rotateY,
      ease: "power2.out",
      force3D: true,
      overwrite: "auto",
    });
  }

  function handleMouseLeave() {
    // Quick reset rotation
    if (!isFlipped) {
      gsap.to(cardRef, {
        duration: 0.4,
        rotationX: 0,
        rotationY: 0,
        ease: "power2.out",
        force3D: true,
        overwrite: "auto",
      });
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFlip();
    }
  }

  function toggleFlip() {
    // Reset any mouse effects first
    gsap.to(cardRef, {
      duration: 0.2,
      rotationX: 0,
      rotationY: 0,
      ease: "power2.out",
    });

    if (isFlipped) {
      // Flip back to front - smooth reverse
      timeline.reverse();
      isFlipped = false;

      // Simple fade out for features
      gsap.to(".feature-item", {
        opacity: 0,
        duration: 0.15,
        stagger: 0.01,
        ease: "power2.out",
      });
    } else {
      // Flip to back - smooth forward
      timeline.play();
      isFlipped = true;

      // Delay feature animation until flip completes
      gsap.delayedCall(0.4, () => {
        gsap.fromTo(
          ".feature-item",
          {
            opacity: 0,
            y: 20,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            stagger: {
              amount: 0.2,
              ease: "power2.out",
            },
            ease: "back.out(1.2)",
          },
        );
      });
    }
  }

  function handleCardClick(event: MouseEvent) {
    // Don't flip if clicking on interactive elements
    const target = event.target as HTMLElement;

    // Check for various interactive elements and scrollable areas
    if (
      target.closest(".scrollable-area") ||
      target.closest("a") ||
      target.closest("button") ||
      target.closest("[onclick]") ||
      target.closest(".feature-item") ||
      // Check if target itself is scrollable
      target.scrollHeight > target.clientHeight
    ) {
      return;
    }

    toggleFlip();
  }
</script>

<!-- Service Card Container -->
<div
  bind:this={cardRef}
  class="h-full min-h-96 cursor-pointer card-container"
  onclick={handleCardClick}
  onkeydown={handleKeydown}
  onmousemove={handleMouseMove}
  onmouseleave={handleMouseLeave}
  role="button"
  tabindex="0"
  aria-label={`${title} service details. Click to ${isFlipped ? "see overview" : "see details"}`}
>
  <!-- Front Side (Default View) -->
  <div
    bind:this={frontRef}
    class="absolute inset-0 h-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden card-face"
  >
    <!-- Background Gradient -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 transition-all duration-700 group-hover:from-orange-50 group-hover:to-orange-50"
    ></div>

    <!-- Interactive Glow Effect -->
    <div
      class="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
      style="background: radial-gradient(400px circle at {mouseX}px {mouseY}px, rgba(255, 61, 0, 0.08), transparent 40%)"
    ></div>

    <!-- Content -->
    <div class="relative z-10 p-8 h-full flex flex-col">
      <!-- Header -->
      <div class="flex items-start justify-between mb-6">
        <!-- Service Icon -->
        <div
          bind:this={iconRef}
          class="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xl font-bold shadow-lg"
        >
          {title.charAt(0)}
        </div>

        <!-- Flip Icon -->
        <div
          class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-300"
        >
          <svg
            bind:this={flipIconRef}
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            ></path>
          </svg>
        </div>
      </div>

      <!-- Title -->
      <h3
        class="text-2xl font-bold text-gray-900 mb-4 transition-colors duration-300 leading-tight group-hover:text-orange-500"
      >
        {title}
      </h3>

      <!-- Description -->
      <p
        class="text-gray-600 leading-relaxed mb-6 flex-1 line-clamp-3 group-hover:text-gray-700 transition-colors duration-300"
      >
        {description}
      </p>

      <!-- Feature Preview -->
      <div class="space-y-3 mb-6">
        {#each features.slice(0, 3) as feature}
          <div
            class="flex items-center gap-3 text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300"
          >
            <div
              class="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex-shrink-0"
            ></div>
            <span class="line-clamp-1">{feature}</span>
          </div>
        {/each}
        {#if features.length > 3}
          <div class="flex items-center gap-3 text-sm text-gray-400">
            <div
              class="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0"
            ></div>
            <span>+{features.length - 3} more features</span>
          </div>
        {/if}
      </div>

      <!-- CTA Section -->
      <div
        class="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto"
      >
        <span
          class="text-sm font-medium text-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          Click to See Details
        </span>
        <div
          class="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-45 shadow-lg"
        >
          <svg
            class="w-4 h-4 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Animated Border -->
    <div
      class="absolute inset-0 rounded-2xl border border-transparent p-px transition-all duration-500 opacity-0 hover:opacity-100 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600"
    >
      <div class="w-full h-full bg-white rounded-2xl"></div>
    </div>
  </div>

  <!-- Back Side (Details View) -->
  <div
    bind:this={backRef}
    class="absolute inset-0 h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden card-face"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div
        class="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 blur-2xl"
      ></div>
      <div
        class="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-gradient-to-br from-orange-600 to-orange-500 blur-xl"
      ></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 p-8 h-full flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-lg font-bold"
          >
            {title.charAt(0)}
          </div>
          <h3 class="text-xl font-bold text-white">{title}</h3>
        </div>

        <!-- Back to Front Icon -->
        <div
          class="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300"
        >
          <svg
            class="w-4 h-4 transition-transform duration-300 hover:rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            ></path>
          </svg>
        </div>
      </div>

      <!-- Description -->
      <p class="text-gray-300 leading-relaxed mb-6 text-sm">
        {description}
      </p>

      <!-- All Features -->
      <div class="flex-1 mb-6">
        <h4
          class="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2"
        >
          <div
            class="w-1 h-4 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"
          ></div>
          All Features
        </h4>

        <div
          class="space-y-3 max-h-48 overflow-y-auto pr-2 scrollable-area"
          onclick={(e) => e.stopPropagation()}
          onmousedown={(e) => e.stopPropagation()}
          onmouseup={(e) => e.stopPropagation()}
          onwheel={(e) => e.stopPropagation()}
          ontouchstart={(e) => e.stopPropagation()}
          ontouchmove={(e) => e.stopPropagation()}
          ontouchend={(e) => e.stopPropagation()}
        >
          {#each features as feature, index}
            <div
              class="feature-item flex items-start gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all duration-200 hover:translate-x-1"
              role="listitem"
            >
              <div
                class="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 mt-2 flex-shrink-0"
              ></div>
              <p class="text-gray-300 text-sm leading-relaxed">{feature}</p>
            </div>
          {/each}
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-auto">
        <a
          href="/contact/"
          class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105"
          onclick={(e) => e.stopPropagation()}
        >
          Get Started
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </a>
      </div>
    </div>

    <!-- Animated Border -->
    <div class="absolute inset-0 rounded-2xl border border-orange-500/50 p-px">
      <div class="w-full h-full bg-transparent rounded-2xl"></div>
    </div>
  </div>
</div>

<style>
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Enhanced scrollbar for back side features */
  .scrollable-area {
    scrollbar-width: thin;
    scrollbar-color: #f97316 rgba(255, 255, 255, 0.1);
    /* Ensure smooth scrolling and proper pointer events */
    scroll-behavior: smooth;
    pointer-events: auto;
    position: relative;
    z-index: 10;
    /* Prevent scroll momentum issues */
    -webkit-overflow-scrolling: touch;
  }

  .scrollable-area::-webkit-scrollbar {
    width: 6px;
  }

  .scrollable-area::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  .scrollable-area::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #f97316, #ea580c);
    border-radius: 3px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .scrollable-area::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #ea580c, #dc2626);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .scrollable-area::-webkit-scrollbar-thumb:active {
    background: linear-gradient(to bottom, #dc2626, #b91c1c);
  }

  /* Hover effect for scrollable area */
  .scrollable-area:hover {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 8px;
    transition: background-color 0.2s ease;
  }

  /* Make feature items more interactive */
  .feature-item {
    cursor: default;
    user-select: text;
  }

  .feature-item:hover {
    cursor: default;
  }

  /* Ultra-smooth 3D flip card styles */
  .card-container {
    perspective: 1500px;
    transform-style: preserve-3d;
    will-change: transform;
    position: relative;
    background: transparent;
    border-radius: 1rem;
    /* Force hardware acceleration */
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
  }

  .card-face {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform-style: preserve-3d;
    will-change: transform;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* Enhanced hardware acceleration */
    transform: translateZ(0.01px);
    -webkit-transform: translateZ(0.01px);
    /* Prevent subpixel rendering issues */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Smooth transitions */
  .feature-item {
    will-change: transform, opacity;
  }

  /* Hardware acceleration */
  .card-container,
  .card-face,
  .feature-item {
    transform: translateZ(0);
  }
</style>
