import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * WaveAnimation
 * Renders an image (e.g. your water-splash PNG) on a displaced plane
 * to create a real 3D wave — vertices move in Z over time and the
 * lighting reacts to that motion (not just a CSS transform trick).
 *
 * Usage:
 *   <WaveAnimation
 *     imageUrl="/assets/water-wave.png"
 *     fullBleed
 *   />
 *
 * Props:
 *   imageUrl    - required, the wave/splash image
 *   height      - any CSS height value. Default scales fluidly with viewport width.
 *   amplitude   - wave height (0.05 subtle -> 0.3 dramatic)
 *   frequency   - number of wave cycles visible across the width (responsive by design)
 *   speed       - animation speed
 *   mouseTilt   - subtle parallax tilt, auto-disabled on touch devices
 *   fullBleed   - true = breaks out of a centered/padded parent to span the full viewport width
 */
export default function WaveAnimation({
  imageUrl,
  height = "clamp(220px, 32vw, 480px)",
  amplitude = 0.18,
  frequency = 1.4,
  speed = 1,
  mouseTilt = true,
  fullBleed = false,
  className = "",
  style = {},
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let heightPx = container.clientHeight;
    if (width === 0 || heightPx === 0) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const supportsHoverTilt =
      mouseTilt &&
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(pointer: fine)").matches;

    // ---- Scene / camera / renderer ----
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const isMobile = width < 640;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(width, heightPx);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    // ---- Texture ----
    // TextureLoader.load() returns the texture synchronously and fires the
    // onLoad callback (with that same texture) once the image has decoded.
    let imageAspect = null;
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imageUrl, (loadedTexture) => {
      const img = loadedTexture.image;
      if (img && img.width) {
        imageAspect = img.width / img.height;
        buildMesh();
      }
    });
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;

    // ---- Shader material ----
    // Wave height is built from layered sine waves in UV space (0..1) rather
    // than world-space X/Y. That's what makes `frequency` look identical on a
    // narrow phone screen and a wide desktop hero — the wave count doesn't
    // stretch or compress with aspect ratio.
    // A heightmap-style normal is derived via finite differences and used for
    // simple diffuse + specular shading, plus a tiny refraction-like UV
    // offset on the texture sample — this is what reads as "real water"
    // instead of a flat image bobbing up and down.
    const vertexShader = `
      uniform float uTime;
      uniform float uAmplitude;
      uniform float uFrequency;
      uniform float uSpeed;

      varying vec2 vUv;
      varying float vWave;
      varying vec3 vNormal;

      float waveHeight(vec2 uv, float time) {
        float angle = uv.x * 6.2831853 * uFrequency;
        float w1 = sin(angle + time * uSpeed) * uAmplitude;
        float w2 = sin(angle * 2.3 + time * uSpeed * 1.6) * uAmplitude * 0.45;
        float w3 = cos(uv.y * 6.2831853 * uFrequency * 0.6 - time * uSpeed * 0.8) * uAmplitude * 0.3;
        float w4 = sin(angle * 5.0 + time * uSpeed * 2.2) * uAmplitude * 0.12; // fine choppy ripple
        return w1 + w2 + w3 + w4;
      }

      void main() {
        vUv = uv;
        vec3 pos = position;

        float eps = 0.01;
        float h  = waveHeight(uv, uTime);
        float hX = waveHeight(uv + vec2(eps, 0.0), uTime);
        float hY = waveHeight(uv + vec2(0.0, eps), uTime);

        pos.z += h;
        vWave = h;
        vNormal = normalize(vec3(-(hX - h) * 28.0, -(hY - h) * 28.0, 1.0));

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D uTexture;
      varying vec2 vUv;
      varying float vWave;
      varying vec3 vNormal;

      void main() {
        vec2 distortedUv = vUv + vNormal.xy * 0.015; // subtle refraction shimmer
        vec4 texColor = texture2D(uTexture, distortedUv);

        vec3 lightDir = normalize(vec3(0.35, 0.55, 0.75));
        float diffuse = dot(vNormal, lightDir) * 0.5 + 0.5;
        float specular = pow(max(diffuse, 0.0), 28.0);

        vec3 shaded = texColor.rgb * mix(0.82, 1.18, diffuse) + specular * 0.35;
        gl_FragColor = vec4(shaded, texColor.a);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture },
        uAmplitude: { value: amplitude },
        uFrequency: { value: frequency },
        uSpeed: { value: prefersReducedMotion ? 0 : speed },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    let geometry = null;
    let mesh = null;

    // Plane size matches the camera's view at z=0 so the image always fills the box.
    const PLANE_DEPTH_Z = 5; // distance from camera, matches camera.position.z
    const getVisiblePlaneSize = () => {
      const vFov = (camera.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(vFov / 2) * PLANE_DEPTH_Z;
      const visibleWidth = visibleHeight * camera.aspect;
      return { w: visibleWidth, h: visibleHeight };
    };

    // Fewer segments on small screens = same visual smoothness, much cheaper to animate.
    const getSegmentCounts = (w) => {
      if (w < 640) return { x: 100, y: 40 };
      if (w < 1024) return { x: 160, y: 64 };
      return { x: 220, y: 90 };
    };

    // object-fit: cover style math — same idea as cropping a background-image,
    // applied to the texture's repeat/offset so the wave never looks stretched
    // on any screen width.
    const applyCoverUV = (planeW, planeH) => {
      if (!imageAspect) return;
      const planeAspect = planeW / planeH;
      if (imageAspect > planeAspect) {
        texture.repeat.set(planeAspect / imageAspect, 1);
        texture.offset.set((1 - texture.repeat.x) / 2, 0);
      } else {
        texture.repeat.set(1, imageAspect / planeAspect);
        texture.offset.set(0, (1 - texture.repeat.y) / 2);
      }
    };

    const buildMesh = () => {
      if (mesh) {
        scene.remove(mesh);
        geometry.dispose();
      }
      const { w, h } = getVisiblePlaneSize();
      const { x: segX, y: segY } = getSegmentCounts(width);
      geometry = new THREE.PlaneGeometry(w, h, segX, segY);
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      applyCoverUV(w, h);
    };

    // build an initial mesh immediately so something renders before the image resolves
    buildMesh();

    // ---- Mouse parallax tilt (desktop/fine-pointer only — avoids fighting touch scroll) ----
    const targetRotation = { x: 0, y: 0 };
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotation.y = nx * 0.15;
      targetRotation.x = -ny * 0.1;
    };
    if (supportsHoverTilt) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    // ---- Animation loop ----
    const clock = new THREE.Clock();
    let frameId;
    const animate = () => {
      material.uniforms.uTime.value = clock.getElapsedTime();

      if (supportsHoverTilt && mesh) {
        mesh.rotation.x += (targetRotation.x - mesh.rotation.x) * 0.05;
        mesh.rotation.y += (targetRotation.y - mesh.rotation.y) * 0.05;
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // ---- Resize handling (covers orientation change, devtools, breakpoints, etc.) ----
    const resizeObserver = new ResizeObserver(() => {
      width = container.clientWidth;
      heightPx = container.clientHeight;
      if (width === 0 || heightPx === 0) return;

      camera.aspect = width / heightPx;
      camera.updateProjectionMatrix();
      renderer.setSize(width, heightPx);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 640 ? 1.5 : 2));
      buildMesh();
    });
    resizeObserver.observe(container);

    // ---- Cleanup ----
    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      if (supportsHoverTilt) container.removeEventListener("mousemove", handleMouseMove);
      if (geometry) geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, amplitude, frequency, speed, mouseTilt]);

  const wrapperStyle = fullBleed
    ? {
        width: "100vw",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
        overflow: "hidden",
        height,
        background: "#F6FAFF"
      }
    : { width: "100%", overflow: "hidden", height };

  return (
    <div ref={containerRef} className={className} style={{ ...wrapperStyle, ...style }} />
  );
}