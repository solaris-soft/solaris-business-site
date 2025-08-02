<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import gsap from "gsap";
  import { SplitText } from "gsap/SplitText";

  let isLoaded = $state(false);
  let typedText = $state("");
  let showCursor = $state(true);
  let sun = $state<HTMLElement | null>(null);
  let titleElement = $state<HTMLElement | null>(null);

  const subheadings = [
    "Bespoke Software",
    "Business Analysis",
    "Continuous Support",
  ];

  const textPhrases = [
    "there is no one-size fits all.",
    "every business is unique.",
    "to work the way you do.",
    "that is purpose-built.",
  ];

  onMount(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    setTimeout(
      () => {
        isLoaded = true;

        // GSAP animation - only run after the element exists and motion is OK
        if (!prefersReducedMotion) {
          // Wait a bit for DOM to settle after isLoaded becomes true
          setTimeout(() => {
            if (sun) {
              const sunTimeline = gsap.timeline({
                defaults: { ease: "power2.inOut" },
              });

              // Initial burst: scale up, glow, and rotate
              sunTimeline.to(sun, {
                borderRadius: "40%",
                scale: 4.5,
                rotate: 30,
                duration: 0.45,
              });

              // Snap back with a little bounce and glow pulse
              sunTimeline.to(sun, {
                borderRadius: "100%",
                scale: 1.1,
                rotate: -10,
                duration: 1,
                ease: "back.out(2)",
              });

              // Settle to normal, but with a subtle glow
              sunTimeline.to(sun, {
                scale: 1,
                boxShadow: "0 0 32px 8px rgba(255,180,60,0.10)",
                rotate: 0,
                duration: 0.25,
                ease: "power1.inOut",
              });
            }

            if (titleElement) {
              gsap.registerPlugin(SplitText);
              const splitText = new SplitText(titleElement, {
                type: "chars",
              });

              // Apply gradient styling to each character span
              splitText.chars.forEach((char) => {
                const element = char as HTMLElement;
                element.style.background =
                  "linear-gradient(to bottom, rgb(255, 255, 255), rgb(255, 251, 235), rgb(254, 215, 170, 0.9))";
                element.style.backgroundClip = "text";
                element.style.color = "transparent";
                element.style.display = "inline-block";
              });

              // Improved: Subtle, organic entrance with each character coming from a different spot, no glow
              splitText.chars.forEach((char, i) => {
                // Assign a random x/y offset for each character
                const randomX = (Math.random() - 0.5) * 80; // -40 to +40px
                const randomY = (Math.random() - 0.5) * 80; // -40 to +40px

                gsap.fromTo(
                  char,
                  {
                    opacity: 0,
                    x: randomX,
                    y: randomY,
                    scale: 0.96,
                    filter: "blur(6px)",
                  },
                  {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 1.1,
                    ease: "power2.out",
                    delay: 0.18 + i * 0.045,
                  },
                );
              });
            }
          }, 50);
        }
      },
      prefersReducedMotion ? 0 : 100,
    );

    // Start typing animation after content loads
    if (!prefersReducedMotion) {
      setTimeout(() => {
        startTypingAnimation();
      }, 1200); // Start after initial fade-in
    } else {
      // If reduced motion is preferred, show first phrase immediately
      setTimeout(() => {
        typedText = textPhrases[0];
        showCursor = false;
      }, 1200);
    }
  });

  function startTypingAnimation() {
    let currentPhraseIndex = 0;
    const typingSpeed = 80; // milliseconds per character
    const erasingSpeed = 40; // milliseconds per character when erasing
    const pauseBetweenPhrases = 2000; // pause after typing before erasing
    const pauseBeforeTyping = 500; // pause after erasing before typing next

    function typePhrase() {
      const currentPhrase = textPhrases[currentPhraseIndex];
      let charIndex = 0;

      const typeInterval = setInterval(() => {
        if (charIndex < currentPhrase.length) {
          typedText = currentPhrase.slice(0, charIndex + 1);
          charIndex++;
        } else {
          clearInterval(typeInterval);
          // Wait before erasing
          setTimeout(() => {
            erasePhrase();
          }, pauseBetweenPhrases);
        }
      }, typingSpeed);
    }

    function erasePhrase() {
      const currentPhrase = textPhrases[currentPhraseIndex];
      let charIndex = currentPhrase.length;

      const eraseInterval = setInterval(() => {
        if (charIndex > 0) {
          typedText = currentPhrase.slice(0, charIndex - 1);
          charIndex--;
        } else {
          clearInterval(eraseInterval);
          // Move to next phrase
          currentPhraseIndex = (currentPhraseIndex + 1) % textPhrases.length;
          // Wait before typing next phrase
          setTimeout(() => {
            typePhrase();
          }, pauseBeforeTyping);
        }
      }, erasingSpeed);
    }

    // Start the animation
    typePhrase();
  }
