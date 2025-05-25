<script lang="ts">
  import { onMount } from 'svelte';
  
  // Package data
  const packages = [
    {
      name: "Company Starter",
      price: 1500,
      description: "Complete digital presence setup for your company",
      features: [
        "Company Website",
        "Booking System",
        "E-commerce Integration",
        "Social Media Setup",
        "Mobile Responsive Design",
        "Basic SEO Optimization"
      ]
    },
    {
      name: "Systems Analysis",
      price: 2000,
      description: "Comprehensive business analysis with custom solutions",
      features: [
        "Business Process Analysis",
        "Custom Program Recommendations",
        "Technology Stack Assessment",
        "Growth Strategy Planning",
        "Competitive Analysis",
        "ROI Projections"
      ]
    }
  ];

  let cards: HTMLElement[] = [];

  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-8');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    cards.forEach(card => {
      if (card) {
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  });
</script>

<section class="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
  <!-- Section Title -->
  <div class="text-center mb-20">
    <h2
      class="text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
    >
      Special Package Bundles
    </h2>
    <p class="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
      Choose from our carefully crafted packages designed to give your business the digital edge it needs
    </p>
  </div>

  <!-- Packages Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
    {#each packages as pkg, i}
      <div
        class="relative group opacity-0 translate-y-8"
        bind:this={cards[i]}
        style="transition: all 0.7s ease-out {i * 150}ms;"
      >
        <div
          class="h-full p-8 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-white/10 hover:border-[#ff3d00]/30 transition-all duration-300"
        >
          <!-- Package Header -->
          <div class="mb-6">
            <h3 class="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
            <div class="flex items-baseline gap-1">
              <span class="text-3xl font-bold text-[#ff3d00]">${pkg.price}</span>
              <span class="text-white/60">starting price</span>
            </div>
            <p class="mt-3 text-white/70">{pkg.description}</p>
          </div>

          <!-- Features List -->
          <ul class="space-y-3">
            {#each pkg.features as feature}
              <li class="flex items-center gap-3 text-white/80">
                <svg
                  class="w-5 h-5 text-[#ff3d00]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {feature}
              </li>
            {/each}
          </ul>

          <!-- CTA Button -->
          <div class="mt-8">
            <a
              href="/contact"
              class="block w-full py-3 px-6 text-center rounded-full bg-gradient-to-r from-[#ff3d00] to-[#ff8a00] text-white font-medium hover:shadow-lg hover:shadow-[#ff3d00]/20 transition-all duration-300 hover:scale-105"
            >
              Get Started
            </a>
          </div>
        </div>

        <!-- Decorative gradient effect -->
        <div
          class="absolute -inset-px bg-gradient-to-r from-[#ff3d00] to-[#ff8a00] rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10"
        />
      </div>
    {/each}
  </div>
</section>

<style>
  /* These are now handled directly in the classes */
</style> 