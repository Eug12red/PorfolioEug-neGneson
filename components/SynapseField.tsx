'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import { ShaderMaterial, Vector2 } from 'three'

/**
 * SYNAPSE FIELD
 *
 * Adapté du shader fbm + mouse influence + chromatic split.
 * Tonalité : monochrome teinté cyan synapse, pour rester dans
 * la DA — pas de RGB criard. La souris écarte la matière.
 */

const fragmentShader = /* glsl */ `
  precision mediump float;

  uniform float u_time;
  uniform vec2  u_mouse;       // -1..1 (clipspace y inversé)
  uniform vec2  u_resolution;
  varying vec2  vUv;

  // ─── Palette SYNAPSE ─────────────────────────────────
  const vec3 VOID    = vec3(0.039, 0.043, 0.058);  // #0A0B0F
  const vec3 SYNAPSE = vec3(0.498, 0.906, 0.863);  // #7FE7DC
  const vec3 IVORY   = vec3(0.949, 0.937, 0.913);  // #F2EFE9

  float hash(vec2 p) {
    float h = dot(p, vec2(127.1, 311.7));
    return fract(sin(h) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.5;
    float freq = 2.0;
    for(int i = 0; i < 5; i++) {
      value += amp * noise(p * freq);
      amp *= 0.5;
      freq *= 2.0;
    }
    return value;
  }

  void main() {
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    vec2 uv     = vUv * aspect;
    // u_mouse arrive en -1..1 → on le projette en uv * aspect
    vec2 mouse  = (u_mouse * 0.5 + 0.5) * aspect;

    float dist           = length(uv - mouse);
    float mouseInfluence = smoothstep(0.55, 0.0, dist);

    // Champ déformé par fbm — la matière respire
    vec2 offset = vec2(
      fbm(uv + u_time * 0.08),
      fbm(uv + u_time * 0.08 + 5.0)
    );

    // Chromatic split : on garde l'idée d'écartement, mais sur 2 luminances
    //  → un canal sombre (void), un canal clair (synapse)
    float fLow  = fbm(uv + offset - vec2(mouseInfluence * 0.12, 0.0));
    float fMid  = fbm(uv + offset);
    float fHigh = fbm(uv + offset + vec2(mouseInfluence * 0.12, 0.0));

    // Battement très lent pour la "vie"
    float breath = 0.85 + 0.15 * sin(u_time * 0.6);

    // Composition monochrome teintée
    vec3 base = mix(VOID, SYNAPSE * 0.55, fMid * breath);
    base      = mix(base, IVORY * 0.35, smoothstep(0.55, 0.95, fHigh) * 0.4);

    // Halo lumineux sous le curseur
    base += SYNAPSE * mouseInfluence * 0.35;

    // Très léger trait clair où le canal "haut" et "bas" divergent
    float split = abs(fHigh - fLow) * mouseInfluence;
    base += SYNAPSE * split * 0.6;

    // Vignette douce
    float v = 1.0 - smoothstep(0.5, 1.3, length(vUv - 0.5));
    base *= mix(0.6, 1.0, v);

    gl_FragColor = vec4(base, 1.0);
  }
`

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

function Plane() {
  const matRef = useRef<ShaderMaterial>(null!)
  const target = useRef(new Vector2(0, 0))
  const mouse  = useRef(new Vector2(0, 0))

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1) // inversion Y
      )
    }
    const onResize = () => {
      if (matRef.current) {
        matRef.current.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight)
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('resize', onResize)
    onResize()
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useFrame(({ clock }) => {
    if (!matRef.current) return
    matRef.current.uniforms.u_time.value = clock.elapsedTime
    // lerp doux pour l'influence — le shader respire
    mouse.current.lerp(target.current, 0.08)
    matRef.current.uniforms.u_mouse.value.copy(mouse.current)
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={{
          u_time: { value: 0 },
          u_mouse: { value: new Vector2(0, 0) },
          u_resolution: { value: new Vector2(1, 1) },
        }}
      />
    </mesh>
  )
}

export default function SynapseField() {
  return (
    <div className="absolute inset-0">
      <Canvas
        orthographic
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        className="!absolute inset-0"
      >
        <Plane />
      </Canvas>
    </div>
  )
}
