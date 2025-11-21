<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  // Package data
  const packages = [
    {
      name: "Company Starter",
      price: 1500,
      description:
        "Complete digital presence setup and ongoing support for your company",
      features: [
        "Company Website",
        "Booking System",
        "E-commerce Integration",
        "Social Media Setup",
        "Mobile Responsive Design",
        "Basic SEO Optimization",
        "Brand identity recommendations",
      ],
      popular: false,
    },
    {
      name: "Systems Analysis Report + Solutions",
      price: 3000,
      description:
        "Discover inefficiencies in your business and receive a report with recommendations for custom programs and workflows to improve your business.",
      features: [
        "Business Process Analysis",
        "Custom Program Recommendations",
        "Technology Stack Assessment",
        "Growth Strategy Planning",
        "Competitive Analysis",
        "ROI Projections",
      ],
      popular: true,
    },
    {
      name: "App Development",
      price: 5000,
      description:
        "Custom development of a mobile or desktop app. Please contact us for a quote.",
      features: [
        "Custom Development",
        "Custom Design",
        "Backend Development",
        "Frontend Development",
        "Database Design",
        "API Integration",
        "Testing and Deployment",
        "Ongoing Support",
      ],
      popular: false,
    },
    {
      name: "Updating existing software",
      price: 6000,
      description:
        "We can help you update your existing software to the latest version and ensure it is working correctly. Please contact us for a quote.",
      features: [
        "Software update",
        "Bug fixes",
        "Performance optimization",
        "Security updates",
        "Feature enhancements",
        "Ongoing support",
      ],
      popular: false,
    },
  ];

  let isVisible = $state(false);
  let container: HTMLElement;

  onMount(() => {
    // Fallback: Make visible after a short delay regardless of intersection
    const fallbackTimer = setTimeout(() => {
      if (!isVisible) {
        isVisible = true;
      }
    }, 500);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible = true;
            clearTimeout(fallbackTimer);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      },
    );

    if (container) {
      observer.observe(container);
    }

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  });
</script>

<div bind:this={container} class="relative py-16 md:py-24 bg-black">
  <!-- Subtle background gradient -->
  <div
    class="absolute inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black"
  ></div>

  <!-- Content -->
  <div class="relative z-10 max-w-7xl mx-auto px-4">
    {#if isVisible}
      <!-- Section Header -->
      <div
        in:fade={{ duration: 200 }}
        class="text-center mb-12 md:mb-16 space-y-4"
      >
        <h2
          class="text-3xl md:text-4xl lg:text-5xl font-display text-white mb-4"
        >
          Service Packages
        </h2>
        <p
          class="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed px-4"
        >
          Comprehensive solutions tailored to your business needs. Starting
          estimates for integrated service bundles.
        </p>
      </div>

      <!-- Packages Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {#each packages as pkg, i}
          <div
            class="relative group"
            in:fly={{
              y: 15,
              duration: 180,
              delay: i * 30,
            }}
          >
            <!-- Popular badge -->
            {#if pkg.popular}
              <div class="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                <span
                  class="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-medium"
                >
                  Most Popular
                </span>
              </div>
            {/if}

            <!-- Card -->
            <div
              class="h-full p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-orange-500/30 transition-all duration-300 flex flex-col group-hover:bg-white/8"
            >
              <!-- Header -->
              <div class="mb-6">
                <h3 class="text-xl md:text-2xl font-display text-white mb-3">
                  {pkg.name}
                </h3>
                <div class="flex items-baseline gap-2 mb-4">
                  <span class="text-3xl md:text-4xl font-bold text-orange-500">
                    ${pkg.price.toLocaleString()}
                  </span>
                  <span class="text-gray-400 text-sm">starting</span>
                </div>
                <p class="text-gray-300 leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              <!-- Features -->
              <ul class="space-y-3 flex-grow mb-8">
                {#each pkg.features as feature}
                  <li class="flex items-start gap-3 text-gray-300">
                    <div class="w-5 h-5 shrink-0 mt-0.5">
                      <svg
                        class="w-5 h-5 text-orange-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span>{feature}</span>
                  </li>
                {/each}
              </ul>

              <!-- CTA Button -->
              <a
                href="/contact/"
                class="block w-full py-3 md:py-4 px-6 text-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 touch-manipulation"
              >
                Get Started
              </a>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  /* Ensure cards are visible even without JavaScript */
  .group {
    opacity: 1;
    transform: translateY(0);
  }

  /* Card hover effects */
  .group:hover {
    transform: translateY(-2px);
    transition: transform 0.1s ease-out;
  }

  /* Mobile optimizations */
  @media (max-width: 768px) {
    .group:hover {
      transform: none;
    }
  }

  /* Fallback for no-JS or failed intersection observer */
  @media (prefers-reduced-motion: reduce) {
    .group {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  }
</style>
