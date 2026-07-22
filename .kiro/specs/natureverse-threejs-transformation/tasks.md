# Implementation Plan: NatureVerse Three.js Transformation

## Overview

Transform the HLS Inter College website from CSS-based particle animations into a premium cinematic 3D WebGL environment using Three.js. The implementation will create a multi-layered particle system with volumetric lighting, mouse parallax, and performance optimization, all rendered behind existing content without modifying the protected Hero component. The system targets 60 FPS on desktop and 30 FPS on mobile while maintaining accessibility and browser compatibility.

## Tasks

- [ ] 1. Install Three.js dependencies and setup TypeScript types
  - Install three@^0.160.0 and @types/three@^0.160.0
  - Verify package.json has correct dependency versions
  - _Requirements: 24.1, 24.2_

- [ ] 2. Create core TypeScript interfaces and configuration
  - [ ] 2.1 Create shared types and interfaces file
    - Define ParticleLayerConfig, ParticleAttributes, SceneConfiguration interfaces
    - Define SunRayConfig, StreakConfig, ParallaxConfig, PerformanceConfig interfaces
    - Define ParticleSystemState, AnimationFrame, ActiveStreak types
    - Create types/natureverse.ts file with all interface definitions
    - _Requirements: 3.1, 5.1, 6.1, 7.1, 8.1_
  
  - [ ]* 2.2 Write property test for configuration validation
    - **Property 19: Configuration Validation**
    - **Validates: Requirements 15.1, 15.2, 15.3, 15.4, 15.5, 15.6**
  
  - [ ] 2.3 Create default scene configuration
    - Create config/sceneConfig.ts with desktop and mobile presets
    - Define camera settings (fov: 75, near: 0.1, far: 1000)
    - Define renderer settings (pixelRatio, antialias, alpha, powerPreference)
    - Define fog settings (color, near, far)
    - Define particle layer counts and ranges for all four layers
    - Define sun ray and shooting streak configuration
    - _Requirements: 1.2, 1.4, 3.2, 3.3, 3.4, 3.5, 5.1, 5.4, 6.1_

- [ ] 3. Implement particle layer classes
  - [ ] 3.1 Create DistantDust particle layer class
    - Create src/components/natureverse/layers/DistantDust.ts
    - Implement constructor that generates 450-650 particles (desktop)
    - Set particle sizes in range 1-3px, opacity 0.15-0.32
    - Initialize positions, velocities, sizes, opacities Float32Arrays
    - Create THREE.Points mesh with THREE.PointsMaterial
    - Implement update(deltaTime) method with falling motion (2-5 units/sec)
    - Implement boundary checking and respawn logic
    - Implement getMesh() and dispose() methods
    - _Requirements: 3.2, 4.1, 4.2, 4.3, 4.8_
  
  - [ ]* 3.2 Write property tests for DistantDust layer
    - **Property 7: Opacity Constraints**
    - **Validates: Requirements 3.7, 4.6**
    - **Property 13: Particle Position Update**
    - **Validates: Requirements 4.1**
    - **Property 18: Particle Attribute Array Consistency**
    - **Validates: Requirements 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7**
  
  - [ ] 3.3 Create MidDepthPollen particle layer class
    - Create src/components/natureverse/layers/MidDepthPollen.ts
    - Implement constructor that generates 180-280 particles (desktop)
    - Set warm golden/amber colors, medium sizes, opacity 0.30-0.62
    - Initialize positions, velocities, sizes, opacities, colors, phases Float32Arrays
    - Apply depth-based size and opacity variation
    - Implement update(deltaTime) with drift + fall motion patterns
    - Use phase offsets for organic sinusoidal movement
    - Implement boundary checking and respawn logic
    - Implement getMesh() and dispose() methods
    - _Requirements: 3.3, 4.1, 4.2, 4.4_
  
  - [ ]* 3.4 Write property tests for MidDepthPollen layer
    - **Property 7: Opacity Constraints**
    - **Validates: Requirements 3.7, 4.6**
    - **Property 18: Particle Attribute Array Consistency**
    - **Validates: Requirements 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7**
  
  - [ ] 3.5 Create ForegroundParticles layer class
    - Create src/components/natureverse/layers/ForegroundParticles.ts
    - Implement constructor that generates 45-75 large particles (desktop)
    - Set soft blur effect, golden bloom, opacity 0.22-0.48
    - Initialize positions, velocities, curvePaths Float32Arrays
    - Implement curved Bezier-like motion paths
    - Implement slow elegant movement with curve following
    - Implement boundary checking and respawn logic
    - Implement getMesh() and dispose() methods
    - _Requirements: 3.4, 4.1, 4.2, 4.5_
  
  - [ ]* 3.6 Write property tests for ForegroundParticles layer
    - **Property 7: Opacity Constraints**
    - **Validates: Requirements 3.7, 4.6**
    - **Property 18: Particle Attribute Array Consistency**
    - **Validates: Requirements 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7**
  
  - [ ] 3.7 Create GroundGrowth particle layer class
    - Create src/components/natureverse/layers/GroundGrowth.ts
    - Implement constructor that generates 80-140 particles (desktop)
    - Set moss green and gold colors, spawn in bottom 20-30%
    - Initialize positions, velocities, lifetimes, maxLifetimes Float32Arrays
    - Implement rising upward motion
    - Implement fade-out opacity before reaching upper half (0.35-0.72 range)
    - Reset particles when they fade out
    - Implement boundary checking and respawn logic
    - Implement getMesh() and dispose() methods
    - _Requirements: 3.5, 4.1, 4.2, 4.6, 4.7_
  
  - [ ]* 3.8 Write property tests for GroundGrowth layer
    - **Property 6: Particle Bounds**
    - **Validates: Requirements 4.2, 4.7**
    - **Property 7: Opacity Constraints**
    - **Validates: Requirements 3.7, 4.6**
    - **Property 18: Particle Attribute Array Consistency**
    - **Validates: Requirements 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7**

