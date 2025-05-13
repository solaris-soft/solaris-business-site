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
	let mousePos = $state({ x: 0.5, y: 0.5 });
	let mouseVelocity = $state({ x: 0, y: 0 });
	let dimensions = $state({ width: 0, height: 0 });
	let scrollProgress = $state(0);
	let isLoaded = $state(false);
	let staggerIndex = $state(0);
	let titleChars = $state<string[]>([]);
	
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
		uniform vec2 mousePos;
		uniform vec2 mouseVelocity;
		uniform float scrollProgress;

		// Noise functions
		float hash(vec2 p) {
			return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
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

		float fbm(vec2 p) {
			float value = 0.0;
			float amplitude = 0.5;
			float frequency = 1.0;
			for(int i = 0; i < 6; i++) {
				value += amplitude * noise(p * frequency);
				amplitude *= 0.5;
				frequency *= 2.0;
				p = p * 1.1 + vec2(3.3, 2.8);
			}
			return value;
		}

		vec3 plasma(vec2 uv, float t) {
			// Base plasma effect
			float v1 = sin((uv.x + t * 0.1) * 10.0);
			float v2 = cos((uv.y + t * 0.15) * 8.0);
			float v3 = sin(sqrt(pow(uv.x - mousePos.x, 2.0) + pow(uv.y - mousePos.y, 2.0)) * 12.0);
			
			// Dynamic flow field
			vec2 flow = vec2(
				sin(uv.y * 4.0 + t * 0.2) * 0.2,
				cos(uv.x * 4.0 + t * 0.15) * 0.2
			);
			
			// Fractal noise
			float noise = fbm(uv * 2.5 + flow + t * 0.08);
			
			// Combine effects
			float plasma = v1 + v2 + v3 + noise;
			
			// Color mapping
			vec3 col1 = vec3(1.0, 0.2, 0.0); // Orange
			vec3 col2 = vec3(1.0, 0.4, 0.1); // Light orange
			vec3 col3 = vec3(0.9, 0.1, 0.0); // Deep red
			
			vec3 color = mix(
				mix(col1, col2, plasma),
				col3,
				sin(plasma * 3.14159) * 0.5 + 0.5
			);
			
			// Add mouse interaction glow with reduced intensity
			float mouseDist = length(uv - mousePos);
			float mouseGlow = exp(-mouseDist * 6.0) * length(mouseVelocity) * 1.0;
			color += vec3(1.0, 0.3, 0.1) * mouseGlow;
			
			// Add scroll-based effects with smoother transition
			float scrollEffect = smoothstep(0.0, 1.0, scrollProgress);
			color = mix(color, color * (1.0 + noise * 0.4), scrollEffect);
			
			return color;
		}

		void main() {
			vec2 uv = gl_FragCoord.xy / resolution;
			float t = time * 0.001;
			
			// Main plasma effect
			vec3 color = plasma(uv, t);
			
			// Vignette effect
			float vignette = 1.0 - length((uv - 0.5) * 2.0);
			vignette = smoothstep(0.0, 1.0, pow(vignette, 1.5));
			color *= vignette;
			
			// Output with gamma correction
			color = pow(color, vec3(0.8));
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
		gl.uniform2f(gl.getUniformLocation(program, 'mousePos'), mousePos.x, mousePos.y);
		gl.uniform2f(gl.getUniformLocation(program, 'mouseVelocity'), mouseVelocity.x, mouseVelocity.y);
		gl.uniform1f(gl.getUniformLocation(program, 'scrollProgress'), scrollProgress);
		
		// Draw
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		
		requestAnimationFrame(render);
	}

	// Animation loop
	$effect(() => {
		const start = performance.now();
		let lastTime = start;
		let rafId: number;

		const animate = (now: number) => {
			const delta = now - lastTime;
			lastTime = now;
			time = now - start;
			
			// Update mouse velocity decay
			mouseVelocity = {
				x: mouseVelocity.x * 0.95,
				y: mouseVelocity.y * 0.95
			};

			rafId = requestAnimationFrame(animate);
		};

		rafId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(rafId);
	});

	// Mouse tracking
	function handleMouseMove(event: MouseEvent) {
		const rect = canvas.getBoundingClientRect();
		const newX = (event.clientX - rect.left) / rect.width;
		const newY = 1.0 - (event.clientY - rect.top) / rect.height;
		
		// Reduce velocity sensitivity and add smoothing
		mouseVelocity = {
			x: (newX - mousePos.x) / 32, // Reduced from 16 to 32
			y: (newY - mousePos.y) / 32
		};
		
		// Add position smoothing
		mousePos = {
			x: mousePos.x + (newX - mousePos.x) * 0.1,
			y: mousePos.y + (newY - mousePos.y) * 0.1
		};
	}

	// Scroll tracking
	function handleScroll() {
		const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
		scrollProgress = Math.min(window.scrollY / scrollMax, 1);
	}

	// Resize handling
	function updateDimensions() {
		if (!canvas) return;
		const dpr = window.devicePixelRatio;
		dimensions = {
			width: window.innerWidth,
			height: window.innerHeight
		};
		
		canvas.width = dimensions.width * dpr;
		canvas.height = dimensions.height * dpr;
		canvas.style.width = `${dimensions.width}px`;
		canvas.style.height = `${dimensions.height}px`;
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

	// Initialization
	onMount(() => {
		updateDimensions();
		initWebGL();
		window.addEventListener('resize', updateDimensions);
		window.addEventListener('scroll', handleScroll);
		
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

		return () => {
			window.removeEventListener('resize', updateDimensions);
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<div 
	class="relative min-h-screen max-w-screen flex items-center justify-center overflow-hidden bg-black"
	on:mousemove={handleMouseMove}
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
								<span
									class="inline-block"
									in:charStaggerTransition={{
										delay: i * 30,
										duration: 600,
										y: 30,
										x: (i - titleChars.length / 2) * 8
									}}
								>{char}</span>
							{/each}
						</span>
						<span 
							class="text-[#ff3d00] block relative"
							style="
								background: linear-gradient(to bottom, #ff7e3d 0%, #ff3d00 100%);
								-webkit-background-clip: text;
								background-clip: text;
								color: transparent;
								text-shadow: 
									0 1px 1px rgba(0,0,0,0.6),
									0 -1px 1px rgba(255,255,255,0.2);
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
									background: linear-gradient(to bottom, #ff7e3d 0%, #ff3d00 100%);
									-webkit-background-clip: text;
									background-clip: text;
									color: transparent;
									filter: blur(4px);
									opacity: 0.5;
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
						class="text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed font-light px-4 md:px-0"
						style="
							text-shadow: 0 1px 1px rgba(0,0,0,0.3);
							background: linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.85));
							-webkit-background-clip: text;
							background-clip: text;
							color: transparent;
						"
						in:staggerTransition={{ 
							delay: titleChars.length * 30 + 300,
							duration: 800,
							y: 20,
							scale: 0.95
						}}
					>
						Transforming ideas into reality through cutting-edge software solutions that push the boundaries of what's possible.
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
</style>