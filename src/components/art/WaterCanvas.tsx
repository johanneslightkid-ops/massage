import { useEffect, useRef, useState } from 'react'
import type { Phase } from '@/lib/theme'
import { cn } from '@/lib/utils'

/**
 * The Caribbean, as a fragment shader.
 *
 * One full-screen triangle and one shader — no three.js, no textures, about
 * four kilobytes. It paints a sky that follows the phase of the day, a sun
 * (or moon) with its glitter column on the water, perspective swell that
 * fades into a hazy horizon, a little caustic shimmer near the shore, and
 * at night stars overhead and bioluminescence in the wake.
 *
 * Built to be cheap on a phone in a hotel room:
 *   · rendered at a fraction of device pixels, then scaled up by CSS
 *     (water is soft — nobody can see the difference);
 *   · 30 fps on touch devices, 60 on desktop;
 *   · stops entirely when scrolled out of view or the tab is hidden;
 *   · never starts for reduced-motion or Save-Data visitors, or on a
 *     device without WebGL — the static `fallback` stays in place instead.
 */

type RGB = [number, number, number]

interface Palette {
  skyTop: RGB
  skyHorizon: RGB
  seaDeep: RGB
  seaShallow: RGB
  sun: RGB
  sunPos: [number, number]
  night: number
}

