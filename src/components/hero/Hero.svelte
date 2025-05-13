<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { backOut, elasticOut } from 'svelte/easing';
	
	// WebGL Setup
	let canvas: HTMLCanvasElement;
	let gl: WebGLRenderingContext | null;
	let program: WebGLProgram | null;
	
	// Animation State
	let time = $state(0);
	let dimensions = $state({ width: 0, height: 0 });
	let scrollProgress = $state(0);
	let isLoaded = $state(false);
	let staggerIndex = $state(0);
	let titleChars = $state<string[]>([]);
	let rafId: number;
	let lastScrollY = 0;
	let ticking = false;
	
	// Split text animation helper
	function splitText(text: string): string[] {
		return text.split('');
	}

	// Vertex shader for the plasma effect
	const vertexShaderSource = `
		attribute vec2 position;
		void main() {
			gl_Position = vec4(position, 0.0, 1.0);
		}
	`;

	// Fragment shader with advanced plasma and noise effects
	const fragmentShaderSource = `
		precision highp float;
		uniform float time;
		uniform vec2 resolution;
		uniform float scrollProgress;

		// Enhanced noise functions
		float hash(vec2 p) {
			vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
			p3 += dot(p3, p3.yxz + 33.33);
			return fract((p3.x + p3.y) * p3.z);
		}

		float noise(vec2 p) {
			vec2 i = floor(p);
			vec2 f = fract(p);
			f = f * f * (3.0 - 2.0 * f);
			return mix(
				mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
				mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
				f.y
			);
		}

		float voronoi(vec2 x) {
			vec2 p = floor(x);
			vec2 f = fract(x);
			float min_dist = 1.0;
			
			for(int i = -1; i <= 1; i++) {
				for(int j = -1; j <= 1; j++) {
					vec2 b = vec2(float(i), float(j));
					vec2 r = b - f + hash(p + b);
					float d = dot(r, r);
					min_dist = min(min_dist, d);
				}
			}
			
			return sqrt(min_dist);
		}

		float fbm(vec2 p) {
			float value = 0.0;
			float amplitude = 0.5;
			float frequency = 1.0;
			float lacunarity = 2.0;
			float gain = 0.5;
			mat2 rotation = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
			
			for(int i = 0; i < 6; i++) {
				value += amplitude * noise(p * frequency);
				p = rotation * p * lacunarity;
				amplitude *= gain;
				frequency *= 2.0;
			}
			return value;
		}

		vec3 plasma(vec2 uv, float t) {
			// Enhanced base plasma effect
			float v1 = sin((uv.x + t * 0.1) * 10.0);
			float v2 = cos((uv.y + t * 0.15) * 8.0);
			float v3 = sin(sqrt(pow(uv.x - 0.5, 2.0) + pow(uv.y - 0.5, 2.0)) * 12.0);
			
			// Dynamic flow field with curl noise
			vec2 flow = vec2(
				sin(uv.y * 4.0 + t * 0.2 + fbm(uv * 2.0)) * 0.3,
				cos(uv.x * 4.0 + t * 0.15 + fbm(uv * 2.0)) * 0.3
			);
			
			// Layered effects
			float noise1 = fbm(uv * 2.5 + flow + t * 0.08);
			float noise2 = fbm(uv * 4.0 - flow * 0.5 + t * 0.12);
			float voronoiEffect = voronoi(uv * 8.0 + vec2(t * 0.2, t * 0.1));
			
			// Combine effects with more complexity
			float plasma = v1 + v2 + v3 + noise1 * 0.8 + noise2 * 0.4 + voronoiEffect * 0.3;
			
			// Enhanced color mapping with more sophisticated palette
			vec3 col1 = vec3(0.5 + 0.5 * sin(t * 0.1), 0.2, 0.0); // Dynamic orange
			vec3 col2 = vec3(1.0, 0.4 + 0.2 * cos(t * 0.15), 0.1); // Pulsing light orange
			vec3 col3 = vec3(0.9, 0.1 + 0.1 * sin(t * 0.2), 0.0); // Animated deep red
			
			vec3 color = mix(
				mix(col1, col2, plasma),
				col3,
				sin(plasma * 3.14159 + t * 0.1) * 0.5 + 0.5
			);
			
			// Scroll-based effects with more sophistication
			float scrollEffect = smoothstep(0.0, 1.0, scrollProgress);
			vec3 scrollColor = mix(
				color,
				color * (1.0 + noise1 * 0.6 + voronoiEffect * 0.4),
				scrollEffect
			);
			
			// Add subtle color variations based on position
			color = mix(color, scrollColor, 0.8);
			color += vec3(0.1, 0.05, 0.0) * fbm(uv * 10.0 + t * 0.05);
			
			return color;
		}

		void main() {
			vec2 uv = gl_FragCoord.xy / resolution;
			float t = time * 0.001;
			
			// Main plasma effect with enhanced detail
			vec3 color = plasma(uv, t);
			
			// Advanced vignette effect
			float vignette = length((uv - 0.5) * 2.0);
			vignette = smoothstep(1.2, 0.4, vignette) * (0.8 + 0.2 * sin(t * 0.5));
			color *= vignette;
			
			// Add subtle scanlines
			float scanline = sin(uv.y * resolution.y * 0.5 - t * 10.0) * 0.02 + 0.98;
			color *= scanline;
			
			// Add chromatic aberration
			float aberration = 0.01 * (1.0 + sin(t * 0.2)) * (1.0 - vignette);
			vec3 colorShift = vec3(
				plasma(uv + vec2(aberration, 0.0), t).r,
				plasma(uv, t).g,
				plasma(uv - vec2(aberration, 0.0), t).b
			);
			color = mix(color, colorShift, 0.3);
			
			// Enhanced gamma correction and tone mapping
			color = pow(color, vec3(0.8));
			color = color / (1.0 + color); // Soft tone mapping
			gl_FragColor = vec4(color, 1.0);
		}
	`;

	// Initialize WebGL
	function initWebGL() {
		if (!canvas) return;
		gl = canvas.getContext('webgl', { alpha: false });
		if (!gl) return;

		// Create shaders
		const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
		const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
		if (!vertexShader || !fragmentShader) return;

		// Create program
		program = createProgram(gl, vertexShader, fragmentShader);
		if (!program) return;

		// Set up geometry
		const positions = new Float32Array([
			-1, -1,
			1, -1,
			-1, 1,
			1, 1
		]);

		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

		// Set up attributes and uniforms
		const positionLocation = gl.getAttribLocation(program, 'position');
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

		render();
	}

	function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
		const shader = gl.createShader(type);
		if (!shader) return null;
		
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error(gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}
		
		return shader;
	}

	function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
		const program = gl.createProgram();
		if (!program) return null;
		
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);
		
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error(gl.getProgramInfoLog(program));
			gl.deleteProgram(program);
			return null;
		}
		
		return program;
	}

	function render() {
		if (!gl || !program) return;
		
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.useProgram(program);
		
		// Update uniforms
		gl.uniform1f(gl.getUniformLocation(program, 'time'), time);
		gl.uniform2f(gl.getUniformLocation(program, 'resolution'), gl.canvas.width, gl.canvas.height);
		gl.uniform1f(gl.getUniformLocation(program, 'scrollProgress'), scrollProgress);
		
		// Draw
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		
		requestAnimationFrame(render);
	}

	// Scroll handling with throttling and RAF
	function handleScroll() {
		lastScrollY = window.scrollY;
		if (!ticking) {
			rafId = requestAnimationFrame(() => {
				const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
				scrollProgress = Math.min(lastScrollY / scrollMax, 1);
				ticking = false;
			});
			ticking = true;
		}
	}

	// Animation loop with RAF
	$effect(() => {
		const start = performance.now();
		let lastTime = start;

		function animate(now: number) {
			const delta = now - lastTime;
			lastTime = now;
			time = now - start;
			rafId = requestAnimationFrame(animate);
		}

		rafId = requestAnimationFrame(animate);
		return () => {
			cancelAnimationFrame(rafId);
			if (ticking) {
				cancelAnimationFrame(rafId);
				ticking = false;
			}
		};
	});

	// Resize handling
	function updateDimensions() {
		if (!canvas) return;
		
		requestAnimationFrame(() => {
			const dpr = Math.min(window.devicePixelRatio, 2); // Cap DPR for better performance
			dimensions = {
				width: window.innerWidth,
				height: window.innerHeight
			};
			
			canvas.width = dimensions.width * dpr;
			canvas.height = dimensions.height * dpr;
			canvas.style.width = `${dimensions.width}px`;
			canvas.style.height = `${dimensions.height}px`;
			
			if (gl) {
				gl.viewport(0, 0, canvas.width, canvas.height);
			}
		});
	}

	// Enhanced stagger transition
	function staggerTransition(node: HTMLElement, { 
		delay = 0, 
		duration = 800,
		y = 20,
		x = 0,
		scale = 0.95,
		rotateZ = 0
	}) {
		return {
			delay,
			duration,
			css: (t: number) => {
				const eased = elasticOut(t);
				const scaleValue = scale + (eased * (1 - scale));
				return `
					opacity: ${t};
					transform: 
						scale(${scaleValue}) 
						translateY(${(1 - eased) * y}px)
						translateX(${(1 - eased) * x}px)
						rotateZ(${(1 - eased) * rotateZ}deg);
				`;
			}
		};
	}

	// Character stagger transition
	function charStaggerTransition(node: HTMLElement, { 
		delay = 0, 
		duration = 400,
		y = 40,
		x = 0
	}) {
		return {
			delay,
			duration,
			css: (t: number) => {
				const eased = backOut(t);
				return `
					opacity: ${t};
					transform: 
						translateY(${(1 - eased) * y}px)
						translateX(${(1 - eased) * x}px)
						scale(${0.7 + (eased * 0.3)});
				`;
			}
		};
	}

	// Add particle system
	interface Particle {
		x: number;
		y: number;
		size: number;
		speedX: number;
		speedY: number;
		life: number;
	}

	let particles: Particle[] = [];
	const PARTICLE_COUNT = 50;

	function initParticles() {
		particles = Array.from({ length: PARTICLE_COUNT }, () => ({
			x: Math.random() * dimensions.width,
			y: Math.random() * dimensions.height,
			size: Math.random() * 2 + 1,
			speedX: (Math.random() - 0.5) * 2,
			speedY: (Math.random() - 0.5) * 2,
			life: Math.random() * 0.5 + 0.5
		}));
	}

	function updateParticles(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
		
		particles.forEach(particle => {
			particle.x += particle.speedX;
			particle.y += particle.speedY;
			particle.life -= 0.002;
			
			if (particle.life <= 0 || 
				particle.x < 0 || particle.x > dimensions.width ||
				particle.y < 0 || particle.y > dimensions.height) {
				particle.x = Math.random() * dimensions.width;
				particle.y = Math.random() * dimensions.height;
				particle.life = 1;
			}
			
			const alpha = particle.life * 0.5;
			ctx.globalAlpha = alpha;
			ctx.beginPath();
			ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
			ctx.fill();
		});
	}

	// Create overlay canvas for particles
	let overlayCanvas: HTMLCanvasElement;
	let overlayCtx: CanvasRenderingContext2D;

	// Initialization
	onMount(() => {
		updateDimensions();
		initWebGL();
		
		// Add passive flag for better scroll performance
		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', updateDimensions);
		
		// Split the title text
		titleChars = splitText('SOLARIS');
		
		// Enhanced staggered loading sequence with faster timing
		setTimeout(() => {
			isLoaded = true;
			const staggerInterval = 50;
			const interval = setInterval(() => {
				if (staggerIndex < 4) {
					staggerIndex++;
				} else {
					clearInterval(interval);
				}
			}, staggerInterval);
		}, 200);

		// Initialize particle system
		overlayCanvas = document.createElement('canvas');
		overlayCanvas.style.position = 'absolute';
		overlayCanvas.style.top = '0';
		overlayCanvas.style.left = '0';
		overlayCanvas.style.pointerEvents = 'none';
		overlayCanvas.style.zIndex = '1';
		canvas.parentElement?.appendChild(overlayCanvas);
		
		overlayCtx = overlayCanvas.getContext('2d') as CanvasRenderingContext2D;
		initParticles();
		
		function animateParticles() {
			if (!overlayCanvas || !overlayCtx) return;
			
			overlayCanvas.width = dimensions.width;
			overlayCanvas.height = dimensions.height;
			overlayCtx.clearRect(0, 0, dimensions.width, dimensions.height);
			
			updateParticles(overlayCtx);
			requestAnimationFrame(animateParticles);
		}
		
		animateParticles();

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', updateDimensions);
			if (rafId) {
				cancelAnimationFrame(rafId);
			}
			if (overlayCanvas) {
				overlayCanvas.remove();
			}
		};
	});
