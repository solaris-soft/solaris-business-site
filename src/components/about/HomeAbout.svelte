<script lang="ts">
  import { onMount } from "svelte";
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  let container: HTMLElement;
  let contentRef: HTMLElement;
  let currentStage = 0;
  let isAnimating = false;
  let stageRefs: HTMLElement[] = [];
  let indicatorRefs: HTMLElement[] = [];

  const stages = [
    {
      title: "We Listen & Plan",
      description:
        "First, we sit down with you to understand what you need. No tech jargon—just plain conversation about your business and what's not working. Then we map out exactly how to fix it.",
      icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
    },
    {
      title: "We Build & Check",
      description:
        "We build your solution in small pieces and show you progress regularly. You tell us what works and what doesn't. No surprises at the end—you're involved every step.",
      icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    },
    {
      title: "We Launch & Support",
      description:
        "When everything's ready, we help you go live. We'll train your team, write simple instructions, and stick around to help when you need us.",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    },
  ];

  function animateToStage(newStage: number) {
    if (isAnimating || newStage === currentStage) return;

    isAnimating = true;
    const direction = newStage > currentStage ? 1 : -1;
    const currentElement = stageRefs[currentStage];
    const newElement = stageRefs[newStage];

    // Create GSAP timeline for smooth transitions
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating = false;
      },
    });

    // Animate out current stage
    tl.to(currentElement, {
      x: direction * -100,
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut",
    })
      // Set up new stage position and animate in
      .set(newElement, {
        x: direction * 100,
        opacity: 0,
      })
      .to(newElement, {
        x: 0,
        opacity: 1,
        duration: 0.3,
        ease: "power2.inOut",
      });

    // Update indicators
    gsap.to(indicatorRefs[currentStage], {
      scale: 1,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      duration: 0.2,
    });

    gsap.to(indicatorRefs[newStage], {
      scale: 1.25,
      backgroundColor: "#ff6b35",
      duration: 0.2,
    });

    currentStage = newStage;
  }

  function nextStage() {
    const next = (currentStage + 1) % stages.length;
    animateToStage(next);
  }

  function prevStage() {
    const prev = (currentStage - 1 + stages.length) % stages.length;
    animateToStage(prev);
  }

  onMount(() => {
    // Set initial state for all stages (hidden except first)
    stageRefs.forEach((ref, index) => {
      if (index === 0) {
        gsap.set(ref, { opacity: 1, x: 0 });
      } else {
        gsap.set(ref, { opacity: 0, x: 100 });
      }
    });

    // Set initial indicator states
    indicatorRefs.forEach((ref, index) => {
      if (index === 0) {
        gsap.set(ref, { scale: 1.25, backgroundColor: "#ff6b35" });
      } else {
        gsap.set(ref, {
          scale: 1,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
        });
      }
    });

    // Create scroll-triggered entrance animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    // Animate in header
    tl.from(".header-content", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    })
      // Animate in main content
      .from(
        ".stage-container",
        {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4",
      )
      // Animate in navigation and indicators
      .from(
        ".nav-controls",
        {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.3",
      );

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  });
</script>

<div
  bind:this={container}
  class="relative py-32 md:py-48 bg-black overflow-hidden"
>
  <!-- Simplified background -->
  <div class="absolute inset-0">
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-orange-500/8 via-orange-500/3 to-transparent rounded-full"
    ></div>
  </div>

  <!-- Content -->
  <div class="relative z-10 max-w-6xl mx-auto px-4">
    <!-- Section Header -->
    <div class="header-content text-center mb-16 space-y-6">
      <h2
        class="text-3xl lg:text-5xl font-bold text-orange-200 font-clash-display"
      >
        How We Work
      </h2>
      <p class="text-xl text-orange-100/70 max-w-2xl mx-auto">
        Simple steps. Clear communication. Results that work.
      </p>
    </div>

    <!-- Stage Display -->
    <div class="stage-container relative max-w-4xl mx-auto">
      <!-- Main Content Area -->
      <div
        class="relative bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 min-h-[400px]"
      >
        <!-- Stage Content (All stages rendered, controlled by GSAP) -->
        {#each stages as stage, index}
          <div
            bind:this={stageRefs[index]}
            class="absolute inset-8 md:inset-12 flex flex-col items-center justify-center text-center space-y-8"
            style="opacity: {index === 0 ? 1 : 0};"
          >
            <!-- Icon -->
            <div class="relative">
              <div
                class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 p-0.5"
              >
                <div
                  class="w-full h-full rounded-full bg-black flex items-center justify-center"
                >
                  <svg
                    class="w-10 h-10 md:w-12 md:h-12 text-orange-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d={stage.icon} />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Text Content -->
            <div class="space-y-6 max-w-2xl">
              <h3
                class="text-2xl md:text-3xl font-bold text-orange-200 font-clash-display"
              >
                {stage.title}
              </h3>
              <p class="text-lg text-orange-100/70 leading-relaxed">
                {stage.description}
              </p>
            </div>
          </div>
        {/each}
      </div>

      <!-- Navigation Controls -->
      <div class="nav-controls">
        <!-- Desktop Navigation Buttons -->
        <button
          class="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 items-center justify-center text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-all duration-200"
          on:click={prevStage}
          disabled={isAnimating}
          aria-label="Previous stage"
        >
          <svg
            class="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M15 19l-7-7 7-7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <button
          class="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 items-center justify-center text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-all duration-200"
          on:click={nextStage}
          disabled={isAnimating}
          aria-label="Next stage"
        >
          <svg
            class="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M9 5l7 7-7 7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <!-- Mobile Navigation -->
        <div class="flex md:hidden justify-center gap-4 mt-8">
          <button
            class="flex items-center justify-center w-12 h-12 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-all"
            on:click={prevStage}
            disabled={isAnimating}
            aria-label="Previous stage"
          >
            <svg
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M15 19l-7-7 7-7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <button
            class="flex items-center justify-center w-12 h-12 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-all"
            on:click={nextStage}
            disabled={isAnimating}
            aria-label="Next stage"
          >
            <svg
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M9 5l7 7-7 7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>

        <!-- Stage Indicators -->
        <div class="flex justify-center gap-2 mt-8">
          {#each stages as _, index}
            <button
              bind:this={indicatorRefs[index]}
              class="w-3 h-3 rounded-full transition-all duration-200 hover:scale-110"
              on:click={() => animateToStage(index)}
              disabled={isAnimating}
              aria-label="Go to stage {index + 1}"
              style="background-color: {index === 0
                ? '#ff6b35'
                : 'rgba(255, 255, 255, 0.2)'}; transform: scale({index === 0
                ? '1.25'
                : '1'});"
            ></button>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .font-clash-display {
    font-family: "Clash Display", sans-serif;
    font-weight: 700;
  }

  /* Performance optimizations for GSAP */
  div {
    will-change: transform, opacity;
    backface-visibility: hidden;
  }

  /* Text rendering optimization */
  h2,
  h3,
  p {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Smooth button interactions */
  button {
    will-change: transform, background-color;
  }

  button:disabled {
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Custom gradient for background */
  .bg-gradient-radial {
    background: radial-gradient(circle, var(--tw-gradient-stops));
  }

  /* Hardware acceleration for better performance */
  .stage-container {
    transform: translateZ(0);
  }
</style>