const hex = (value: string): RGB => {
  const n = parseInt(value.slice(1), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

export const WATER_PALETTES: Record<Phase, Palette> = {
  dawn: {
    skyTop: hex('#8fb8ee'),
    skyHorizon: hex('#ffd6e2'),
    seaDeep: hex('#2b78ad'),
    seaShallow: hex('#8edbe4'),
    sun: hex('#ffd2a6'),
    sunPos: [0.2, 0.6],
    night: 0,
  },
  day: {
    skyTop: hex('#6fc1f0'),
    skyHorizon: hex('#eef9ff'),
    seaDeep: hex('#0b8bb0'),
    seaShallow: hex('#4fdde0'),
    sun: hex('#fff3d1'),
    sunPos: [0.8, 0.84],
    night: 0,
  },
  dusk: {
    skyTop: hex('#5e6fc8'),
    skyHorizon: hex('#ffb9a6'),
    seaDeep: hex('#27548c'),
    seaShallow: hex('#e892b2'),
    sun: hex('#ffb178'),
    sunPos: [0.74, 0.58],
    night: 0.15,
  },
  night: {
    skyTop: hex('#040a1c'),
    skyHorizon: hex('#1c2c5c'),
    seaDeep: hex('#020c1a'),
    seaShallow: hex('#0a3550'),
    sun: hex('#dfe8ff'),
    sunPos: [0.82, 0.9],
    night: 1,
  },
}

const VERTEX = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const FRAGMENT = `
precision mediump float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform float uHorizon;
uniform float uNight;
uniform vec3 uSkyTop;
uniform vec3 uSkyHorizon;
uniform vec3 uSeaDeep;
uniform vec3 uSeaShallow;
uniform vec3 uSun;
uniform vec2 uSunPos;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float swell(vec2 p, float t) {
  float h = sin(p.x * 1.1 + t * 0.8 + sin(p.y * 0.6 + t * 0.3)) * 0.5;
  h += sin(p.x * 2.6 - p.y * 1.2 + t * 1.3) * 0.25;
  h += noise(p * 2.8 + vec2(t * 0.45, t * 0.2)) * 0.4;
  h += noise(p * 6.5 - vec2(t * 0.7, 0.0)) * 0.14;
  return h;
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / uRes.y;
  float t = uTime;
  vec3 col;

  if (uv.y > uHorizon) {
    float k = (uv.y - uHorizon) / (1.0 - uHorizon);
    col = mix(uSkyHorizon, uSkyTop, pow(k, 0.75));

    vec2 d = uv - uSunPos;
    d.x *= aspect;
    float r = length(d);
    float disc = smoothstep(0.055, 0.045, r);
    col = mix(col, uSun, disc * 0.95);
    col += uSun * exp(-r * 5.5) * (0.42 - uNight * 0.22);

    if (uNight > 0.01) {
      vec2 g = floor(uv * vec2(aspect, 1.0) * 170.0);
      float star = step(0.9965, hash(g));
      float tw = 0.45 + 0.55 * sin(t * 1.7 + hash(g + 7.0) * 6.283);
      col += vec3(star * tw * uNight * smoothstep(0.05, 0.5, k));
    }
  } else {
    float depth = (uHorizon - uv.y) / uHorizon;
    float z = 1.0 / (depth + 0.045);
    vec2 p = vec2((uv.x - 0.5) * aspect * z * 0.9, z * 1.4);

    float e = 0.04;
    float h = swell(p, t);
    float hx = swell(p + vec2(e, 0.0), t) - h;
    float hy = swell(p + vec2(0.0, e), t) - h;
    vec3 n = normalize(vec3(-hx * 2.2, 1.0, -hy * 0.6));

    vec3 water = mix(uSeaDeep, uSeaShallow, smoothstep(0.15, 1.0, depth) * 0.85 + h * 0.06);
    vec3 sky = mix(uSkyHorizon, uSkyTop, 0.35);
    float fres = clamp(0.1 + pow(1.0 - n.y, 2.0) * 3.0 + (1.0 - depth) * 0.45, 0.0, 1.0);
    col = mix(water, sky, fres * (0.75 - uNight * 0.25));

    float dx = (uv.x - uSunPos.x) * aspect;
    float column = exp(-dx * dx * (10.0 + depth * 26.0) / (0.12 + depth));
    float glitter = pow(noise(p * vec2(5.0, 12.0) + vec2(t * 1.6, -t)), 7.0);
    col += uSun * column * (0.18 + glitter * 3.2) * (1.0 - depth * 0.55);

    float caustic = pow(abs(sin(h * 5.5 + t * 1.1)), 16.0) * smoothstep(0.55, 1.0, depth);
    col += vec3(0.85, 1.0, 1.0) * caustic * 0.16 * (1.0 - uNight * 0.7);

    float bio = pow(noise(p * vec2(8.0, 20.0) + vec2(t * 0.35, t * 0.5)), 10.0) * uNight * depth * 3.5;
    col += vec3(0.15, 0.95, 1.0) * bio;

    col = mix(col, uSkyHorizon, exp(-depth * 16.0) * 0.75);
  }

  gl_FragColor = vec4(col, 1.0);
}`

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

/** True when a visitor or their device has asked us to go easy. */
function shouldStayStill(): boolean {
  if (typeof window === 'undefined') return true
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return Boolean(connection?.saveData)
}

export function WaterCanvas({
  phase,
  horizon = 0.42,
  className,
  fallback,
}: {
  phase: Phase
  /** Height of the horizon, from the bottom, as a fraction of the canvas. */
  horizon?: number
  className?: string
  /** Painted until (and unless) the shader is running. */
  fallback?: React.ReactNode
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const paletteRef = useRef<Palette>(WATER_PALETTES[phase])
  const horizonRef = useRef(horizon)
  const [running, setRunning] = useState(false)

  paletteRef.current = WATER_PALETTES[phase]
  horizonRef.current = horizon

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || shouldStayStill()) return

    let gl: WebGLRenderingContext | null = null
    let frame = 0
    let visible = true
    let disposed = false
    let idle = 0

    const coarse = window.matchMedia('(pointer: coarse)').matches
    const frameBudget = coarse ? 1000 / 30 : 1000 / 60
    // Water is soft-focus by nature: a fraction of the device pixels is plenty.
    const scale = Math.min(window.devicePixelRatio || 1, 2) * (coarse ? 0.42 : 0.6)

    const start = () => {
      if (disposed) return
      gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power', depth: false })
      if (!gl) return

      const vs = compile(gl, gl.VERTEX_SHADER, VERTEX)
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
      if (!vs || !fs) return
      const program = gl.createProgram()!
      gl.attachShader(program, vs)
      gl.attachShader(program, fs)
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
      gl.useProgram(program)

      const buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      // One oversized triangle covers the viewport with no diagonal seam.
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
      const aPos = gl.getAttribLocation(program, 'aPos')
      gl.enableVertexAttribArray(aPos)
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

      const u = (name: string) => gl!.getUniformLocation(program, name)
      const uniforms = {
        res: u('uRes'),
        time: u('uTime'),
        horizon: u('uHorizon'),
        night: u('uNight'),
        skyTop: u('uSkyTop'),
        skyHorizon: u('uSkyHorizon'),
        seaDeep: u('uSeaDeep'),
        seaShallow: u('uSeaShallow'),
        sun: u('uSun'),
        sunPos: u('uSunPos'),
      }

      const resize = () => {
        const width = Math.max(1, Math.round(canvas.clientWidth * scale))
        const height = Math.max(1, Math.round(canvas.clientHeight * scale))
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width
          canvas.height = height
          gl!.viewport(0, 0, width, height)
        }
      }

      const begin = performance.now()
      let last = 0

      const draw = (nowMs: number) => {
        frame = 0
        if (disposed || !visible || document.hidden) return
        frame = requestAnimationFrame(draw)
        if (nowMs - last < frameBudget) return
        last = nowMs

        resize()
        const p = paletteRef.current
        gl!.uniform2f(uniforms.res, canvas.width, canvas.height)
        gl!.uniform1f(uniforms.time, (nowMs - begin) / 1000)
        gl!.uniform1f(uniforms.horizon, horizonRef.current)
        gl!.uniform1f(uniforms.night, p.night)
        gl!.uniform3fv(uniforms.skyTop, p.skyTop)
        gl!.uniform3fv(uniforms.skyHorizon, p.skyHorizon)
        gl!.uniform3fv(uniforms.seaDeep, p.seaDeep)
        gl!.uniform3fv(uniforms.seaShallow, p.seaShallow)
        gl!.uniform3fv(uniforms.sun, p.sun)
        gl!.uniform2f(uniforms.sunPos, p.sunPos[0], p.sunPos[1])
        gl!.drawArrays(gl!.TRIANGLES, 0, 3)
      }

      const resume = () => {
        if (!frame && visible && !document.hidden && !disposed) frame = requestAnimationFrame(draw)
      }

      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        resume()
      })
      observer.observe(canvas)
      document.addEventListener('visibilitychange', resume)

      canvas.addEventListener('webglcontextlost', (event) => {
        event.preventDefault()
        setRunning(false)
      })

      resume()
      setRunning(true)

      cleanup = () => {
        observer.disconnect()
        document.removeEventListener('visibilitychange', resume)
        gl?.getExtension('WEBGL_lose_context')?.loseContext()
      }
    }

    let cleanup = () => {}

    // Never compete with the first paint: the static sea is already there.
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
      .requestIdleCallback
    idle = ric ? ric(start, { timeout: 1200 }) : window.setTimeout(start, 350)

    return () => {
      disposed = true
      if (frame) cancelAnimationFrame(frame)
      const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback
      if (cic) cic(idle)
      else window.clearTimeout(idle)
      cleanup()
    }
  }, [])

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      <div className={cn('absolute inset-0 transition-opacity duration-1000', running && 'opacity-0')}>{fallback}</div>
      <canvas
        ref={canvasRef}
        className={cn('absolute inset-0 size-full transition-opacity duration-1000', running ? 'opacity-100' : 'opacity-0')}
      />
    </div>
  )
}
