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
    },
    {
      name: "Fortix Configuration",
      price: 10000,
      description:
        "We are partnered with Fortix, a CRM and business management platform, to sell instances and configure them to suite your business workflows.",
      features: [
        "Email templating",
        "Workflow automation",
        "Custom reports",
        "Custom integrations",
        "Custom views",
        "Custom dashboards",
        "Invoicing",
        "Customer date management",
      ],
    },
  ];

  let isVisible = $state(false);
  let container: HTMLElement;

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible = true;
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "50px",
      },
    );

    if (container) {
      observer.observe(container);
    }

    return () => observer.disconnect();
  });
</script>

<div bind:this={container} class="relative py-12 md:py-24">
  <!-- Background Elements -->
  <div class="absolute inset-0 overflow-hidden">
    <div
      class="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black"
    ></div>
    <div class="absolute inset-0">
      <div class="absolute w-full h-full">
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] aspect-square"
        >
          <div
            class="absolute inset-0 rounded-full bg-gradient-radial from-orange-500/5 via-orange-500/2 to-transparent blur-3xl"
          ></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Content -->
  <div class="relative z-10 max-w-7xl mx-auto px-4">
    {#if isVisible}
      <!-- Section Header -->
      <div
        in:fade={{ duration: 800 }}
        class="text-center mb-16 md:mb-20 space-y-4"
      >
        <h2
          class="text-3xl lg:text-4xl font-bold text-orange-200 font-clash-display"
        >
          Special Package Bundles
        </h2>
        <p class="text-xl text-orange-100/80 max-w-2xl mx-auto font-medium">
          Packages represent starting estimates for certain sets of related
          services.
        </p>
      </div>

      <!-- Packages Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {#each packages as pkg, i}
          <div
            class="relative group"
            in:fly={{
              y: 50,
              duration: 600,
              delay: i * 150,
              easing: quintOut,
            }}
          >
            <div
              class="h-full p-6 md:p-8 rounded-3xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] hover:border-orange-500/30 transition-all duration-300 flex flex-col overflow-hidden"
            >
              <!-- Package Header -->
              <div class="mb-6">
                <h3
                  class="text-2xl font-bold text-orange-200 mb-3 font-clash-display"
                >
                  {pkg.name}
                </h3>
                <div class="flex items-baseline gap-2 mb-4">
                  <span class="text-3xl font-bold text-orange-500"
                    >${pkg.price.toLocaleString()}</span
                  >
                  <span class="text-orange-100/60 text-sm">starting price</span>
                </div>
                <p class="text-orange-100/80 leading-relaxed font-medium">
                  {pkg.description}
                </p>
              </div>

              <!-- Features List -->
              <ul class="space-y-3 flex-grow">
                {#each pkg.features as feature}
                  <li class="flex items-start gap-3 text-orange-100/80">
                    <div class="relative w-5 h-5 shrink-0 mt-0.5">
                      <div
                        class="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff3d00] to-[#ff8a00] blur-sm opacity-50"
                      ></div>
                      <svg
                        class="relative w-5 h-5 text-orange-500"
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
                    <span class="font-medium">{feature}</span>
                  </li>
                {/each}
              </ul>

              <!-- CTA Button -->
              <div class="mt-8">
                <a
                  href="/contact/"
                  class="block w-full py-3 px-6 text-center rounded-full bg-gradient-to-r from-[#ff3d00] to-[#ff8a00] text-white font-medium hover:shadow-lg hover:shadow-[#ff3d00]/20 transition-all duration-300 group relative overflow-hidden"
                >
                  <span class="relative z-10">Get Started</span>
                  <div
                    class="absolute inset-0 bg-gradient-to-r from-[#ff8a00] to-[#ff3d00] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  ></div>
                </a>
              </div>
            </div>

            <!-- Solar prominence effect on hover -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-[#ff3d00] via-[#ff8a00] to-[#ff3d00] opacity-0 scale-x-0 group-hover:scale-x-100 group-hover:opacity-5 transition-all duration-700 rounded-3xl -z-20"
            ></div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  /* Optimize performance */
  .transition-all {
    transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }

  .font-clash-display {
    font-family: "Clash Display", sans-serif;
    font-weight: 700;
  }

  /* Text rendering optimization */
  h2,
  h3,
  p {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Prevent layout shifts during transitions */
  div {
    backface-visibility: hidden;
    transform-style: preserve-3d;
  }

  /* Custom gradient for radial background */
  .bg-gradient-radial {
    background: radial-gradient(circle, var(--tw-gradient-stops));
  }
</style>
