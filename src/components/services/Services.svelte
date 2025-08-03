<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  let titleRef: HTMLSpanElement;

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Title animation
    if (titleRef) {
      // Set initial CSS properties for 3D transforms
      gsap.set(titleRef, {
        transformPerspective: 1000,
        transformOrigin: "center center",
      });

      gsap.fromTo(
        titleRef,
        {
          opacity: 0,
          y: 30,
          scale: 0.98,
          transformOrigin: "center center",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse",
            markers: false,
            // More responsive scroll behavior
            scrub: 0.5,
          },
        },
      );
    }
  });

  // Key services to highlight in hero
  const keyServices = [
    {
      id: "web-development",
      title: "Web Development",
      description:
        "Modern, scalable web solutions crafted with cutting-edge technologies.",
      icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
      </svg>`,
    },
    {
      id: "business-automation",
      title: "Business Automation",
      description:
        "Streamline operations and boost efficiency with intelligent automation.",
      icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>`,
    },
    {
      id: "ui-ux",
      title: "UI/UX Design",
      description:
        "Human-centered design that balances beauty with functionality.",
      icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2V5z"/>
      </svg>`,
    },
    {
      id: "custom-software",
      title: "Custom Software",
      description:
        "Tailor-made solutions designed for your unique business challenges.",
      icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>`,
    },
    {
      id: "e-commerce",
      title: "E-Commerce Solutions",
      description:
        "End-to-end platforms that deliver exceptional shopping experiences.",
      icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"/>
      </svg>`,
    },
    {
      id: "consulting",
      title: "Digital Consulting",
      description:
        "Expert guidance on digital transformation and strategic innovation.",
      icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
      </svg>`,
    },
  ];
</script>

<!-- Services Preview Grid - Enhanced Design -->
<div class="mt-16 lg:mt-24 relative">
  <!-- Background decoration -->
  <div class="absolute inset-0 -z-10">
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-full blur-3xl"
    ></div>
    <div
      class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-yellow-500/5 to-orange-500/5 rounded-full blur-2xl"
    ></div>
  </div>

  <!-- Header Section -->
  <div class="mb-16 lg:mb-20 text-center relative">
    <div class="inline-block mb-4">
      <span
        class="text-orange-400 text-sm font-semibold uppercase tracking-wider bg-orange-400/10 px-4 py-2 rounded-full border border-orange-400/20"
      >
        Our Expertise
      </span>
    </div>
    <h2
      class="text-3xl lg:text-5xl font-bold text-white mb-6 font-clash-display leading-tight"
    >
      <span class="text-white gsap-title" bind:this={titleRef}>
        What We Do
      </span>
    </h2>
    <p
      class="text-xl text-orange-200/90 max-w-2xl mx-auto leading-relaxed font-medium px-2 lg:px-0"
    >
      We translate your point of difference into digital systems.
    </p>
  </div>

  <!-- Mobile: Enhanced compact cards -->
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-6 max-w-3xl mx-auto px-4"
  >
    {#each keyServices.slice(0, 4) as service, i}
      <div
        class="mobile-service-card group relative overflow-hidden bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl rounded-3xl p-6 border border-orange-500/20 hover:border-orange-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2"
      >
        <!-- Gradient overlay -->
        <div
          class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500"
        ></div>

        <!-- Icon with gradient background -->
        <div class="relative mb-4">
          <div
            class="w-16 h-16 rounded-2xl bg-gradient-to-brp-4 mb-3 group-hover:scale-110 transition-transform duration-300"
          >
            <div class="text-white">
              {@html service.icon}
            </div>
          </div>
        </div>

        <h3
          class="text-xl font-bold text-white mb-2 group-hover:text-orange-200 transition-colors font-clash-display"
        >
          {service.title}
        </h3>
        <p class="text-orange-100/80 leading-relaxed font-medium">
          {service.description}
        </p>
      </div>
    {/each}
  </div>

  <!-- Desktop: Enhanced detailed grid -->
  <div class="hidden lg:grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
    {#each keyServices as service, i}
      <button
        class="service-card group relative overflow-hidden bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl rounded-3xl p-8 border border-orange-500/20 hover:border-orange-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 cursor-pointer text-left w-full focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:ring-offset-2 focus:ring-offset-transparent active:scale-[0.98]"
        onclick={() => (window.location.href = `/services`)}
        type="button"
      >
        <!-- Animated gradient overlay -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-800 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
        ></div>

        <!-- Floating particles effect -->
        <div
          class="absolute top-4 right-4 w-2 h-2 bg-orange-400/30 rounded-full group-hover:animate-ping"
        ></div>
        <div
          class="absolute top-8 right-8 w-1 h-1 bg-orange-300/40 rounded-full group-hover:animate-pulse"
        ></div>

        <!-- Icon with enhanced styling -->
        <div class="relative mb-6">
          <div
            class="w-20 h-20 rounded-3xl bg-gradient-to-br p-5 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg"
          >
            <div class="text-white">
              {@html service.icon}
            </div>
          </div>
        </div>

        <h3
          class="text-2xl font-bold text-white mb-3 group-hover:text-orange-200 transition-colors font-clash-display leading-tight"
        >
          {service.title}
        </h3>
        <p
          class="text-orange-100/80 leading-relaxed mb-6 text-base font-medium"
        >
          {service.description}
        </p>

        <!-- Enhanced CTA -->
        <div
          class="flex items-center text-orange-400 text-sm font-semibold group-hover:text-orange-300 transition-all duration-300"
        >
          <span class="mr-2">Explore Services</span>
          <div class="flex items-center overflow-hidden">
            <svg
              class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </button>
    {/each}
  </div>

  <!-- Enhanced Call to Action -->
  <div
    in:fly={{ delay: 1800, y: 30, duration: 800, easing: quintOut }}
    class="mt-5 text-center relative"
  >
    <div
      class="bg-gradient-to-r from-black/40 to-black/60 backdrop-blur-xl rounded-3xl p-8 lg:p-12 max-w-4xl mx-auto"
    >
      <p class="text-xl text-white mb-8 leading-relaxed">
        Ready to transform your business with cutting-edge solutions?
      </p>
      <a
        href="/services/"
        class="group inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-800 hover:from-orange-400 hover:to-orange-400 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/25 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:ring-offset-2 focus:ring-offset-transparent"
      >
        <span>View All Services</span>
        <svg
          class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </a>
    </div>
  </div>
</div>

<style>
  .font-clash-display {
    font-family: "Clash Display", sans-serif;
  }

  /* GSAP animation setup */
  .gsap-title {
    display: inline-block;
    transform-style: preserve-3d;
    perspective: 1000px;
  }

  /* Service cards animation setup */
  .service-card,
  .mobile-service-card {
    transform-style: preserve-3d;
  }

  /* Enhanced backdrop blur for better glass effect */
  .backdrop-blur-xl {
    backdrop-filter: blur(16px) saturate(180%);
  }

  /* Custom gradient text animation */
  @keyframes gradient-x {
    0%,
    100% {
      background-size: 200% 200%;
      background-position: left center;
    }
    50% {
      background-size: 200% 200%;
      background-position: right center;
    }
  }

  /* Smooth hover glow effect */
  .hover-glow {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hover-glow:hover {
    box-shadow:
      0 0 30px rgba(249, 115, 22, 0.3),
      0 10px 40px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  /* Floating animation for decorative elements */
  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .float-animation {
    animation: float 6s ease-in-out infinite;
  }

  /* Custom scrollbar for consistency */
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(249, 115, 22, 0.3);
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(249, 115, 22, 0.5);
  }
</style>
