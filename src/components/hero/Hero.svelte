<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	
	let isLoaded = $state(false);

	onMount(() => {
		setTimeout(() => {
			isLoaded = true;
		}, 100);
	});
</script>

<div 
	class="relative min-h-[110vh] max-w-screen flex items-center justify-center overflow-hidden bg-black rounded-full"
>
	<!-- Artistic solar background -->
	<div class="absolute inset-0 overflow-hidden rounded-full">
		<!-- Animated gradient background -->
		<div class="absolute inset-0 bg-gradient-to-b from-[#0a0500] via-black to-black opacity-30 rounded-full"></div>
		
		<!-- Minimal sun animation -->
		<div class="absolute inset-0 rounded-full">
			<div class="absolute top-0 left-0 w-full h-full animate-orbital">
				<div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[min(900px,90vw)] aspect-square rounded-full bg-black/80">
					<div class="absolute inset-0 rounded-full bg-gradient-radial from-orange-500/30 via-orange-500/10 to-transparent blur-3xl"></div>
					<div class="absolute inset-[-2px] rounded-full border-t-2 border-orange-500/20"></div>
					<div class="absolute inset-[-1px] rounded-full border-t border-orange-500/10"></div>
				</div>
			</div>
		</div>
	</div>

	<!-- Content Layer -->
	<div 
		class="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center flex flex-col gap-16"
		class:opacity-0={!isLoaded}
		class:opacity-100={isLoaded}
		style:transition="opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
	>
		{#if isLoaded}
			<div in:fade={{ duration: 800 }} class="flex flex-col gap-8">
				<div class="space-y-6">
					<h1 class="text-7xl lg:text-9xl font-black tracking-tight">
						<span class="bg-gradient-to-b from-white via-orange-50 to-orange-200/90 bg-clip-text text-transparent">
							SOLARIS
						</span>
						<div class="mt-2 flex items-center justify-center gap-2 text-4xl lg:text-5xl font-bold tracking-widest text-orange-500">
							S<div class="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 inline-block mx-1"></div>FTWARE
						</div>
					</h1>
					<div class="text-xl lg:text-2xl font-medium tracking-wider text-orange-200/60">
						IGNITING INNOVATION
					</div>
				</div>

				<div class="space-y-12">
					<p class="text-xl lg:text-2xl max-w-2xl mx-auto text-orange-100/90 font-medium leading-relaxed">
						Pioneering the future of business through innovative software solutions.
					</p>

					<a
						href="#contact"
						class="inline-flex items-center gap-3 px-8 py-4 text-white text-lg font-semibold rounded-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-300 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-orange-500/20"
					>
						<span>Begin Your Journey</span>
						<svg class="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none">
							<path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</a>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	:global(body) {
		overflow-x: hidden;
	}

	@keyframes orbital {
		0% {
			transform: rotate(0deg) scale(0.95);
			opacity: 0.7;
		}
		25% {
			transform: rotate(90deg) scale(1.02);
			opacity: 1;
		}
		50% {
			transform: rotate(180deg) scale(0.95);
			opacity: 0.7;
		}
		75% {
			transform: rotate(270deg) scale(1.02);
			opacity: 1;
		}
		100% {
			transform: rotate(360deg) scale(0.95);
			opacity: 0.7;
		}
	}

	.animate-orbital {
		animation: orbital 25s cubic-bezier(0.4, 0, 0.2, 1) infinite;
		will-change: transform, opacity;
	}
</style>