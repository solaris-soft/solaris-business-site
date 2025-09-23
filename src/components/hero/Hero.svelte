<script lang="ts">
  // Using Svelte 5 patterns - no need for onMount/onDestroy

  // GSAP imports
  let gsap: any;
  let ScrollTrigger: any;

  // Component state
  let isLoaded = $state(false);
  let heroContainer = $state<HTMLElement | null>(null);
  let titleElement = $state<HTMLElement | null>(null);
  let subtitleElement = $state<HTMLElement | null>(null);
  let sunElement = $state<HTMLElement | null>(null);
  let raysContainer = $state<HTMLElement | null>(null);
  let ctaButton = $state<HTMLElement | null>(null);
  let orbitingElements = $state<HTMLElement[]>([]);
  let backgroundDots = $state<HTMLElement | null>(null);

  // Cursor tracking for sun following
  let mouseX = $state(0);
  let mouseY = $state(0);
  let sunX = $state(0);
  let sunY = $state(0);
  let isMouseOverHero = $state(false);
  let isInitialized = $state(false);

  // Mouse tracking functions
  function handleMouseMove(event: MouseEvent) {
    if (!heroContainer || !sunElement) return;

    const rect = heroContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate relative position from center (-1 to 1)
    const relativeX = (event.clientX - centerX) / (rect.width / 2);
    const relativeY = (event.clientY - centerY) / (rect.height / 2);

    // Constrain movement to reasonable bounds (max 30px from center)
    const maxDistance = 30;
    const newSunX = Math.max(
      -maxDistance,
      Math.min(maxDistance, relativeX * maxDistance),
    );
    const newSunY = Math.max(
      -maxDistance,
      Math.min(maxDistance, relativeY * maxDistance),
    );

    // Update state
    sunX = newSunX;
    sunY = newSunY;
  }

  function handleMouseEnter() {
    isMouseOverHero = true;
  }

  function handleMouseLeave() {
    isMouseOverHero = false;
    // Return sun to center when mouse leaves
    sunX = 0;
    sunY = 0;
  }

  // Initialize component - using Svelte 5 effect instead of onMount
  $effect(() => {
    if (isInitialized) return; // Prevent multiple initializations

    // Detect mobile device for performance optimizations
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Load content
    setTimeout(() => {
      isLoaded = true;
    }, 100);

    // Load GSAP for animations
    if (!prefersReducedMotion) {
      (async () => {
        try {
          const [gsapModule, scrollTriggerModule] = await Promise.all([
            import("gsap"),
            import("gsap/ScrollTrigger"),
          ]);

          gsap = gsapModule.default;
          ScrollTrigger = scrollTriggerModule.ScrollTrigger;

          // Setup animations with mobile optimizations
          setTimeout(() => {
            setupAnimations(isMobile);
          }, 300);
        } catch (error) {
          console.warn("GSAP failed to load:", error);
          // Ensure title is visible even if GSAP fails
          if (titleElement) {
            titleElement.style.opacity = "1";
            titleElement.style.visibility = "visible";
          }
        }
      })();
    } else {
      // If reduced motion is preferred, ensure title is still visible
      setTimeout(() => {
        if (titleElement) {
          titleElement.style.opacity = "1";
          titleElement.style.visibility = "visible";
        }
      }, 100);
    }
  });

  // Create particle burst effect
  function createParticleBurst(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create multiple particles
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement("div");
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, #f97316, #fb923c);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${centerX}px;
        top: ${centerY}px;
      `;

      document.body.appendChild(particle);

      // Animate particle burst
      const angle = (i / 12) * Math.PI * 2;
      const distance = 60 + Math.random() * 40;
      const endX = centerX + Math.cos(angle) * distance;
      const endY = centerY + Math.sin(angle) * distance;

      gsap.to(particle, {
        x: endX - centerX,
        y: endY - centerY,
        scale: 0,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        onComplete: () => {
          document.body.removeChild(particle);
        },
      });
    }
  }

  function setupAnimations(isMobile = false) {
    if (!gsap || !ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    // Title is already visible by default

    // Initial entrance timeline
    const tl = gsap.timeline({ delay: 0.5 });

    // Animate background dots with mobile optimization
    if (backgroundDots) {
      tl.fromTo(
        backgroundDots,
        {
          opacity: 0,
          scale: 0.8,
        },
        {
          opacity: 1,
          scale: 1,
          duration: isMobile ? 1 : 2,
          ease: "power2.out",
        },
      );

      // Reduce movement complexity on mobile
      if (!isMobile) {
        // Add subtle floating movement to background
        gsap.to(backgroundDots, {
          x: 20,
          y: 15,
          duration: 8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        // Add gentle scale breathing
        gsap.to(backgroundDots, {
          scale: 1.05,
          duration: 6,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    }

    // Animate sun with mobile optimization
    if (sunElement) {
      tl.fromTo(
        sunElement,
        {
          scale: 0,
          opacity: 0,
          rotation: isMobile ? 0 : -360,
          x: isMobile ? 0 : -100,
          y: isMobile ? 0 : 100,
        },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          x: 0,
          y: 0,
          duration: isMobile ? 1 : 2,
          ease: isMobile ? "power2.out" : "elastic.out(1, 0.5)",
        },
        "-=1.5",
      );

      // Reduce animations on mobile for performance
      if (!isMobile) {
        // Enhanced continuous rotation with variable speed
        gsap.to(sunElement, {
          rotation: 360,
          duration: 15,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
        });

        // Add floating movement
        gsap.to(sunElement, {
          y: -15,
          x: 10,
          duration: 6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        // Add subtle rotation wobble
        gsap.to(sunElement, {
          rotationZ: 5,
          duration: 4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // Simple breathing scale for both mobile and desktop
      gsap.fromTo(
        sunElement,
        { scale: 1 },
        {
          scale: isMobile ? 1.1 : 1.2,
          duration: isMobile ? 4 : 3,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
        },
      );
    }

    // Animate energy rings with mobile optimization
    const energyRings = heroContainer?.querySelectorAll(".energy-ring");
    if (energyRings) {
      Array.from(energyRings).forEach((ring, index) => {
        // Simplified entrance animation for mobile
        tl.fromTo(
          ring,
          {
            scale: 0,
            opacity: 0,
            rotation: isMobile ? 0 : -180,
          },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: isMobile ? 0.8 : 1.5 + index * 0.3,
            ease: isMobile ? "power2.out" : "elastic.out(1, 0.5)",
            delay: isMobile ? index * 0.1 : index * 0.2,
          },
          "-=1.2",
        );

        // Reduce continuous animations on mobile
        if (!isMobile) {
          // Continuous pulsing expansion
          gsap.to(ring, {
            scale: 1.2 + index * 0.1,
            duration: 4 + index * 0.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });

          // Slow rotation
          gsap.to(ring, {
            rotation: 360,
            duration: 20 + index * 10,
            ease: "none",
            repeat: -1,
          });
        }

        // Simplified opacity breathing for both platforms
        gsap.to(ring, {
          opacity: isMobile ? 0.2 + index * 0.1 : 0.1 + index * 0.05,
          duration: isMobile ? 4 : 3 + index * 0.4,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
          delay: index * 0.3,
        });
      });
    }

    // Animate light particles with mobile optimization
    const lightParticles = heroContainer?.querySelectorAll(".light-particle");
    if (lightParticles && !isMobile) {
      // Skip particle animations on mobile for performance
      Array.from(lightParticles).forEach((particle, index) => {
        // Staggered entrance
        tl.fromTo(
          particle,
          {
            scale: 0,
            opacity: 0,
            y: 100,
          },
          {
            scale: 1,
            opacity: 0.8,
            y: 0,
            duration: 1.5,
            ease: "power3.out",
            delay: index * 0.08,
          },
          "-=1.0",
        );

        // Floating motion with varying patterns
        const floatDistance = 40 + Math.random() * 60;
        const floatAngle = (index / lightParticles.length) * Math.PI * 2;

        gsap.to(particle, {
          x: Math.cos(floatAngle) * floatDistance,
          y: Math.sin(floatAngle) * floatDistance,
          duration: 6 + index * 0.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        // Sparkle effect
        gsap.to(particle, {
          scale: 2 + Math.random(),
          opacity: 0.2 + Math.random() * 0.6,
          duration: 1.5 + Math.random() * 2,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
          delay: Math.random() * 2,
        });

        // Rotation for dynamic movement
        gsap.to(particle, {
          rotation: 360,
          duration: 8 + Math.random() * 4,
          ease: "none",
          repeat: -1,
        });
      });
    } else if (lightParticles && isMobile) {
      // Simple fade-in for mobile
      Array.from(lightParticles).forEach((particle, index) => {
        tl.fromTo(
          particle,
          { opacity: 0 },
          {
            opacity: 0.6,
            duration: 0.5,
            delay: index * 0.05,
          },
          "-=0.5",
        );
      });
    }

    // Animate orbiting elements with enhanced movement
    orbitingElements.forEach((element, index) => {
      if (element) {
        tl.fromTo(
          element,
          {
            scale: 0,
            opacity: 0,
            rotation: -180,
          },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.5)",
          },
          `-=${0.4 - index * 0.1}`,
        );

        // Enhanced orbital motion with varying speeds and directions
        const radius = 180 + index * 40;
        const duration = 12 + index * 3;
        const direction = index % 2 === 0 ? 360 : -360;

        gsap.to(element, {
          rotation: direction,
          duration: duration,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: index % 2 === 1,
          transformOrigin: `0px ${radius}px`,
        });

        // Add individual element pulsing
        gsap.to(element, {
          scale: 1.3 + Math.random() * 0.4,
          duration: 2 + index * 0.5,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
        });

        // Add subtle floating movement
        gsap.to(element, {
          y: (Math.random() - 0.5) * 20,
          x: (Math.random() - 0.5) * 15,
          duration: 4 + index * 0.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    });

    // Advanced title animation with morphing and energy effects
    if (titleElement) {
      // Ensure title container is visible
      gsap.set(titleElement, {
        opacity: 1,
        visibility: "visible",
        display: "block",
      });

      // Split text into characters for advanced animation
      const text = titleElement.textContent || "";
      const words = text.split(" ");

      // Create clean HTML structure without energy containers
      titleElement.innerHTML = words
        .map((word, wordIndex) => {
          const letters = word.split("");
          return `<span class="word-container" style="display: inline-block; margin-right: 0.3em;">
            ${letters
              .map(
                (letter, letterIndex) =>
                  `<span class="letter" style="
                  display: inline-block; 
                  transform: translateY(20px); 
                  opacity: 0;
                ">${letter}</span>`,
              )
              .join("")}
          </span>`;
        })
        .join("");

      const letters = titleElement.querySelectorAll(".letter");
      const wordContainers = titleElement.querySelectorAll(".word-container");

      // Set proper transform origins
      gsap.set(letters, {
        transformOrigin: "center bottom",
      });

      // Create the main entrance timeline with shorter delay
      const textTimeline = gsap.timeline({ delay: 0.3 });

      // Remove energy fields for cleaner approach

      // Simple letter entrance - clean and smooth
      textTimeline.to(
        letters,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          stagger: {
            amount: 0.4,
            from: "start",
          },
        },
        0.2,
      );

      // Remove energy field explosion effect

      // Remove glow effects - just settle into clean state
      textTimeline.to(
        titleElement,
        {
          textShadow: "none",
          duration: 0.3,
          ease: "power2.out",
        },
        "-=0.2",
      );

      // Gentle word floating - much more subtle
      wordContainers.forEach((word, index) => {
        gsap.to(word, {
          y: Math.sin(index * 1.2) * 1.5,
          duration: 6 + index * 0.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 4 + index * 0.3,
        });
      });

      // Remove individual letter micro-physics for cleaner effect
    }

    // Simple subtitle animation - no word splitting to avoid spacing issues
    if (subtitleElement) {
      // Animate subtitle in after title completes (no setTimeout delay)
      // Fade in subtitle container
      if (subtitleElement?.parentElement) {
        gsap.fromTo(
          subtitleElement.parentElement,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            delay: 1.5, // Start after title animation
          },
        );
      }

      // Simple fade in for the entire subtitle
      gsap.fromTo(
        subtitleElement,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 1.8, // Start slightly after container
        },
      );
    }

    // Simple CTA button animation
    if (ctaButton) {
      // Simple entrance
      gsap.fromTo(
        ctaButton,
        {
          scale: 0.8,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          delay: 1.5,
        },
      );

      // Gentle floating animation
      gsap.to(ctaButton, {
        y: -2,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 3.5,
      });

      // Magnetic hover effect setup
      const magneticArea = 100;

      ctaButton.addEventListener("mousemove", (e) => {
        if (!ctaButton) return;
        const rect = ctaButton.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < magneticArea) {
          const strength = (magneticArea - distance) / magneticArea;
          gsap.to(ctaButton, {
            x: deltaX * strength * 0.3,
            y: deltaY * strength * 0.3,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      });

      ctaButton.addEventListener("mouseleave", () => {
        if (!ctaButton) return;
        gsap.to(ctaButton, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)",
        });
      });
    }

    // Scroll-triggered parallax
    if (heroContainer) {
      ScrollTrigger.create({
        trigger: heroContainer,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self: any) => {
          const progress = self.progress;

          // Parallax sun system movement
          const sunSystem = heroContainer?.querySelector(".sun-system");
          if (sunSystem) {
            gsap.set(sunSystem, {
              y: progress * -60,
              scale: 1 - progress * 0.1,
              rotationZ: progress * 90,
            });
          }

          // Fade title on scroll
          if (titleElement) {
            gsap.set(titleElement, {
              opacity: 1 - progress * 0.7,
              y: progress * -100,
            });
          }

          // Subtle subtitle movement
          if (subtitleElement) {
            gsap.set(subtitleElement, {
              opacity: 1 - progress * 0.5,
              y: progress * -50,
            });
          }
        },
      });
    }

    // Mark as initialized
    isInitialized = true;
  }

  // Set up event listeners when heroContainer is available
  $effect(() => {
    if (heroContainer) {
      heroContainer.addEventListener("mousemove", handleMouseMove);
      heroContainer.addEventListener("mouseenter", handleMouseEnter);
      heroContainer.addEventListener("mouseleave", handleMouseLeave);

      // Cleanup function
      return () => {
        heroContainer.removeEventListener("mousemove", handleMouseMove);
        heroContainer.removeEventListener("mouseenter", handleMouseEnter);
        heroContainer.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  });

  // Reactive statement to update sun position smoothly
  $effect(() => {
    if (sunElement && gsap) {
      gsap.to(sunElement, {
        x: sunX,
        y: sunY,
        duration: 0.3,
        ease: "power2.out",
      });

      // Add subtle scale effect when mouse is over hero
      gsap.to(sunElement, {
        scale: isMouseOverHero ? 1.1 : 1,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  });
</script>

<div
  bind:this={heroContainer}
  class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white"
  data-speed="0.8"
>
  <!-- Subtle background pattern -->
  <div
    bind:this={backgroundDots}
    class="absolute inset-0 opacity-5"
    style="background-image: radial-gradient(circle at 2px 2px, #f97316 1px, transparent 0); background-size: 60px 60px;"
    data-speed="0.5"
    data-lag="0.1"
  ></div>

  <!-- Sun system design - positioned above content -->
  <div class="relative flex items-center justify-center mb-8">
    <!-- Orbiting elements -->
    <div class="absolute inset-0 flex items-center justify-center"></div>

    <!-- Sophisticated sun system -->
    <div
      class="relative sun-system"
      style="width: 300px; height: 300px;"
      data-speed="1.2"
      data-lag="0.2"
    >
      <!-- Energy rings -->
      <div class="absolute inset-0 energy-rings">
        {#each Array(3) as _, i}
          <div
            class="absolute energy-ring"
            style="
              width: {80 + i * 50}px;
              height: {80 + i * 50}px;
              border: 1px solid rgba(249, 115, 22, 0.{3 - i}0);
              border-radius: 50%;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
          "
          ></div>
        {/each}
      </div>

      <!-- Central sun with layered effect -->
      <div
        class="absolute sun-core"
        style="top: 50%; left: 50%; transform: translate(-50%, -50%);"
      >
        <!-- Outer glow -->
        <div
          class="absolute w-32 h-32 rounded-full opacity-10"
          style="background: radial-gradient(circle, rgba(249, 115, 22, 0.3), transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%);"
        ></div>

        <!-- Middle layer -->
        <div
          class="absolute w-24 h-24 rounded-full opacity-15"
          style="background: radial-gradient(circle, rgba(249, 115, 22, 0.4), transparent 60%); top: 50%; left: 50%; transform: translate(-50%, -50%);"
        ></div>

        <!-- Main sun -->
        <div
          bind:this={sunElement}
          class="relative w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 opacity-25 sun-glow"
        ></div>
      </div>

      <!-- Floating light particles -->
      <div class="absolute inset-0 light-particles">
        {#each Array(12) as _, i}
          <div
            class="absolute light-particle"
            style="
              width: {2 + Math.random() * 3}px; 
              height: {2 + Math.random() * 3}px; 
              background: rgba(249, 115, 22, 0.{Math.floor(
              3 + Math.random() * 4,
            )});
              border-radius: 50%;
              top: {30 + Math.sin(i * 0.5) * 20}%;
              left: {30 + Math.cos(i * 0.5) * 20}%;
              filter: blur(0.5px);
            "
          ></div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Content -->
  <div
    class="relative z-20 max-w-4xl mx-auto px-6 text-center"
    data-speed="0.9"
  >
    <!-- Main title - Always visible -->
    <h1
      bind:this={titleElement}
      class="text-5xl md:text-7xl lg:text-8xl text-black mb-8 leading-tight tracking-tight font-bold"
      style="opacity: 1; visibility: visible; display: block;"
    >
      Solaris Software
    </h1>

    {#if isLoaded}
      <!-- Subtitle with minimal orange accent -->
      <div class="relative mb-12">
        <h2
          bind:this={subtitleElement}
          class="text-lg md:text-xl text-gray-700 font-light tracking-wide max-w-2xl mx-auto"
          style="opacity: 0; transform: translateY(20px);"
        >
          Where your business meets its sunrise.
        </h2>
      </div>

      <!-- Enhanced CTA -->
      <div class="relative">
        <button
          bind:this={ctaButton}
          class="group relative px-8 py-4 bg-black text-white font-medium rounded-full hover:bg-gray-900 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg overflow-hidden"
        >
          <span class="relative z-10 px-4 py-2">Start Your Project</span>
          <!-- Hover effect background -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  /* Smooth font rendering */
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Word animation classes */
  :global(.word) {
    display: inline-block;
    margin-right: 0.2em;
  }

  /* Clean text animation styles */
  :global(.letter) {
    will-change: transform, opacity;
  }

  :global(.word-container) {
    display: inline-block;
  }

  /* Sophisticated sun system */
  .sun-system {
    position: relative;
    perspective: 1000px;
  }

  /* Energy rings styling */
  .energy-ring {
    will-change: transform, opacity, scale;
    filter: drop-shadow(0 0 10px rgba(249, 115, 22, 0.2));
  }

  /* Light particles styling */
  .light-particle {
    will-change: transform, opacity, scale;
    filter: blur(0.5px) drop-shadow(0 0 4px rgba(249, 115, 22, 0.5));
  }

  /* Sun core enhancements */
  .sun-core {
    filter: drop-shadow(0 0 30px rgba(249, 115, 22, 0.4));
  }

  /* Subtle hover effects */
  button:hover {
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  /* Sun glow effect */
  .sun-glow {
    box-shadow:
      0 0 60px rgba(249, 115, 22, 0.3),
      0 0 120px rgba(249, 115, 22, 0.1);
  }

  /* Hide overflow for clean look */
  :global(body) {
    overflow-x: hidden;
  }
</style>
