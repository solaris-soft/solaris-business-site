<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { cubicOut } from 'svelte/easing';

  const { title, description } = $props();

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = $state(null);
  let particles: Particle[] = $state([]);
  let cardElement: HTMLElement;
  let contentElement: HTMLElement;
  let isVisible = $state(false);
  let magnetStrength = $state({ x: 0, y: 0 });
  let rafId: number;
  
  class Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    targetX: number;
    targetY: number;
    
    constructor(x: number, y: number) {
      this.x = Math.random() * (canvas?.width ?? 0);
      this.y = Math.random() * (canvas?.height ?? 0);
      this.size = Math.random() * 2 + 1;
      this.speedX = 0;
      this.speedY = 0;
      this.opacity = Math.random() * 0.5;
      this.targetX = x;
      this.targetY = y;
    }
    
    update() {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 1) {
        this.speedX += dx * 0.01;
        this.speedY += dy * 0.01;
      }
      
      this.speedX *= 0.92;
      this.speedY *= 0.92;
      
      this.x += this.speedX;
      this.y += this.speedY;
    }
    
    draw() {
      if (!ctx) return;
      ctx.fillStyle = `rgba(255, 61, 0, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    if (!ctx || !canvas) return;
    
    const text = title;
    ctx.font = 'bold 24px "Inter", sans-serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textX = canvas.width / 2;
    const textY = canvas.height / 2;
    
    ctx.fillText(text, textX, textY);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    particles = [];
    
    for (let y = 0; y < canvas.height; y += 4) {
      for (let x = 0; x < canvas.width; x += 4) {
        const index = (y * canvas.width + x) * 4;
        if (data[index + 3] > 128) {
          particles.push(new Particle(x, y));
        }
      }
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function animate() {
    if (!ctx || !canvas) return;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    rafId = requestAnimationFrame(animate);
  }

  function handleMouseMove(event: MouseEvent) {
    if (!cardElement || !contentElement) return;
    
    // Stop event propagation
    event.stopPropagation();
    
    const bounds = cardElement.getBoundingClientRect();
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    // Check if the event target is within this card's element tree
    if (!cardElement.contains(event.target as Node)) {
      handleMouseLeave();
      return;
    }
    
    // Create a strict boundary box that's slightly smaller than the actual card
    const buffer = 10;
    const strictBounds = {
      left: bounds.left + buffer,
      right: bounds.right - buffer,
      top: bounds.top + buffer,
      bottom: bounds.bottom - buffer
    };
    
    // Check if mouse is strictly within the card's bounds
    if (
      mouseX < strictBounds.left ||
      mouseX > strictBounds.right ||
      mouseY < strictBounds.top ||
      mouseY > strictBounds.bottom
    ) {
      handleMouseLeave();
      return;
    }
    
    // Calculate position relative to strict bounds
    const x = Math.max(0, Math.min(1, (mouseX - strictBounds.left) / (strictBounds.right - strictBounds.left)));
    const y = Math.max(0, Math.min(1, (mouseY - strictBounds.top) / (strictBounds.bottom - strictBounds.top)));
    
    // Apply the magnetic effect only if we're definitely inside this card
    const targetX = (x - 0.5) * 20;
    const targetY = (y - 0.5) * 20;
    
    magnetStrength = {
      x: magnetStrength.x + (targetX - magnetStrength.x) * 0.15,
      y: magnetStrength.y + (targetY - magnetStrength.y) * 0.15
    };
    
    contentElement.style.transform = `
      translate(${magnetStrength.x}px, ${magnetStrength.y}px)
      scale(1.01)
    `;
    
    // Update particles with stricter boundary checking
    particles.forEach(particle => {
      if (!isVisible) return; // Don't update particles if card isn't visible
      
      const dx = mouseX - bounds.left - particle.x;
      const dy = mouseY - bounds.top - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 80) {
        particle.speedX += dx * 0.0005;
        particle.speedY += dy * 0.0005;
      }
    });
  }

  function handleMouseLeave(event?: MouseEvent) {
    if (!contentElement) return;
    
    if (event) {
      event.stopPropagation();
    }
    
    // Smooth transition back to original position
    const resetAnimation = () => {
      magnetStrength = {
        x: magnetStrength.x * 0.8,
        y: magnetStrength.y * 0.8
      };

      if (Math.abs(magnetStrength.x) < 0.01 && Math.abs(magnetStrength.y) < 0.01) {
        magnetStrength = { x: 0, y: 0 };
        contentElement.style.transform = 'translate(0, 0) scale(1)';
        return;
      }

      contentElement.style.transform = `
        translate(${magnetStrength.x}px, ${magnetStrength.y}px)
        scale(${1 + Math.abs(magnetStrength.x + magnetStrength.y) / 400})
      `;

      requestAnimationFrame(resetAnimation);
    };

    resetAnimation();
  }

  onMount(() => {
    if (!canvas || !cardElement) return;
    
    // Add pointer-events-none to all child elements except the interactive ones
    cardElement.querySelectorAll('*:not(a, button, [role="button"])').forEach((el) => {
      (el as HTMLElement).style.pointerEvents = 'none';
    });
    cardElement.style.pointerEvents = 'auto';
    
    ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = cardElement.clientWidth;
    canvas.height = cardElement.clientHeight;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            isVisible = true;
            initParticles();
            animate();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    
    observer.observe(cardElement);
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  });
</script>

<div
  class="relative w-full h-[400px] group pointer-events-auto"
  bind:this={cardElement}
  onmousemove={handleMouseMove}
  onmouseleave={handleMouseLeave}
  role="button"
  tabindex="0"
>
  <!-- Canvas background -->
  <canvas
    bind:this={canvas}
    class="absolute inset-0 w-full h-full rounded-3xl"
  ></canvas>
  
  <!-- Glass card -->
  <div class="absolute inset-0 rounded-3xl backdrop-blur-sm bg-white/[0.02] border border-white/[0.05]">
    <!-- Shine effect -->
    <div class="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
    </div>
  </div>
  
  <!-- Content container with magnetic effect -->
  <div
    bind:this={contentElement}
    class="relative h-full flex flex-col justify-between p-8 transition-transform duration-300 ease-out"
  >
    <!-- Title -->
    <div class="space-y-6">
      <div class="relative w-16 h-16">
        <!-- Glowing orb -->
        <div class="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff3d00] to-[#ff8a00] blur-lg opacity-50 animate-pulse"></div>
        <div class="relative w-full h-full rounded-full bg-gradient-to-br from-[#ff3d00] to-[#ff8a00] p-[2px]">
          <div class="w-full h-full rounded-full bg-black flex items-center justify-center">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff3d00] to-[#ff8a00] transform group-hover:scale-110 transition-transform duration-300"></div>
          </div>
        </div>
      </div>
      
      <h3 class="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
        {title}
      </h3>
    </div>
    
    <!-- Description and link -->
    <div class="space-y-6">
      <p class="text-white/60 leading-relaxed">
        {description}
      </p>
      
      <div class="flex items-center gap-3 text-[#ff3d00] font-medium">
        <span class="relative">
          Explore
          <div class="absolute inset-x-0 h-px -bottom-1 bg-gradient-to-r from-[#ff3d00] to-[#ff8a00] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </span>
        <svg
          class="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 12H20M20 12L14 6M20 12L14 18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  </div>
</div>

<style>
  /* Optimize performance */
  canvas {
    image-rendering: pixelated;
  }
  
  /* Enhanced glass effect */
  .backdrop-blur-sm {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  
  /* Smooth animations */
  .transition-all {
    transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  /* Text rendering optimization */
  h3, p {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 0.5;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.05);
    }
  }
  
  .animate-pulse {
    animation: pulse 3s ease-in-out infinite;
  }
</style> 