</script>

<div
  class="mt-2 relative min-h-screen max-w-screen flex items-center justify-center overflow-hidden bg-black rounded-full"
>
  <!-- Enhanced solar background -->
  <div class="absolute inset-0 overflow-hidden rounded-full">
    <!-- Dynamic gradient background with animation -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-[#0a0500] via-black to-black opacity-30 rounded-full animate-gradient-shift"
    ></div>

    <!-- Floating particles -->
    <div class="absolute inset-0 rounded-full">
      {#each Array(20) as _, i}
        <div
          class="absolute w-1 h-1 bg-orange-400/40 rounded-full animate-float"
          style="
            left: {20 + i * 7}%;
            top: {15 + i * 6}%;
            animation-delay: {i * 0.3}s;
            animation-duration: {4 + (i % 3)}s;
          "
        ></div>
      {/each}
    </div>

    <!-- Solar rays -->
    <div class="absolute inset-0 rounded-full animate-rays">
      {#each Array(8) as _, i}
        <div
          class="absolute top-1/2 left-1/2 origin-bottom w-0.5 bg-gradient-to-t from-orange-500/20 to-transparent"
          style="
            height: {300 + (i % 2) * 100}px;
            transform: translate(-50%, -100%) rotate({i * 45}deg);
            animation-delay: {i * 0.2}s;
          "
        ></div>
      {/each}
    </div>

    <!-- Enhanced sun with multiple orbital layers -->
    <div class="absolute inset-0 rounded-full">
      <!-- Main sun orbit -->
      <div class="absolute top-0 left-0 w-full h-full animate-orbital">
        <div
          class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[min(900px,90vw)] aspect-square rounded-full bg-black/80"
        >
          <!-- Core glow -->
          <div
            class="absolute inset-0 rounded-full bg-gradient-radial from-orange-500/40 via-orange-500/15 to-transparent blur-3xl animate-pulse-glow"
          ></div>
          <!-- Solar flares -->
          <div
            class="absolute inset-0 rounded-full bg-gradient-radial from-orange-400/20 via-transparent to-transparent blur-2xl animate-flare"
          ></div>
          <!-- Orbital rings -->
          <div
            class="absolute inset-[-2px] rounded-full border-t-2 border-orange-500/20 animate-ring-rotate"
          ></div>
          <div
            class="absolute inset-[-1px] rounded-full border-t border-orange-500/10 animate-ring-rotate-reverse"
          ></div>
          <!-- Inner orbital ring -->
          <div
            class="absolute inset-[20px] rounded-full border border-orange-400/10 animate-ring-rotate-slow"
          ></div>
        </div>
      </div>

      <!-- Secondary smaller orbital elements -->
      <div
        class="absolute top-0 left-0 w-full h-full animate-orbital-secondary"
      >
        <div
          class="absolute top-1/4 left-1/3 w-3 h-3 rounded-full bg-orange-400/30 blur-sm"
        ></div>
      </div>
      <div class="absolute top-0 left-0 w-full h-full animate-orbital-tertiary">
        <div
          class="absolute top-2/3 right-1/4 w-2 h-2 rounded-full bg-orange-300/40 blur-sm"
        ></div>
      </div>
    </div>
  </div>

  <!-- Content Layer -->
  <div
    class="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center flex flex-col gap-16 lg:gap-20"
  >
    {#if isLoaded}
      <!-- Main Hero Content -->
      <div class="flex flex-col gap-4">
        <div>
          <h1
            class="text-7xl lg:text-9xl font-black tracking-tight font-clash-display leading-none"
            bind:this={titleElement}
          >
            <span
              class="bg-gradient-to-b from-white via-orange-50 to-orange-200/90 bg-clip-text text-transparent font-clash-display block"
            >
              SOLARIS
            </span>
            <span
              class="flex items-center justify-center text-4xl lg:text-5xl font-bold tracking-tight text-white mt-0 leading-tight"
            >
              <span class="pr-0.5">S</span>
              <span
                class="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 inline-block align-middle mx-[0.08em]"
                bind:this={sun}
              ></span>
              <span class="pl-0.5">FTWARE</span>
            </span>
          </h1>
        </div>

        <div class="space-y-8">
          <!-- Clear value proposition with better spacing -->
          <div class="space-y-6 max-w-4xl mx-auto">
            <h2
              class="text-2xl lg:text-3xl text-orange-100 leading-relaxed min-h-[4rem] lg:min-h-[3.5rem] font-general-sans"
            >
              We build software that fits your business<br />
              <span class="typing-text">{typedText}</span><span
                class="typing-cursor"
                class:visible={showCursor}>|</span
              >
            </h2>

            <p class="text-lg text-orange-100 leading-relaxed">
              What is your
              <span class="font-bold text-orange-300">competitive edge?</span>
              <br />We'll help you find it.
            </p>
          </div>

          <!-- Stats Row - Desktop Only -->
          <div class="hidden lg:flex justify-center items-center gap-12 py-6">
            {#each subheadings as subheading, i}
              <div
                in:fly={{ delay: 1000 + i * 200, y: 20, duration: 600 }}
                class="text-center"
              >
                <div
                  class="text-xl font-bold text-orange-300/90 font-clash-display"
                >
                  {subheading}
                </div>
              </div>
            {/each}
          </div>

          <div
            class="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href="/contact"
              class="group inline-flex items-center gap-3 px-8 py-4 text-white text-lg font-semibold rounded-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-300 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-orange-500/20 active:scale-95"
            >
              <span>Begin Your Journey</span>
              <svg
                class="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M4 12H20M20 12L14 6M20 12L14 18"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </a>
            <a
              href="/services"
              class="inline-flex items-center gap-3 px-8 py-4 text-orange-100 text-lg font-semibold rounded-full border-2 border-orange-500/30 hover:border-orange-400 hover:bg-orange-500/10 transition-all duration-300"
            >
              <span>Explore Services</span>
            </a>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  :global(body) {
    overflow-x: hidden;
  }

  .font-clash-display {
    font-family: "Clash Display", sans-serif;
    font-weight: 700;
  }

  .font-general-sans {
    font-family: "General Sans", sans-serif;
    font-weight: 400;
  }

  /* Enhanced orbital animations */
  @keyframes orbital {
    0% {
      transform: rotate(0deg) scale(0.95);
      opacity: 0.7;
    }
    25% {
      transform: rotate(90deg) scale(1.02);
      opacity: 1;
    }
    50% {
      transform: rotate(180deg) scale(0.95);
      opacity: 0.7;
    }
    75% {
      transform: rotate(270deg) scale(1.02);
      opacity: 1;
    }
    100% {
      transform: rotate(360deg) scale(0.95);
      opacity: 0.7;
    }
  }

  @keyframes orbital-secondary {
    0% {
      transform: rotate(0deg) scale(0.8);
      opacity: 0.5;
    }
    50% {
      transform: rotate(180deg) scale(1.1);
      opacity: 0.8;
    }
    100% {
      transform: rotate(360deg) scale(0.8);
      opacity: 0.5;
    }
  }

  @keyframes orbital-tertiary {
    0% {
      transform: rotate(360deg) scale(0.9);
      opacity: 0.6;
    }
    50% {
      transform: rotate(180deg) scale(1.05);
      opacity: 0.9;
    }
    100% {
      transform: rotate(0deg) scale(0.9);
      opacity: 0.6;
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px) scale(0.8);
      opacity: 0.3;
    }
    25% {
      transform: translateY(-20px) scale(1);
      opacity: 0.7;
    }
    50% {
      transform: translateY(-10px) scale(1.1);
      opacity: 0.9;
    }
    75% {
      transform: translateY(-30px) scale(0.9);
      opacity: 0.6;
    }
  }

  @keyframes pulse-glow {
    0%,
    100% {
      opacity: 0.4;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.05);
    }
  }

  @keyframes flare {
    0%,
    100% {
      opacity: 0.2;
      transform: scale(1) rotate(0deg);
    }
    33% {
      opacity: 0.4;
      transform: scale(1.1) rotate(120deg);
    }
    66% {
      opacity: 0.3;
      transform: scale(0.9) rotate(240deg);
    }
  }

  @keyframes ring-rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes ring-rotate-reverse {
    0% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes ring-rotate-slow {
    0% {
      transform: rotate(0deg);
      opacity: 0.1;
    }
    50% {
      opacity: 0.3;
    }
    100% {
      transform: rotate(360deg);
      opacity: 0.1;
    }
  }

  @keyframes rays {
    0%,
    100% {
      opacity: 0.2;
      transform: rotate(0deg);
    }
    50% {
      opacity: 0.4;
      transform: rotate(180deg);
    }
  }

  @keyframes gradient-shift {
    0%,
    100% {
      background: linear-gradient(to bottom, #0a0500, black, black);
    }
    50% {
      background: linear-gradient(to bottom, #0a0500, #1a0f00, black);
    }
  }

  /* Animation classes */
  .animate-orbital {
    animation: orbital 25s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    will-change: transform, opacity;
  }

  .animate-orbital-secondary {
    animation: orbital-secondary 35s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    will-change: transform, opacity;
  }

  .animate-orbital-tertiary {
    animation: orbital-tertiary 40s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    will-change: transform, opacity;
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
    will-change: transform, opacity;
  }

  .animate-pulse-glow {
    animation: pulse-glow 4s ease-in-out infinite;
    will-change: opacity, transform;
  }

  .animate-flare {
    animation: flare 8s ease-in-out infinite;
    will-change: opacity, transform;
  }

  .animate-ring-rotate {
    animation: ring-rotate 15s linear infinite;
    will-change: transform;
  }

  .animate-ring-rotate-reverse {
    animation: ring-rotate-reverse 20s linear infinite;
    will-change: transform;
  }

  .animate-ring-rotate-slow {
    animation: ring-rotate-slow 30s linear infinite;
    will-change: transform, opacity;
  }

  .animate-rays {
    animation: rays 12s ease-in-out infinite;
    will-change: opacity, transform;
  }

  .animate-gradient-shift {
    animation: gradient-shift 10s ease-in-out infinite;
    will-change: background;
  }

  /* Typing animation styles */
  .typing-cursor {
    display: inline-block;
    font-weight: 400;
    color: rgb(254 215 170); /* orange-200 */
    opacity: 0;
    transition: opacity 0.1s ease;
    margin-left: 2px;
  }

  .typing-cursor.visible {
    opacity: 1;
  }

  .typing-text {
    display: inline;
  }
</style>
