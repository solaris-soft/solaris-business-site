<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = $state(null);
  let particles: Particle[] = $state([]);
  let mousePos = $state({ x: 0, y: 0 });
  let width = $state(0);
  let height = $state(0);
  let isVisible = $state(false);

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
      const currentSpeed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
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
      y: event.clientY - rect.top
    };
  }

  function handleResize() {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight * 0.7;
    initParticles();
  }

  function initParticles() {
    particles = Array(50).fill(null).map(() => new Particle());
  }

  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    requestAnimationFrame(animate);
  }

  onMount(() => {
    ctx = canvas.getContext('2d');
    handleResize();
    window.addEventListener('resize', handleResize);
    animate();
    
    // Add visibility transition
    setTimeout(() => {
      isVisible = true;
    }, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
</script>

<div class="relative w-full h-[70vh] overflow-hidden">
  <canvas
    bind:this={canvas}
    on:mousemove={handleMouseMove}
    class="absolute inset-0 w-full h-full"
  />
  
  {#if isVisible}
    <div class="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 py-16">
      <!-- Main Title -->
      <div in:fly={{ y: 50, duration: 800, delay: 200 }} class="mb-8">
        <h1 class="text-[clamp(3rem,6vw,4.5rem)] font-black text-center relative">
          <span class="animate-slideFromLeft inline-block">Transform Your</span>
          <div class="bg-gradient-to-r from-[#ff3d00] to-[#ff8a00] bg-clip-text text-transparent animate-slideFromRight inline-block">Digital Presence</div>
        </h1>
      </div>
      
      <!-- Description -->
      <div in:fly={{ y: 50, duration: 800, delay: 400 }} class="max-w-[65ch] mb-12">
        <p class="text-[clamp(1.1rem,1.3vw,1.25rem)] text-white/70 leading-relaxed">
          We craft innovative digital solutions that help businesses thrive in the modern world. From stunning websites to powerful automation tools, we're here to elevate your business.
        </p>
      </div>
      
      <!-- CTA Buttons -->
      <div in:fly={{ y: 50, duration: 800, delay: 600 }} class="flex flex-wrap justify-center gap-6">
        <a 
          href="/contact"
          class="px-8 py-4 bg-gradient-to-r from-[#ff3d00] to-[#ff8a00] rounded-full text-white font-medium hover:shadow-lg hover:shadow-[#ff3d00]/20 transition-all duration-300 hover:scale-105"
        >
          Start Your Project
        </a>
      </div>
      
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

  .animate-slideUp {
    opacity: 0;
    animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
</style> 