- [ ] 4. Checkpoint - Ensure particle layer tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement lighting and visual effects
  - [ ] 5.1 Create SunRays class for volumetric light beams
    - Create src/components/natureverse/effects/SunRays.ts
    - Implement constructor that creates 5-7 sun ray meshes
    - Use THREE.PlaneGeometry for beam shapes
    - Create custom THREE.ShaderMaterial with gradient shaders for soft edges
    - Set different widths, intensities, angles for each ray
    - Use additive blending for light effect
    - Set opacity range 0.08-0.22
    - Implement update(deltaTime) for slow movement (10-18s duration)
    - Implement getMeshes() and dispose() methods
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [ ]* 5.2 Write property tests for SunRays
    - **Property 21: Additive Blending for Light Effects**
    - **Validates: Requirements 5.3, 21.5**
    - **Property 22: Sun Ray Opacity Bounds**
    - **Validates: Requirements 5.6**
  
  - [ ] 5.3 Create ShootingStreaks class for fast golden light streaks
    - Create src/components/natureverse/effects/ShootingStreaks.ts
    - Implement constructor with spawn configuration
    - Create spawn timer logic (intervals 2.5-6 seconds)
    - Implement spawnStreak() method that positions streaks at random edges
    - Assign diagonal velocity vectors pointing inward
    - Set duration 0.45-0.9 seconds, trail length 90-240px
    - Create THREE.ShaderMaterial with core-to-tail gradient (white-gold to golden)
    - Set core opacity 0.75-1, tail opacity 0-0.65
    - Use additive blending
    - Implement update(deltaTime) for streak movement and lifetime tracking
    - Remove expired streaks from activeStreaks array
    - Limit to maximum 10 active streaks
    - Implement getMeshes() and dispose() methods
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9_
  
  - [ ]* 5.4 Write property tests for ShootingStreaks
    - **Property 8: Shooting Streak Lifecycle**
    - **Validates: Requirements 6.3, 6.4, 6.8**
    - **Property 17: Maximum Active Streaks**
    - **Validates: Requirements 6.9**
    - **Property 21: Additive Blending for Light Effects**
    - **Validates: Requirements 5.3, 21.5**

