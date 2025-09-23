<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = $state(null);
  let particles: Particle[] = $state([]);
  let mousePos = $state({ x: 0, y: 0 });
  let width = $state(0);
  let height = $state(0);
  let isVisible = $state(false);
  let scrollIndicatorVisible = $state(true);

  class Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;

    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse interaction
      const dx = mousePos.x - this.x;
      const dy = mousePos.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 100) {
        this.speedX += dx * 0.001;
        this.speedY += dy * 0.001;
      }

      // Boundaries
      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;

      // Speed limit
      const maxSpeed = 2;
      const currentSpeed = Math.sqrt(
        this.speedX * this.speedX + this.speedY * this.speedY,
      );
      if (currentSpeed > maxSpeed) {
        this.speedX = (this.speedX / currentSpeed) * maxSpeed;
        this.speedY = (this.speedY / currentSpeed) * maxSpeed;
      }
    }

    draw() {
      if (!ctx) return;
      ctx.fillStyle = `rgba(255, 61, 0, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function handleMouseMove(event: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    mousePos = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function handleResize() {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    const parent = canvas.parentElement;
    if (parent) {
      height = canvas.height = parent.clientHeight;
    } else {
      height = canvas.height = Math.max(window.innerHeight * 0.7, 500);
    }
    initParticles();
  }

  function initParticles() {
    // Reduce particles on smaller screens for performance
    const particleCount = window.innerWidth <= 768 ? 15 : 50;
    particles = Array(particleCount)
      .fill(null)
      .map(() => new Particle());
  }

  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    requestAnimationFrame(animate);
  }

  // Add scroll handler to hide indicator when scrolling starts
  function handleScroll() {
    if (window.scrollY > 50) {
      scrollIndicatorVisible = false;
    } else {
      scrollIndicatorVisible = true;
    }
  }

  onMount(() => {
    // Detect mobile device for performance optimizations
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

    ctx = canvas.getContext("2d");
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    
    // Only run particle animation on desktop
    if (!isMobile) {
      animate();
    }

    // Add visibility transition
    setTimeout(() => {
      isVisible = true;
    }, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  });
</script>

<div class="relative min-h-[70vh] w-full overflow-hidden bg-white">
  <!-- Canvas background -->
  <canvas
    bind:this={canvas}
    onmousemove={handleMouseMove}
    class="absolute inset-0 w-full h-full"
  ></canvas>

  {#if isVisible}
    <div
      class="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 py-24 md:py-16"
      transition:fly={{ y: 50, duration: 800, delay: 100 }}
    >
      <!-- Main Title -->
      <div class="hero-title mb-6 md:mb-8">
        <h1
          class="text-[clamp(2.5rem,6vw,4.5rem)] font-black text-center relative"
        >
          <span class="animate-slideFromLeft inline-block text-black"
            >Solutions that fit.</span
          >
          <br />
          <div
            class="bg-gradient-to-r from-[#ff3d00] to-[#ff8a00] bg-clip-text text-transparent animate-slideFromRight inline-block"
          >
            Support that lasts.
          </div>
        </h1>
      </div>

      <!-- Description -->
      <div class="hero-description max-w-[65ch] mb-8 md:mb-12">
        <p
          class="text-[clamp(1rem,1.3vw,1.25rem)] text-gray-600 leading-relaxed"
        >
          You won't get a template. You'll get a solution that fits your
          business.
        </p>
      </div>

      <!-- CTA Buttons -->
      <div class="hero-cta flex flex-wrap justify-center gap-6 mb-24">
        <a
          href="/contact/"
          class="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#ff3d00] to-[#ff8a00] rounded-full text-white font-medium hover:shadow-lg hover:shadow-[#ff3d00]/20 transition-all duration-300 hover:scale-105"
        >
          Start Your Project
        </a>
      </div>

      <!-- Scroll Indicator -->
      {#if scrollIndicatorVisible}
        <div
          class="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div class="text-gray-400 text-sm font-medium">Scroll to explore</div>
          <div
            class="w-[30px] h-[50px] rounded-full border-2 border-gray-300 relative"
          >
            <div class="scroll-dot"></div>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  @keyframes slideFromLeft {
    from {
      transform: translateX(-50px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideFromRight {
    from {
      transform: translateX(50px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .animate-slideFromLeft {
    opacity: 0;
    animation: slideFromLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .animate-slideFromRight {
    opacity: 0;
    animation: slideFromRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .scroll-dot {
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: linear-gradient(to right, #ff3d00, #ff8a00);
    animation: scrollAnimation 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
  }

  @keyframes scrollAnimation {
    0% {
      top: 6px;
      opacity: 1;
    }
    70% {
      top: 36px;
      opacity: 1;
    }
    100% {
      top: 36px;
      opacity: 0;
    }
  }
</style>