</script>

<div 
	class="relative min-h-screen max-w-screen flex items-center justify-center overflow-hidden bg-black"
>
	<!-- WebGL Canvas -->
	<canvas
		bind:this={canvas}
		class="absolute inset-0 w-full h-full"
	></canvas>

	<!-- Content Layer -->
	<div 
		class="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center"
		style:opacity={isLoaded ? 1 : 0}
		style:transform="scale({isLoaded ? 1 : 0.98}) translateY({isLoaded ? '0' : '20px'})"
		style:transition="all 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
	>
		{#if isLoaded}
			<div 
				class="overflow-hidden"
				in:fade={{ duration: 50 }}
			>
				{#if staggerIndex >= 0}
					<h1 
						class="text-6xl lg:text-8xl font-black text-white mb-4 md:mb-6 tracking-tight flex flex-col items-center justify-center"
						style="text-shadow: 0 2px 4px rgba(0,0,0,0.5);"
					>
						<span class="relative inline-flex overflow-hidden">
							{#each titleChars as char, i}
								{#if char === 'O'}
									<span
										class="inline-block relative"
										in:charStaggerTransition={{
											delay: i * 30,
											duration: 600,
											y: 30,
											x: (i - titleChars.length / 2) * 8
										}}
									>
										<div class="relative w-[0.85em] h-[0.85em] inline-block align-middle -translate-y-[0.075em]">
											<!-- Main dot with gradient -->
											<div
												class="absolute inset-0 bg-gradient-to-br from-[#ff3d00] to-[#ff8a00] rounded-full animate-mainDot will-change-transform"
											>
												<div
													class="absolute inset-[2px] bg-gradient-to-br from-white/30 to-transparent rounded-full"
												>
												</div>
											</div>
											<!-- Single optimized orbital ring -->
											<div
												class="absolute inset-0 w-full h-full animate-orbit will-change-transform"
											>
												<div class="absolute inset-[-2px] rounded-full ring-1 ring-[#ff3d00]/10"></div>
												<div
													class="absolute w-[0.1em] h-[0.1em] bg-[#ff3d00] rounded-full -top-[1px] left-1/2 -translate-x-1/2"
												>
												</div>
											</div>
										</div>
									</span>
								{:else}
									<span
										class="inline-block"
										in:charStaggerTransition={{
											delay: i * 30,
											duration: 600,
											y: 30,
											x: (i - titleChars.length / 2) * 8
										}}
									>{char}</span>
								{/if}
							{/each}
						</span>
						<span 
							class="text-[#ff5500] block relative"
							style="
								background: linear-gradient(to bottom, #ff8c1a 0%, #ff4800 100%);
								-webkit-background-clip: text;
								background-clip: text;
								color: transparent;
								text-shadow: 
									0 1px 2px rgba(0,0,0,0.8),
									0 -1px 1px rgba(255,255,255,0.2),
									0 0 20px rgba(255,69,0,0.3);
								letter-spacing: 0.02em;
								position: relative;
								z-index: 2;
							"
							in:staggerTransition={{ 
								delay: titleChars.length * 30 + 50,
								duration: 800,
								y: 20,
								scale: 0.9
							}}
						>
							<span 
								class="absolute inset-0 z-[-1]"
								aria-hidden="true"
								style="
									background: linear-gradient(to bottom, #ff8c1a 0%, #ff4800 100%);
									-webkit-background-clip: text;
									background-clip: text;
									color: transparent;
									filter: blur(6px);
									opacity: 0.6;
									transform: translateY(2px);
								"
							>SOFTWARE</span>
							SOFTWARE
						</span>
					</h1>
				{/if}

				{#if staggerIndex >= 1}
					<div 
						class="text-sm md:text-lg lg:text-xl font-bold tracking-[0.15em] md:tracking-[0.25em] mb-8 md:mb-16 relative"
						in:staggerTransition={{ 
							delay: titleChars.length * 30 + 200,
							duration: 800,
							y: 20,
							scale: 0.95
						}}
					>
						<span 
							class="relative inline-block"
							style="
								background: linear-gradient(to bottom, #ffffff 0%, #ffd7c0 100%);
								-webkit-background-clip: text;
								background-clip: text;
								color: transparent;
								filter: drop-shadow(0 2px 2px rgba(0,0,0,0.4));
							"
						>
							IGNITING DIGITAL INNOVATION
							<span class="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent blur-[1px] -z-10"></span>
						</span>
						<div 
							class="absolute -left-4 right-4 h-px mt-4"
							style="
								background: linear-gradient(
									90deg, 
									transparent 0%,
									rgba(255, 255, 255, 0.3) 50%,
									transparent 100%
								);
								animation: expandWidth 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
								transform-origin: center;
								opacity: 0;
							"
						></div>
					</div>
				{/if}

				{#if staggerIndex >= 2}
					<p 
						class="text-base md:text-lg lg:text-xl max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed font-light px-4 md:px-0"
						style="
							color: rgba(255, 255, 255, 0.92);
							text-shadow: 
								0 2px 4px rgba(0,0,0,0.5),
								0 1px 2px rgba(0,0,0,0.8);
							background: linear-gradient(
								to bottom,
								rgba(255,255,255,1) 0%,
								rgba(255,255,255,0.95) 100%
							);
							-webkit-background-clip: text;
							background-clip: text;
						"
						in:staggerTransition={{ 
							delay: titleChars.length * 30 + 300,
							duration: 800,
							y: 20,
							scale: 0.95
						}}
					>
						<span class="relative z-10">
							Transforming ideas into reality through cutting-edge software solutions that push the boundaries of what's possible.
						</span>
					</p>
				{/if}

				{#if staggerIndex >= 3}
					<div
						class="px-4 md:px-0"
						in:staggerTransition={{ 
							delay: titleChars.length * 30 + 400,
							duration: 800,
							y: 20,
							scale: 0.95
						}}
					>
						<a
							href="#contact"
							class="group relative inline-flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 text-white text-base md:text-lg font-medium rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:gap-4"
						>
							<div class="absolute inset-0 bg-gradient-to-r from-[#ff6b00] to-[#ff3d00] opacity-90 group-hover:opacity-100 transition-opacity"></div>
							<div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.4)_0%,_transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<span class="relative">
								Begin Your Journey
							</span>
							<svg class="w-6 h-6 relative transition-all duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</a>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Decorative Elements -->
	<div class="absolute inset-0 pointer-events-none">
		<!-- Grid overlay with radial fade -->
		<div 
			class="absolute inset-0"
			style="
				background: linear-gradient(transparent 1px, rgba(0,0,0,0) 1px),
					linear-gradient(to right, transparent 1px, rgba(0,0,0,0) 1px);
				background-size: 40px 40px;
				mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
				opacity: 0.1;
			"
		></div>
	</div>
</div>

<style>
	:global(body) {
		overflow-x: hidden;
	}

	canvas {
		image-rendering: -webkit-optimize-contrast;
		image-rendering: crisp-edges;
	}

	@keyframes expandWidth {
		0% {
			transform: scaleX(0);
			opacity: 0;
		}
		50% {
			opacity: 0.8;
		}
		100% {
			transform: scaleX(1);
			opacity: 0.6;
		}
	}

	/* Optimize animations with GPU acceleration */
	.inline-block {
		will-change: transform, opacity;
		transform: translateZ(0);
		backface-visibility: hidden;
	}

	/* Reduce animation complexity */
	:global(.content-container) {
		animation: float 8s ease-in-out infinite;
		transform: translateZ(0);
	}

	@keyframes float {
		0%, 100% {
			transform: translateY(0) translateZ(0);
		}
		50% {
			transform: translateY(-8px) translateZ(0);
		}
	}

	/* Optimize transitions */
	a, button {
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		transform: translateZ(0);
	}

	/* Enhanced text effects */
	:global(h1 span.inline-block) {
		filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
	}

	/* Optimize text rendering */
	:global(h1), :global(p), :global(.text-gradient) {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	/* Ensure gradient text works across browsers */
	@supports not ((background-clip: text) or (-webkit-background-clip: text)) {
		:global(.text-gradient) {
			background: none !important;
			color: #ffffff !important;
		}
	}

	@keyframes sunPulse {
		0%, 100% {
			transform: scale(1);
			opacity: 0.9;
		}
		50% {
			transform: scale(1.1);
			opacity: 1;
		}
	}

	@keyframes sunGlow {
		0%, 100% {
			transform: scale(1);
			opacity: 0.3;
		}
		50% {
			transform: scale(1.2);
			opacity: 0.5;
		}
	}

	.sun-rays {
		position: absolute;
		inset: -50%;
		background: conic-gradient(
			from 0deg,
			transparent 0deg,
			rgba(255, 107, 0, 0.2) 20deg,
			transparent 40deg,
			rgba(255, 61, 0, 0.2) 60deg,
			transparent 80deg,
			rgba(255, 107, 0, 0.2) 100deg,
			transparent 120deg,
			rgba(255, 61, 0, 0.2) 140deg,
			transparent 160deg,
			rgba(255, 107, 0, 0.2) 180deg,
			transparent 200deg,
			rgba(255, 61, 0, 0.2) 220deg,
			transparent 240deg,
			rgba(255, 107, 0, 0.2) 260deg,
			transparent 280deg,
			rgba(255, 61, 0, 0.2) 300deg,
			transparent 320deg,
			rgba(255, 107, 0, 0.2) 340deg,
			transparent 360deg
		);
		animation: rotate 10s linear infinite;
		z-index: -1;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes mainDot {
		0%, 100% {
			transform: scale(1);
		}
		50% {
			transform: scale(0.95);
		}
	}

	@keyframes orbit {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.animate-mainDot {
		animation: mainDot 3s ease-in-out infinite;
	}

	.animate-orbit {
		animation: orbit 10s linear infinite;
	}
</style>