- [ ] 6. Implement interaction and optimization controllers
  - [ ] 6.1 Create ParallaxController class for mouse-based parallax
    - Create src/components/natureverse/controllers/ParallaxController.ts
    - Implement constructor with ParallaxConfig (enabled, sensitivity, maxOffset)
    - Track mouseX, mouseY, targetX, targetY state
    - Implement updateMousePosition(x, y) method with normalized coordinates
    - Implement getParallaxOffset(depth) method that returns x, y offsets (2-14px range)
    - Apply depth-based offset calculation (closer = more movement)
    - Implement update(deltaTime) for smooth interpolation
    - Clamp mouse coordinates to viewport bounds
    - Validate input for NaN/Infinity
    - Implement dispose() method
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.6, 19.1, 19.2_
  
  - [ ]* 6.2 Write property tests for ParallaxController
    - **Property 14: Parallax Depth Proportionality**
    - **Validates: Requirements 7.2, 7.3**
    - **Property 15: Mouse Input Validation**
    - **Validates: Requirements 7.6, 19.1, 19.2**
  
  - [ ] 6.3 Create PerformanceMonitor class for FPS tracking and quality adjustment
    - Create src/components/natureverse/controllers/PerformanceMonitor.ts
    - Implement constructor with PerformanceConfig (targetFPS, checkInterval, qualityLevels)
    - Track frameTimestamps array (rolling window)
    - Track currentQuality state ('high' | 'medium' | 'low')
    - Implement recordFrame(timestamp) method
    - Implement getCurrentFPS() method calculating average over window
    - Implement shouldDowngrade() and shouldUpgrade() methods with thresholds
    - FPS < 30 for 3s → reduce particles 30%
    - FPS < 20 for 5s → reduce particles 50%, disable parallax
    - FPS < 15 for 5s → switch to static fallback
    - FPS > 55 for 10s → restore previous quality
    - Implement getQualitySettings() method
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_
  
  - [ ]* 6.4 Write property tests for PerformanceMonitor
    - **Property 4: Performance Bounds**
    - **Validates: Requirements 1.4, 4.8, 8.6, 9.6**

- [ ] 7. Checkpoint - Ensure controller tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement core NatureVerseWebGL engine
  - [ ] 8.1 Create NatureVerseWebGL component with Three.js initialization
    - Create src/components/natureverse/NatureVerseWebGL.tsx
    - Accept props: mode ('home' | 'internal'), reducedMotion (boolean)
    - Detect device capabilities (mobile, pixelRatio)
    - Create Three.js scene, PerspectiveCamera, WebGLRenderer
    - Set renderer pixel ratio to min(devicePixelRatio, 1.5)
    - Configure renderer (antialias, alpha, powerPreference)
    - Set canvas styles (position: fixed, inset: 0, z-index: 1, pointer-events: none)
    - Add aria-hidden="true" to canvas for accessibility
    - Setup fog (THREE.Fog) and ambient light (THREE.AmbientLight)
    - Append canvas to container element
    - _Requirements: 1.1, 1.2, 1.4, 1.5, 1.6, 10.1, 10.2, 10.3, 10.4, 18.1_
  
  - [ ]* 8.2 Write property tests for canvas setup
    - **Property 1: Canvas Isolation**
    - **Validates: Requirements 1.5, 1.6, 2.2, 17.1**
  
  - [ ] 8.3 Initialize all particle layers in NatureVerseWebGL
    - Import all particle layer classes
    - Load scene configuration from sceneConfig.ts
    - Adjust particle counts for mobile (50% reduction)
    - Instantiate DistantDust, MidDepthPollen, ForegroundParticles, GroundGrowth
    - Add all particle meshes to scene
    - Store layer instances for update loop
    - _Requirements: 1.3, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  
  - [ ]* 8.4 Write property tests for mobile optimization
    - **Property 10: Mobile Optimization**
    - **Validates: Requirements 1.3, 3.6, 10.1**
    - **Property 16: Maximum Particle Safety Limit**
    - **Validates: Requirements 8.7, 19.3**
  
  - [ ] 8.5 Initialize sun rays and shooting streaks in NatureVerseWebGL
    - Instantiate SunRays class with configuration
    - Add all sun ray meshes to scene
    - Instantiate ShootingStreaks class with configuration
    - Store effect instances for update loop
    - _Requirements: 5.1, 6.1_
  
  - [ ] 8.6 Initialize controllers in NatureVerseWebGL
    - Instantiate ParallaxController with configuration
    - Disable parallax if reducedMotion is true
    - Instantiate PerformanceMonitor with target FPS (60 desktop, 30 mobile)
    - _Requirements: 7.1, 7.5, 8.1_

