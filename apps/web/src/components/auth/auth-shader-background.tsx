"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform vec3 u_colorCore;
  uniform vec3 u_colorFringe;
  uniform vec3 u_colorWarm;
  uniform vec3 u_colorHot;
  uniform vec3 u_colorEmber;
  uniform float u_aspect;
  varying vec2 vUv;

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(in vec2 p) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    return dot(n, vec3(70.0));
  }

  float sdArc(vec2 p, vec2 center, float radius, float width, float warp, float timeOffset) {
    p.y += sin(p.x * 3.8 + u_time * 0.58 + timeOffset) * warp;
    p.x += noise(p * 2.5 + u_time * 0.3 + timeOffset) * (warp * 0.38);
    float d = length(p - center) - radius;
    return abs(d) - width;
  }

  float arcGlow(float distField, float sharpness) {
    return exp(-max(distField, 0.0) * sharpness);
  }

  float arcShimmer(vec2 p, vec2 center, float timeOffset, float speed) {
    float angle = atan(p.y - center.y, p.x - center.x);
    float flow = sin(angle * 7.0 - u_time * speed + timeOffset);
    float ripple = sin(angle * 11.0 + u_time * (speed * 0.65) - timeOffset * 1.1);
    return 0.66 + (flow * 0.2 + ripple * 0.12);
  }

  float pulse(float speed, float offset) {
    float wave = sin(u_time * speed + offset) * 0.5 + 0.5;
    return 0.64 + wave * 0.36;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 st = uv;
    st.x *= u_aspect;

    vec2 parallax = (u_mouse - 0.5) * 0.16;
    st += parallax;

    float isPortrait = step(u_aspect, 0.85);
    vec2 centerDesktop = vec2(0.24 + parallax.x * 0.22, 0.5 + parallax.y * 0.18);
    vec2 centerMobile = vec2(u_aspect * 0.5 + parallax.x * 0.06, 0.34 + parallax.y * 0.1);
    vec2 center = mix(centerDesktop, centerMobile, isPortrait);
    float radiusScale = mix(1.0, 0.58, isPortrait);

    float d1 = sdArc(st, center, 0.74 * radiusScale, 0.0024 * mix(1.0, 1.15, isPortrait), 0.09, 0.0);
    float d2 = sdArc(st, center, 0.78 * radiusScale, 0.0055 * mix(1.0, 1.15, isPortrait), 0.11, 1.4);
    float d3 = sdArc(st, center + vec2(-0.03, 0.04) * radiusScale, 0.82 * radiusScale, 0.0038 * mix(1.0, 1.15, isPortrait), 0.13, 2.8);
    float d4 = sdArc(st, center + vec2(0.02, -0.03) * radiusScale, 0.68 * radiusScale, 0.0032 * mix(1.0, 1.15, isPortrait), 0.1, 4.2);
    float d5 = sdArc(st, center + vec2(-0.02, -0.05) * radiusScale, 0.86 * radiusScale, 0.0042 * mix(1.0, 1.15, isPortrait), 0.14, 5.6);

    float p1 = pulse(0.48, 0.0);
    float p2 = pulse(0.4, 1.8);
    float p3 = pulse(0.36, 3.2);
    float p4 = pulse(0.44, 4.6);
    float p5 = pulse(0.34, 6.0);

    float s1 = arcShimmer(st, center, 0.0, 0.95);
    float s2 = arcShimmer(st, center, 1.4, 0.82);
    float s3 = arcShimmer(st, center + vec2(-0.03, 0.04) * radiusScale, 2.8, 0.74);
    float s4 = arcShimmer(st, center + vec2(0.02, -0.03) * radiusScale, 4.2, 0.88);
    float s5 = arcShimmer(st, center + vec2(-0.02, -0.05) * radiusScale, 5.6, 0.78);

    float ambientCore = arcGlow(d1, 22.0) * 0.24 + arcGlow(d2, 18.0) * 0.18;
    float ambientFringe = arcGlow(d3, 20.0) * 0.16 + arcGlow(d4, 17.0) * 0.13;

    float coreGlow =
      arcGlow(d1, 62.0) * p1 * s1 +
      arcGlow(d4, 54.0) * p4 * s4 * 0.94;

    float fringeGlow =
      arcGlow(d2, 38.0) * p2 * s2 +
      arcGlow(d3, 36.0) * p3 * s3 * 0.95 +
      arcGlow(d5, 34.0) * p5 * s5 * 0.88;

    float lineIntensity = ambientCore + ambientFringe + coreGlow * 1.55 + fringeGlow * 1.35;
    vec3 lavaColor = mix(u_colorEmber, u_colorFringe, smoothstep(0.05, 0.42, lineIntensity));
    lavaColor = mix(lavaColor, u_colorCore, smoothstep(0.28, 0.72, lineIntensity));
    lavaColor = mix(lavaColor, u_colorHot, smoothstep(0.62, 1.05, coreGlow * s1));

    float washMask = mix(
      smoothstep(1.0, -0.05, st.x),
      smoothstep(1.15, 0.05, st.y),
      isPortrait
    );
    float wash = washMask * (0.18 + sin(u_time * 0.32) * 0.04);

    vec3 finalColor = vec3(0.0);
    finalColor += lavaColor * lineIntensity * 1.68;
    finalColor += u_colorWarm * wash * (0.22 + pulse(0.34, 2.0) * 0.1);

    finalColor = vec3(1.0) - exp(-finalColor * 1.95);

    float alpha = clamp(lineIntensity + wash * 0.36, 0.42, 1.0);
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export function AuthShaderBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      uniforms: {
        u_aspect: { value: window.innerWidth / window.innerHeight },
        u_colorCore: { value: new THREE.Color("#FF7A18") },
        u_colorEmber: { value: new THREE.Color("#C2410C") },
        u_colorFringe: { value: new THREE.Color("#EA580C") },
        u_colorHot: { value: new THREE.Color("#FFF0D4") },
        u_colorWarm: { value: new THREE.Color("#F97316") },
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
        u_resolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        u_time: { value: 0 },
      },
      vertexShader: VERTEX_SHADER,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const targetMouse = new THREE.Vector2(0.5, 0.5);
    const clock = new THREE.Clock();
    let frameId = 0;

    function setSize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      material.uniforms.u_resolution.value.set(width, height);
      material.uniforms.u_aspect.value = width / height;
    }

    function onMouseMove(event: MouseEvent) {
      targetMouse.x = event.clientX / window.innerWidth;
      targetMouse.y = 1 - event.clientY / window.innerHeight;
    }

    function animate() {
      frameId = window.requestAnimationFrame(animate);

      if (!reducedMotion) {
        material.uniforms.u_time.value = clock.getElapsedTime();
      }

      material.uniforms.u_mouse.value.lerp(targetMouse, 0.06);
      renderer.render(scene, camera);
    }

    setSize();
    window.addEventListener("resize", setSize);
    window.addEventListener("mousemove", onMouseMove);
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", setSize);
      window.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      material.dispose();
      mesh.geometry.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div aria-hidden className="auth-shader-bg" ref={containerRef}>
      <div className="auth-shader-vignette" />
    </div>
  );
}
