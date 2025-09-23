// Mobile detection utility for consistent performance optimizations
export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

export function isReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function shouldUseReducedAnimations() {
  return isMobileDevice() || isReducedMotion();
}

// Performance settings based on device type
export function getPerformanceConfig() {
  const mobile = isMobileDevice();
  
  return {
    isMobile: mobile,
    particleCount: mobile ? 10 : 50,
    animationDuration: mobile ? 0.5 : 1.0,
    enableComplexAnimations: !mobile,
    enableParticles: !mobile,
    enableMouseTracking: !mobile,
    enableContinuousAnimations: !mobile,
    force3D: !mobile
  };
}