3D Interactive Particle Field (Week 7 Assignment)
What Was Built
A custom interactive 3D particle background integrated into the capstone/portfolio.

Built using Three.js with dual buffer geometries split into custom Rose Quartz (#f7cac9) and Serenity (#92a8d1) color groups using additive blending.

Includes real-time cursor reaction that smoothly shifts the perspective camera using linear interpolation (lerp).

Performance Notes (FE-10 Lens)
Bundle & Asset Footprint: Zero external heavy .glb assets or textures required; geometry is generated programmatically on the GPU via BufferGeometry, keeping asset size at 0KB.

Responsible Loading: Wrapped in a Next.js "use client" component with canvas lazy-loading and efficient cleanup (dispose(), cancelAnimationFrame(), ResizeObserver) to prevent memory leaks.

Frame Rate: Maintains a locked 60 FPS on both desktop and mobile viewports with minimal CPU/GPU overhead.

With More Time, I Would Add:
A toggle control to switch between different color themes or particle shapes (e.g., rotating geometric mesh clusters).
