"use client";

import { forwardRef, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshPhysicalMaterial } from "three";
import * as THREE from "three";

/* -------------------------------------------------------------------------- */
/*  Simplex noise GLSL (3D) — from Stefan Gustavson / Ian McEwan             */
/* -------------------------------------------------------------------------- */

const SNOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g  = step(x0.yzx, x0.xyz);
  vec3 l  = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j  = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x  = x_ * ns.x + ns.yyyy;
  vec4 y  = y_ * ns.x + ns.yyyy;
  vec4 h  = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

/* -------------------------------------------------------------------------- */
/*  FluidMaterialImpl — MeshPhysicalMaterial + wobble + pull stretch          */
/* -------------------------------------------------------------------------- */

class FluidMaterialImpl extends MeshPhysicalMaterial {
  _time = { value: 0 };
  _distort = { value: 0.3 };
  _radius = { value: 1 };
  _localPullPoint = { value: new THREE.Vector3(0, 0, 0) };
  _pullStrength = { value: 0 };
  _pullRadius = { value: 0.5 };

  constructor(params: ConstructorParameters<typeof MeshPhysicalMaterial>[0] = {}) {
    super(params);
    this.setValues(params);
  }

  get time() { return this._time.value; }
  set time(v: number) { this._time.value = v; }

  get distort() { return this._distort.value; }
  set distort(v: number) { this._distort.value = v; }

  get radius() { return this._radius.value; }
  set radius(v: number) { this._radius.value = v; }

  get localPullPoint() { return this._localPullPoint.value; }
  set localPullPoint(v: THREE.Vector3) { this._localPullPoint.value = v; }

  get pullStrength() { return this._pullStrength.value; }
  set pullStrength(v: number) { this._pullStrength.value = v; }

  get pullRadius() { return this._pullRadius.value; }
  set pullRadius(v: number) { this._pullRadius.value = v; }

  onBeforeCompile(shader: THREE.WebGLProgramParametersWithUniforms) {
    shader.uniforms.time = this._time;
    shader.uniforms.distort = this._distort;
    shader.uniforms.radius = this._radius;
    shader.uniforms.localPullPoint = this._localPullPoint;
    shader.uniforms.pullStrength = this._pullStrength;
    shader.uniforms.pullRadius = this._pullRadius;

    // Prepend uniforms + snoise to vertex shader
    shader.vertexShader = `
      uniform float time;
      uniform float distort;
      uniform float radius;
      uniform vec3 localPullPoint;
      uniform float pullStrength;
      uniform float pullRadius;
      ${SNOISE_GLSL}
      ${shader.vertexShader}
    `;

    // Replace #include <begin_vertex> with our custom displacement
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      /* glsl */ `
        // 1. Simplex noise wobble (organic idle animation)
        float updateTime = time / 50.0;
        float noise = snoise(vec3(position / 2.0 + updateTime * 5.0));
        vec3 transformed = vec3(position * (noise * pow(distort, 2.0) + radius));

        // 2. Pull toward cursor (non-Newtonian stretch)
        if (pullStrength > 0.001) {
          vec3 toPull = localPullPoint - transformed;
          float dist = length(toPull);
          // Smooth falloff — narrow influence creates taffy neck
          float influence = smoothstep(pullRadius, pullRadius * 0.05, dist) * pullStrength;
          // Prevent division by zero
          if (dist > 0.001) {
            transformed += normalize(toPull) * influence;
          }
        }
      `
    );
  }
}

/* -------------------------------------------------------------------------- */
/*  React wrapper                                                             */
/* -------------------------------------------------------------------------- */

interface FluidMaterialProps {
  speed?: number;
  distort?: number;
  radius?: number;
  color?: THREE.ColorRepresentation;
  emissive?: THREE.ColorRepresentation;
  metalness?: number;
  roughness?: number;
  emissiveIntensity?: number;
  envMapIntensity?: number;
  toneMapped?: boolean;
}

const FluidMaterial = forwardRef<FluidMaterialImpl, FluidMaterialProps>(
  function FluidMaterial(
    { speed = 1.2, distort = 0.3, radius = 1, ...props },
    ref
  ) {
    // Stable material instance
    const material = useMemo(() => new FluidMaterialImpl(), []);

    // Mutable ref for useFrame to write to (linter won't flag ref.current in callbacks)
    const matRef = useRef(material);

    useFrame((state) => {
      const m = matRef.current;
      m.time = state.clock.getElapsedTime() * speed;
      m.distort = distort;
      m.radius = radius;
    });

    return (
      <primitive
        ref={ref}
        object={material}
        attach="material"
        {...props}
      />
    );
  }
);

FluidMaterial.displayName = "FluidMaterial";

export { FluidMaterialImpl };
export default FluidMaterial;