- [ ] 9. Implement animation loop and frame updates
  - [ ] 9.1 Create animation loop with requestAnimationFrame
    - Create animate(timestamp) callback function
    - Calculate deltaTime as (timestamp - lastTimestamp) / 1000
    - Cap deltaTime at 1.0 second
    - Store lastTimestamp for next frame
    - Use requestAnimationFrame to schedule next frame
    - Track animationFrameId for cleanup
    - _Requirements: 9.1, 9.2, 9.6_
  
  - [ ]* 9.2 Write property test for deltaTime bounds
    - **Property 4: Performance Bounds**
    - **Validates: Requirements 1.4, 4.8, 8.6, 9.6**
  
  - [ ] 9.3 Implement frame update logic in animation loop
    - Check if scene is paused (skip updates if paused)
    - Record frame in PerformanceMonitor
    - Check for quality adjustment (shouldDowngrade/shouldUpgrade)
    - Update ParallaxController with deltaTime
    - Update all particle layers (DistantDust, MidDepthPollen, ForegroundParticles, GroundGrowth)
    - Update SunRays with deltaTime
    - Update ShootingStreaks with deltaTime (spawn and remove as needed)
    - Apply parallax offsets to particle layer meshes based on depth
    - Add active shooting streak meshes to scene
    - Call renderer.render(scene, camera)
    - _Requirements: 4.1, 4.2, 5.4, 6.3, 6.4, 7.4, 8.2_
  
  - [ ] 9.4 Implement pause/resume on visibility change
    - Add visibilitychange event listener
    - Set isPaused flag when document.hidden is true
    - Resume updates when document.hidden is false
    - Continue RAF callbacks even when paused
    - _Requirements: 9.3, 9.4_

- [ ] 10. Implement event listeners and responsive behavior
  - [ ] 10.1 Add window resize handler
    - Create resize handler function
    - Update camera aspect ratio to match new viewport
    - Call camera.updateProjectionMatrix()
    - Update renderer size to match new viewport
    - Attach resize event listener on mount
    - Remove resize event listener on unmount
    - _Requirements: 13.1, 13.2, 13.3_
  
  - [ ] 10.2 Add mouse move handler for parallax
    - Create mousemove handler function
    - Normalize mouse coordinates to range [-1, 1]
    - Check if parallax is enabled
    - Call parallaxController.updateMousePosition(normalizedX, normalizedY)
    - Attach mousemove event listener on mount
    - Remove mousemove event listener on unmount
    - _Requirements: 7.1, 7.6_
  
  - [ ]* 10.3 Write property test for interactivity preservation
    - **Property 12: Interactivity Preservation**
    - **Validates: Requirements 17.2, 17.3, 17.4, 17.5**

- [ ] 11. Implement cleanup and resource disposal
  - [ ] 11.1 Create cleanup function in NatureVerseWebGL
    - Cancel animationFrameId using cancelAnimationFrame
    - Call dispose() on all particle layers
    - Call dispose() on SunRays and ShootingStreaks
    - Call dispose() on ParallaxController
    - Call renderer.dispose()
    - Remove all event listeners (resize, mousemove, visibilitychange)
    - Remove canvas element from DOM
    - Clear all references
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [ ]* 11.2 Write property test for resource cleanup
    - **Property 5: Resource Cleanup**
    - **Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5**
  
  - [ ] 11.3 Call cleanup in useEffect cleanup function
    - Use React useEffect hook to initialize engine
    - Return cleanup function from useEffect
    - Ensure cleanup runs on component unmount
    - _Requirements: 9.5, 11.6_

