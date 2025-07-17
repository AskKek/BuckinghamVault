'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { useDeviceDetection } from '@/lib/animation-utils'

interface InteractiveLiquidGoldShaderProps {
  className?: string
  quality?: 'high' | 'medium' | 'low'
  enabled?: boolean
}

export function InteractiveLiquidGoldShader({ 
  className = '', 
  quality: userQuality,
  enabled = true 
}: InteractiveLiquidGoldShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<WebGL2RenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  
  const { isMobileOrTablet, isLowEndDevice } = useDeviceDetection()
  
  // Smart quality detection based on device capabilities
  const quality = useMemo(() => {
    if (userQuality) return userQuality
    
    // Device-specific quality optimization
    if (isLowEndDevice) return 'low'
    if (isMobileOrTablet) return 'medium'
    return 'high'
  }, [userQuality, isMobileOrTablet, isLowEndDevice])
  
  const [isClient, setIsClient] = useState(false)
  const [isWebGLSupported, setIsWebGLSupported] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [performanceMode, setPerformanceMode] = useState<'auto' | 'performance' | 'quality'>('auto')
  const performanceTimerRef = useRef<number>(0)
  const frameCountRef = useRef<number>(0)
  const lastPerformanceCheckRef = useRef<number>(Date.now())
  
  // Mouse/touch state
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 })
  const mouseStrengthRef = useRef(0)
  const targetMouseStrengthRef = useRef(0)
  const clickPosRef = useRef({ x: 0.5, y: 0.5 })
  const clickTimeRef = useRef(999)
  
  // Adaptive quality settings based on performance
  const getAdaptiveQuality = useMemo(() => {
    const baseQuality = quality === 'high' ? 1.0 : quality === 'medium' ? 0.5 : 0.3
    
    // Reduce quality further in performance mode
    if (performanceMode === 'performance') {
      return Math.max(baseQuality * 0.7, 0.2)
    }
    
    // Increase quality in quality mode (only on capable devices)
    if (performanceMode === 'quality' && !isLowEndDevice) {
      return Math.min(baseQuality * 1.2, 1.0)
    }
    
    return baseQuality
  }, [quality, performanceMode, isLowEndDevice])

  // Vertex shader source
  const vertexShaderSource = `#version 300 es
    in vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }`

  // Fragment shader source - Royal Liquid Gold
  const fragmentShaderSource = `#version 300 es
    precision highp float;
    
    uniform vec2 resolution;
    uniform float time;
    uniform vec2 mouse;
    uniform float mouseStrength;
    uniform vec2 clickPos;
    uniform float clickTime;
    uniform float quality;
    
    out vec4 fragColor;
    
    // Noise functions
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                         -0.577350269189626, 0.024390243902439);
      vec2 i = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
          + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
          dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    
    // Fluid dynamics
    float fluidNoise(vec2 uv, float t) {
      float n = 0.0;
      float amplitude = 1.0;
      float frequency = 2.0;
      
      int iterations = quality > 0.5 ? 5 : 3;
      for (int i = 0; i < iterations; i++) {
        n += snoise(uv * frequency + t * 0.3) * amplitude;
        amplitude *= 0.5;
        frequency *= 2.2;
      }
      
      return n * 0.5 + 0.5;
    }
    
    // Glimmer effect
    float glimmer(vec2 uv, float t) {
      float sparkle = snoise(uv * 50.0 + t * 2.0);
      sparkle = pow(max(sparkle, 0.0), 3.0);
      return sparkle * quality;
    }
    
    void main() {
      vec2 uv = gl_FragCoord.xy / resolution;
      vec2 centered = (gl_FragCoord.xy - resolution * 0.5) / min(resolution.x, resolution.y);
      
      // Mouse influence
      vec2 mouseInfluence = centered - (mouse - 0.5) * 2.0;
      float mouseDist = length(mouseInfluence);
      float mouseWave = sin(mouseDist * 10.0 - time * 3.0) * exp(-mouseDist * 2.0) * mouseStrength;
      
      // Click ripple effect
      vec2 clickInfluence = centered - (clickPos - 0.5) * 2.0;
      float clickDist = length(clickInfluence);
      float clickFade = exp(-clickTime * 2.0);
      float clickWave = sin(clickDist * 15.0 - clickTime * 8.0) * exp(-clickDist * 3.0) * clickFade;
      
      // Fluid distortion
      vec2 distortion = vec2(
        fluidNoise(centered * 3.0 + vec2(time * 0.1, 0.0), time),
        fluidNoise(centered * 3.0 + vec2(0.0, time * 0.1), time)
      ) * 0.1;
      
      distortion += mouseWave * 0.05 * normalize(mouseInfluence + vec2(0.001));
      distortion += clickWave * 0.08 * normalize(clickInfluence + vec2(0.001));
      
      vec2 distortedUV = centered + distortion;
      
      // Base liquid gold color
      float noise1 = fluidNoise(distortedUV * 2.0, time * 0.5);
      float noise2 = fluidNoise(distortedUV * 4.0 + vec2(100.0), time * 0.3);
      float combinedNoise = noise1 * 0.7 + noise2 * 0.3;
      
      // Gold gradient - adjusted to match Buckingham Vault palette
      vec3 goldDark = vec3(0.502, 0.251, 0.125);    // #804020
      vec3 goldMid = vec3(0.8, 0.522, 0.2);         // #CC8533
      vec3 goldBright = vec3(1.0, 0.8, 0.4);        // #FFCC66
      vec3 goldHighlight = vec3(1.0, 0.949, 0.702); // #FFF2B3
      
      // Create metallic appearance
      float metallic = pow(combinedNoise, 0.8);
      vec3 baseColor = mix(goldDark, goldMid, metallic);
      baseColor = mix(baseColor, goldBright, pow(metallic, 2.0));
      
      // Add glimmer (reduced on lower quality)
      if (quality > 0.3) {
        float glimmerAmount = glimmer(distortedUV * 10.0, time);
        baseColor = mix(baseColor, goldHighlight, glimmerAmount * 0.5);
      }
      
      // Edge lighting for depth
      float edgeFactor = 1.0 - smoothstep(0.0, 2.0, length(centered));
      baseColor = mix(baseColor * 0.8, baseColor, edgeFactor);
      
      // Subtle vignette
      float vignette = 1.0 - length(centered) * 0.3;
      baseColor *= vignette;
      
      // Interactive highlights
      float interactiveGlow = max(mouseWave * 2.0, 0.0) + max(clickWave * 3.0, 0.0);
      baseColor = mix(baseColor, goldHighlight, interactiveGlow * 0.3);
      
      // Mix with navy background for Buckingham Vault aesthetic
      vec3 navyBg = vec3(0.063, 0.106, 0.243); // #101b3e
      baseColor = mix(navyBg, baseColor, 0.85);
      
      fragColor = vec4(baseColor, 1.0);
    }`

  // Shader compilation helper
  const createShader = (gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type)
    if (!shader) return null
    
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }
    
    return shader
  }

  // Program creation helper
  const createProgram = (gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null => {
    const program = gl.createProgram()
    if (!program) return null
    
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program))
      gl.deleteProgram(program)
      return null
    }
    
    return program
  }

  // Handle mouse/touch movement
  const handleMove = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    targetMouseRef.current.x = clientX / rect.width
    targetMouseRef.current.y = 1.0 - (clientY / rect.height)
    targetMouseStrengthRef.current = 1.0
  }

  // Handle click/tap
  const handleClick = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    clickPosRef.current.x = clientX / rect.width
    clickPosRef.current.y = 1.0 - (clientY / rect.height)
    clickTimeRef.current = 0
  }

  // Initialize WebGL
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !enabled || !canvasRef.current) return

    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      preserveDrawingBuffer: false,
      powerPreference: quality === 'low' ? 'low-power' : 'high-performance'
    })

    if (!gl) {
      setIsWebGLSupported(false)
      setIsLoading(false)
      return
    }

    glRef.current = gl

    // Create shaders and program
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    
    if (!vertexShader || !fragmentShader) {
      setIsWebGLSupported(false)
      setIsLoading(false)
      return
    }

    const program = createProgram(gl, vertexShader, fragmentShader)
    if (!program) {
      setIsWebGLSupported(false)
      setIsLoading(false)
      return
    }

    programRef.current = program

    // Get uniform locations
    const uniforms = {
      resolution: gl.getUniformLocation(program, 'resolution'),
      time: gl.getUniformLocation(program, 'time'),
      mouse: gl.getUniformLocation(program, 'mouse'),
      mouseStrength: gl.getUniformLocation(program, 'mouseStrength'),
      clickPos: gl.getUniformLocation(program, 'clickPos'),
      clickTime: gl.getUniformLocation(program, 'clickTime'),
      quality: gl.getUniformLocation(program, 'quality')
    }

    // Create vertex buffer
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, 'position')

    // Handle resize
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, quality === 'high' ? 2 : 1)
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    // Set up event listeners
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY)
    const handleMouseLeave = () => { targetMouseStrengthRef.current = 0 }
    const handleMouseClick = (e: MouseEvent) => handleClick(e.clientX, e.clientY)
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    }
    
    const handleTouchEnd = () => { targetMouseStrengthRef.current = 0 }
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      handleClick(touch.clientX, touch.clientY)
      handleMove(touch.clientX, touch.clientY)
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('click', handleMouseClick)
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd)
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('resize', handleResize)

    handleResize()
    setIsLoading(false)

    // Performance monitoring for adaptive quality
    const checkPerformance = () => {
      frameCountRef.current++
      const now = Date.now()
      const timeDiff = now - lastPerformanceCheckRef.current
      
      // Check every 60 frames or 2 seconds
      if (frameCountRef.current >= 60 || timeDiff >= 2000) {
        const fps = (frameCountRef.current / timeDiff) * 1000
        
        // Auto-adjust quality based on performance
        if (performanceMode === 'auto') {
          if (fps < 30 && quality !== 'low') {
            setPerformanceMode('performance')
          } else if (fps > 55 && !isLowEndDevice && quality !== 'high') {
            setPerformanceMode('quality')
          }
        }
        
        frameCountRef.current = 0
        lastPerformanceCheckRef.current = now
      }
    }

    // Animation loop with performance optimization
    const animate = () => {
      if (!gl || !program) return

      const frameStart = performance.now()
      const currentTime = (Date.now() - startTimeRef.current) * 0.001

      // Performance check (only on capable devices)
      if (!isLowEndDevice) {
        checkPerformance()
      }

      // Smooth mouse interpolation (reduced on low-end devices)
      const lerpFactor = isLowEndDevice ? 0.15 : 0.1
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * lerpFactor
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * lerpFactor
      mouseStrengthRef.current += (targetMouseStrengthRef.current - mouseStrengthRef.current) * lerpFactor

      // Update click time (slower on low-end devices)
      clickTimeRef.current += isLowEndDevice ? 0.02 : 0.016

      // Clear and render
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.useProgram(program)

      // Set uniforms with adaptive quality
      gl.uniform2f(uniforms.resolution!, canvas.width, canvas.height)
      gl.uniform1f(uniforms.time!, currentTime)
      gl.uniform2f(uniforms.mouse!, mouseRef.current.x, mouseRef.current.y)
      gl.uniform1f(uniforms.mouseStrength!, mouseStrengthRef.current)
      gl.uniform2f(uniforms.clickPos!, clickPosRef.current.x, clickPosRef.current.y)
      gl.uniform1f(uniforms.clickTime!, clickTimeRef.current)
      gl.uniform1f(uniforms.quality!, getAdaptiveQuality)

      // Bind vertex buffer and draw
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      // Skip frames on low-end devices if performance is poor
      const frameTime = performance.now() - frameStart
      if (isLowEndDevice && frameTime > 20) { // 20ms = 50fps target
        setTimeout(() => {
          animationRef.current = requestAnimationFrame(animate)
        }, 16) // Throttle to ~60fps max
      } else {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('click', handleMouseClick)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
      canvas.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('resize', handleResize)

      if (gl) {
        gl.deleteProgram(program)
        gl.deleteShader(vertexShader)
        gl.deleteShader(fragmentShader)
        gl.deleteBuffer(vertexBuffer)
      }
    }
  }, [isClient, enabled, quality])

  // SSR fallback
  if (!isClient) {
    return (
      <div className={cn("absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy-dark overflow-hidden", className)}>
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-gold/5" />
      </div>
    )
  }

  // WebGL not supported fallback
  if (!isWebGLSupported) {
    return <RoyalLiquidGoldFallback className={className} />
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy-dark">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-gold/5 animate-pulse" />
        </div>
      )}
      
      {/* WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 w-full h-full",
          isLoading && "opacity-0",
          !isLoading && "opacity-100 transition-opacity duration-1000"
        )}
        style={{ 
          touchAction: 'none',
          willChange: 'transform'
        }}
      />
    </div>
  )
}

// CSS-based fallback for unsupported devices
function RoyalLiquidGoldFallback({ className = "" }: { className?: string }) {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <div className="relative w-full h-full">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy-dark" />
        
        {/* Interactive gold gradient */}
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{
            background: `
              radial-gradient(
                600px circle at ${mousePosition.x}% ${mousePosition.y}%,
                rgba(244, 185, 66, 0.3) 0%,
                rgba(215, 147, 9, 0.2) 25%,
                transparent 70%
              )
            `
          }}
        />
        
        {/* Animated shimmer */}
        <div className="absolute inset-0 opacity-30">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/20 to-transparent"
            style={{
              animation: 'shimmer 8s ease-in-out infinite',
              transform: 'skewX(-20deg)'
            }}
          />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
      `}</style>
    </div>
  )
}