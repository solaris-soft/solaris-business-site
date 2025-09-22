<script>
  import { onMount } from "svelte";
  import { gsap } from "gsap";

  let container;
  let isVisible = false;
  let hasAnimated = false;
  let observer;

  onMount(() => {
    // Set up intersection observer for cleaner scroll detection
    setupIntersectionObserver();

    // Set up immediate hover animations
    setupHoverAnimations();

    // Create ambient background animations
    createAmbientAnimations();

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  });

  function setupIntersectionObserver() {
    const options = {
      threshold: 0.3,
      rootMargin: "0px 0px -10% 0px",
    };

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          isVisible = true;
          animateSection();
        }
      });
    }, options);

    if (container) {
      observer.observe(container);
    }
  }

  function animateSection() {
    const title = container.querySelector(".title");
    const subtitle = container.querySelector(".subtitle");
    const cardLarge = container.querySelector(".card-large");
    const cardsSmall = container.querySelectorAll(".card-small");
    const cta = container.querySelector(".cta");
    const geometricShapes = container.querySelectorAll(
      "[class*='geometric-bg-']",
    );

    // Create main timeline for coordinated animations
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    // Animate geometric background shapes first
    tl.fromTo(
      geometricShapes,
      { scale: 0, rotation: 0, opacity: 0 },
      {
        scale: 1,
        rotation: (i) => [45, 12, -12][i] || 0,
        opacity: (i) => [0.05, 0.1, 0.03][i] || 0.05,
        duration: 1.5,
        stagger: 0.2,
        ease: "back.out(1.2)",
      },
    );

    // Animate title with dramatic entrance
    tl.fromTo(
      title,
      { opacity: 0, y: 100, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "back.out(1.4)" },
      "-=1",
    );

    // Animate orange accent line
    const accentLine = container.querySelector(".w-16.h-1.bg-orange-500");
    if (accentLine) {
      tl.fromTo(
        accentLine,
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1, duration: 0.8, ease: "power2.out" },
        "-=0.8",
      );
    }

    // Animate subtitle
    tl.fromTo(
      subtitle,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.8 },
      "-=0.6",
    );

    // Animate large feature card
    tl.fromTo(
      cardLarge,
      { opacity: 0, y: 80, rotationX: 15 },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 1,
        ease: "back.out(1.2)",
      },
      "-=0.3",
    );

    // Animate small cards with dynamic stagger
    tl.fromTo(
      cardsSmall,
      {
        opacity: 0,
        y: 100,
        rotationY: 15,
        scale: 0.8,
      },
      {
        opacity: 1,
        y: 0,
        rotationY: 0,
        scale: 1,
        duration: 0.8,
        stagger: {
          amount: 0.6,
          from: "random",
        },
        ease: "back.out(1.4)",
      },
      "-=0.5",
    );

    // Animate all icons with special timing
    const icons = container.querySelectorAll(".icon-container");
    tl.fromTo(
      icons,
      { scale: 0, rotation: 270, opacity: 0 },
      {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.7,
        stagger: {
          amount: 0.8,
          from: "start",
        },
        ease: "back.out(2.5)",
      },
      "-=0.6",
    );

    // Animate CTA with border reveal
    tl.fromTo(
      cta,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8 },
      "-=0.3",
    );

    // Start subtle breathing animations after main animation
    tl.call(() => {
      startBreathingAnimations();
      animateGeometricShapes();
    });
  }

  function startBreathingAnimations() {
    const icons = container.querySelectorAll(".icon-container");

    icons.forEach((icon, index) => {
      gsap.to(icon, {
        scale: 1.05,
        duration: 3 + index * 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.3,
      });
    });
  }

  function animateGeometricShapes() {
    const shapes = container.querySelectorAll("[class*='geometric-bg-']");

    shapes.forEach((shape, index) => {
      gsap.to(shape, {
        rotation: `+=${[360, -180, 270][index] || 180}`,
        duration: [20, 25, 30][index] || 25,
        repeat: -1,
        ease: "none",
        delay: index * 2,
      });
    });
  }

  function createAmbientAnimations() {
    // Create floating particles
    const particleContainer = container?.querySelector(".particle-container");
    if (!particleContainer) return;

    for (let i = 0; i < 8; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";

      const size = Math.random() * 2 + 0.5;
      const isOrange = Math.random() < 0.3; // 30% chance of orange, 70% white

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${
          isOrange
            ? `rgba(249, 115, 22, ${Math.random() * 0.4 + 0.2})`
            : `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`
        };
        border-radius: 50%;
        pointer-events: none;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        z-index: 1;
      `;

      particleContainer.appendChild(particle);

      // Continuous floating animation
      gsap.to(particle, {
        x: `random(-80, 80)`,
        y: `random(-120, 120)`,
        rotation: 360,
        duration: `random(20, 35)`,
        repeat: -1,
        yoyo: true,
        ease: "none",
        delay: Math.random() * 8,
      });
    }
  }

  function setupHoverAnimations() {
    // Use event delegation for better performance
    container?.addEventListener(
      "mouseenter",
      (e) => {
        const card = e.target.closest(".card");
        if (!card) return;

        const icon = card.querySelector(".icon-container");
        const isLarge = card.classList.contains("card-large");
        const isSmall = card.classList.contains("card-small");

        if (isLarge) {
          gsap.to(card, {
            y: -6,
            scale: 1.01,
            duration: 0.4,
            ease: "power2.out",
          });

          gsap.to(icon, {
            scale: 1.15,
            rotation: 8,
            duration: 0.4,
            ease: "back.out(1.5)",
          });
        } else if (isSmall) {
          gsap.to(card, {
            y: -12,
            scale: 1.03,
            rotationY: 2,
            duration: 0.3,
            ease: "power2.out",
          });

          gsap.to(icon, {
            scale: 1.2,
            rotation: -8,
            duration: 0.3,
            ease: "back.out(1.8)",
          });
        }
      },
      true,
    );

    container?.addEventListener(
      "mouseleave",
      (e) => {
        const card = e.target.closest(".card");
        if (!card) return;

        const icon = card.querySelector(".icon-container");

        gsap.to(card, {
          y: 0,
          scale: 1,
          rotationY: 0,
          duration: 0.5,
          ease: "power2.out",
        });

        gsap.to(icon, {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      },
      true,
    );
  }
</script>

<div
  bind:this={container}
  class="min-h-screen relative bg-black overflow-hidden"
>
  <!-- Geometric background elements -->
  <div class="particle-container absolute inset-0 z-0"></div>

  <!-- Large geometric shapes -->
  <div class="absolute inset-0 z-0">
    <div
      class="geometric-bg-1 absolute w-96 h-96 bg-white opacity-5 transform rotate-45 -top-24 -left-24"
    ></div>
    <div
      class="geometric-bg-2 absolute w-64 h-64 bg-orange-500 opacity-10 transform rotate-12 top-1/4 right-10"
    ></div>
    <div
      class="geometric-bg-3 absolute w-80 h-80 bg-white opacity-3 transform -rotate-12 bottom-10 left-1/4"
    ></div>
  </div>

  <div class="container mx-auto px-6 md:px-8 max-w-7xl relative z-10 py-20">
    <!-- Asymmetric Header -->
    <div class="mb-32 relative">
      <div class="flex flex-col lg:flex-row items-start lg:items-center gap-12">
        <div class="lg:w-2/3">
          <div class="mb-6">
            <div class="w-16 h-1 bg-orange-500 mb-8"></div>
            <h2
              class="title text-6xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-none tracking-tight"
            >
              How We
              <span class="block text-outline">Work</span>
            </h2>
          </div>
        </div>
        <div class="lg:w-1/3">
          <p class="subtitle text-lg md:text-xl text-gray-300 leading-relaxed">
            We deliver the edge your business needs to be highly competitive in
            the market through systematic excellence.
          </p>
        </div>
      </div>
    </div>

    <!-- Unique Services Layout -->
    <div class="services-grid mb-32">
      <!-- Large Feature Card -->
      <div
        class="card card-large relative bg-white border-2 border-black p-12 mb-8"
      >
        <div class="flex flex-col lg:flex-row items-center gap-8">
          <div
            class="icon-container w-24 h-24 bg-black flex items-center justify-center"
          >
            <svg
              class="service-icon w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              ></path>
            </svg>
          </div>
          <div class="flex-1">
            <h3
              class="text-3xl md:text-4xl font-display font-bold text-black mb-4"
            >
              Cloud Solutions
            </h3>
            <p class="text-lg text-black leading-relaxed">
              Scalable infrastructure that grows with your business, providing
              enterprise-grade solutions without the enterprise complexity.
            </p>
          </div>
          <div class="hidden lg:block w-2 h-24 bg-orange-500"></div>
        </div>
      </div>

      <!-- Grid of smaller cards -->
      <div class="grid md:grid-cols-3 gap-6">
        <!-- Web Apps -->
        <div
          class="card card-small bg-black border-2 border-white p-8 text-white"
        >
          <div
            class="icon-container w-16 h-16 bg-white mb-6 flex items-center justify-center"
          >
            <svg
              class="service-icon w-8 h-8 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-display font-bold mb-4">Web Applications</h3>
          <p class="text-gray-300 leading-relaxed">
            Custom-built solutions tailored to your workflow
          </p>
        </div>

        <!-- Business Software -->
        <div class="card card-small bg-white border-2 border-black p-8">
          <div
            class="icon-container w-16 h-16 bg-orange-500 mb-6 flex items-center justify-center"
          >
            <svg
              class="service-icon w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-display font-bold text-black mb-4">
            Business Software
          </h3>
          <p class="text-black leading-relaxed">
            Automation and efficiency tools for modern operations
          </p>
        </div>

        <!-- UI/UX Design -->
        <div
          class="card card-small bg-black border-2 border-white p-8 text-white"
        >
          <div
            class="icon-container w-16 h-16 bg-white mb-6 flex items-center justify-center"
          >
            <svg
              class="service-icon w-8 h-8 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-display font-bold mb-4">UI/UX Design</h3>
          <p class="text-gray-300 leading-relaxed">
            Intuitive interfaces that place you ahead of competition
          </p>
        </div>
      </div>
    </div>

    <!-- Minimal CTA -->
    <div class="cta">
      <div class="border-t border-white border-opacity-20 pt-16">
        <div
          class="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div>
            <h3
              class="text-2xl md:text-3xl font-display font-bold text-white mb-2"
            >
              Ready to gain your competitive edge?
            </h3>
            <p class="text-gray-400">
              Let's discuss how we can transform your business.
            </p>
          </div>
          <div class="cta-button">
            <button
              class="group px-12 py-4 bg-orange-500 text-black font-bold uppercase tracking-wider hover:bg-white transition-all duration-300 border-2 border-orange-500 hover:border-white"
            >
              <span
                class="group-hover:scale-110 transition-transform duration-200 inline-block"
              >
                Let's Work Together
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Initial hidden states - GSAP will handle visibility */
  .title,
  .subtitle,
  .card,
  .cta {
    opacity: 0;
  }

  .icon-container {
    opacity: 0;
  }

  /* Text outline effect for "Work" */
  .text-outline {
    -webkit-text-stroke: 2px white;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }

  /* Geometric background shapes */
  .geometric-bg-1,
  .geometric-bg-2,
  .geometric-bg-3 {
    pointer-events: none;
  }

  /* Card styling */
  .card {
    transform: translateZ(0);
    backface-visibility: hidden;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .card-large:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .card-small:hover {
    transform: translateY(-8px) scale(1.02);
  }

  .card-small.bg-black:hover {
    box-shadow: 0 15px 30px rgba(255, 255, 255, 0.1);
  }

  .card-small.bg-white:hover {
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }

  /* Icon containers */
  .icon-container {
    transform: translateZ(0);
    backface-visibility: hidden;
    transition: all 0.3s ease;
  }

  /* Large card icon special hover */
  .card-large:hover .icon-container {
    transform: rotate(5deg) scale(1.1);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }

  /* Small card icon hover */
  .card-small:hover .icon-container {
    transform: rotate(-5deg) scale(1.1);
  }

  /* Particle styling */
  :global(.particle) {
    border-radius: 50%;
    pointer-events: none;
    z-index: 1;
  }

  /* CTA button styling */
  .cta-button button {
    transform: translateZ(0);
    position: relative;
    overflow: hidden;
  }

  .cta-button button::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s ease;
  }

  .cta-button button:hover::before {
    left: 100%;
  }

  .cta-button button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(249, 115, 22, 0.4);
  }

  .cta-button button:active {
    transform: translateY(0);
  }

  /* Services grid responsive adjustments */
  .services-grid {
    position: relative;
  }

  /* Performance optimizations */
  .card,
  .icon-container,
  .cta-button button,
  .geometric-bg-1,
  .geometric-bg-2,
  .geometric-bg-3 {
    will-change: transform;
  }

  /* Text selection styling */
  ::selection {
    background-color: rgba(249, 115, 22, 0.3);
    color: white;
  }

  /* Smooth transitions for all interactive elements */
  * {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>