- [ ] 12. Checkpoint - Ensure core engine tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Create NatureVerseShell wrapper component
  - [ ] 13.1 Create NatureVerseShell component with conditional rendering
    - Create src/components/natureverse/NatureVerseShell.tsx
    - Accept props: mode ('home' | 'internal'), routeName (optional)
    - Detect prefers-reduced-motion using matchMedia
    - If reducedMotion is true, render static CSS fallback (gradient background)
    - If reducedMotion is false, render NatureVerseWebGL with mode and reducedMotion props
    - Return null if WebGL initialization fails
    - _Requirements: 12.1, 12.2, 12.3, 12.4_
  
  - [ ]* 13.2 Write property test for reduced motion compliance
    - **Property 9: Reduced Motion Compliance**
    - **Validates: Requirements 7.5, 12.1, 12.2, 12.3**

- [ ] 14. Create NatureVersePageWrapper for internal pages
  - [ ] 14.1 Create NatureVersePageWrapper component
    - Create src/components/natureverse/NatureVersePageWrapper.tsx
    - Accept children prop
    - Render NatureVerseShell with mode='internal'
    - Render children inside wrapper
    - Ensure canvas is positioned behind children content
    - _Requirements: 14.2, 14.3_

- [ ] 15. Integrate NatureVerseShell into homepage
  - [ ] 15.1 Wrap homepage content sections in home-natureverse container
    - Open HomePage component
    - Add .home-natureverse wrapper div around Features, Stats, and other sections (NOT Hero)
    - Import and render NatureVerseShell with mode='home' inside wrapper
    - Ensure Hero component is NOT wrapped or modified
    - Verify Hero scroll animations still work
    - _Requirements: 2.1, 2.3, 14.1_
  
  - [ ]* 15.2 Write integration test for Hero protection
    - **Property 2: Hero Protection**
    - **Validates: Requirements 2.1, 2.3, 2.4**

- [ ] 16. Integrate NatureVersePageWrapper into internal pages
  - [ ] 16.1 Wrap internal page routes with NatureVersePageWrapper
    - Identify internal pages (About, Academics, Admissions, Faculty, Contact, etc.)
    - Import NatureVersePageWrapper in each internal page component
    - Wrap page content with NatureVersePageWrapper
    - Test navigation between pages
    - _Requirements: 14.2_
  
  - [ ]* 16.2 Write integration test for scene singleton
    - **Property 11: Scene Singleton**
    - **Validates: Requirements 11.6, 14.4**

- [ ] 17. Implement error handling and fallbacks
  - [ ] 17.1 Add try-catch blocks for WebGL initialization
    - Wrap renderer creation in try-catch
    - Log errors to console
    - Set initialization failure flag
    - Render static fallback on failure
    - _Requirements: 1.7, 23.1_
  
  - [ ] 17.2 Add GPU memory error handling
    - Catch out-of-memory errors during particle initialization
    - Reduce particle counts by 50% on first failure
    - Retry initialization with lower quality
    - Fall back to minimal particles (100 total) or static on second failure
    - Log all attempts and failures
    - _Requirements: 23.2, 23.3_
  
  - [ ] 17.3 Add resize event debouncing
    - Implement debounce utility for resize handler
    - Prevent excessive recalculation during resize
    - Update on next animation frame after resize settles
    - _Requirements: 13.4, 23.4_
  
  - [ ]* 17.4 Write integration tests for error scenarios
    - Test WebGL initialization failure fallback
    - Test GPU memory error recovery
    - Test resize handling without crashes
    - _Requirements: 23.1, 23.2, 23.3, 23.4_

- [ ] 18. Verify browser compatibility and performance budgets
  - [ ]* 18.1 Test on multiple browsers (Chrome, Firefox, Safari, Edge)
    - Verify rendering on Chrome (latest 2 versions)
    - Verify rendering on Firefox (latest 2 versions)
    - Verify rendering on Safari (latest 2 versions)
    - Verify rendering on Edge (latest 2 versions)
    - Test WebGL fallback on browsers without WebGL support
    - _Requirements: 22.1, 22.2, 22.3, 22.4_
  
  - [ ]* 18.2 Verify performance budgets
    - Measure GPU memory usage (< 50MB desktop, < 25MB mobile)
    - Measure frame render time (< 16.67ms desktop, < 33.33ms mobile)
    - Verify single draw call per particle layer
    - Test on low-end devices
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_
  
  - [ ]* 18.3 Write unit tests for material configurations
    - **Property 20: Material Transparency**
    - **Validates: Requirements 21.4, 21.6**
    - Test PointsMaterial transparency settings
    - Test ShaderMaterial transparency settings
    - Test depth write settings

- [ ] 19. Final integration and polish
  - [ ] 19.1 Verify all particle visibility requirements
    - Test that all four layers are visible and distinct
    - Verify particle counts match specifications
    - Verify opacity ranges match specifications
    - Verify color schemes match specifications (warm gold, moss green)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ]* 19.2 Write integration test for particle visibility
    - **Property 3: Particle Visibility**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
  
  - [ ] 19.3 Test shooting streaks visibility and behavior
    - Verify streaks spawn at correct intervals
    - Verify streaks are clearly visible
    - Verify golden gradient effect
    - Verify diagonal movement across screen
    - _Requirements: 6.1, 6.2, 6.5, 6.6, 6.7_
  
  - [ ] 19.4 Test sun rays visibility and atmosphere
    - Verify 5-7 sun rays are visible
    - Verify soft edges and additive blending
    - Verify slow graceful movement
    - Verify atmospheric effect contributes to depth
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ] 19.5 Test parallax interactivity
    - Move mouse around viewport
    - Verify foreground particles move more than background
    - Verify smooth interpolation
    - Verify offset ranges (2-14px)
    - _Requirements: 7.2, 7.3, 7.4_
  
  - [ ] 19.6 Test performance optimization in action
    - Throttle CPU/GPU in browser DevTools
    - Verify quality downgrade when FPS drops
    - Verify quality upgrade when FPS recovers
    - Verify graceful degradation path
    - _Requirements: 8.2, 8.3, 8.4, 8.5_

- [ ] 20. Final checkpoint - Comprehensive testing and verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional testing tasks that can be skipped for faster MVP
- The design uses TypeScript, so all implementation will be in TypeScript
- Hero.tsx must remain completely unmodified throughout implementation
- Canvas must be positioned with z-index:1 and pointer-events:none to preserve interactivity
- Mobile devices receive 50% particle count reduction automatically
- Performance monitoring adjusts quality dynamically based on FPS
- Reduced motion preference disables all animations (static fallback)
- Three.js scene must persist across route changes (singleton pattern)
- Property tests validate 22 correctness properties from the design
- Error handling includes WebGL init failure, GPU memory exhaustion, and performance degradation
- Browser compatibility targets latest 2 versions of Chrome, Firefox, Safari, Edge
- Performance budgets: < 50MB GPU memory desktop, < 25MB mobile, 60 FPS desktop, 30 FPS mobile

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "2.3"] },
    { "id": 2, "tasks": ["2.2", "3.1", "3.3", "3.5", "3.7"] },
    { "id": 3, "tasks": ["3.2", "3.4", "3.6", "3.8"] },
    { "id": 4, "tasks": ["5.1", "5.3"] },
    { "id": 5, "tasks": ["5.2", "5.4", "6.1", "6.3"] },
    { "id": 6, "tasks": ["6.2", "6.4"] },
    { "id": 7, "tasks": ["8.1"] },
    { "id": 8, "tasks": ["8.2", "8.3", "8.5", "8.6"] },
    { "id": 9, "tasks": ["8.4", "9.1"] },
    { "id": 10, "tasks": ["9.2", "9.3", "9.4"] },
    { "id": 11, "tasks": ["10.1", "10.2"] },
    { "id": 12, "tasks": ["10.3", "11.1"] },
    { "id": 13, "tasks": ["11.2", "11.3"] },
    { "id": 14, "tasks": ["13.1"] },
    { "id": 15, "tasks": ["13.2", "14.1"] },
    { "id": 16, "tasks": ["15.1", "16.1"] },
    { "id": 17, "tasks": ["15.2", "16.2", "17.1", "17.2", "17.3"] },
    { "id": 18, "tasks": ["17.4", "18.1", "18.2", "18.3"] },
    { "id": 19, "tasks": ["19.1", "19.3", "19.4", "19.5", "19.6"] },
    { "id": 20, "tasks": ["19.2"] }
  ]
}
```
