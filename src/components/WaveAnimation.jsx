import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function WaveAnimation({
  imageUrl,
  height      = "clamp(200px, 26vw, 380px)",
  amplitude   = 0.03,
  frequency   = 1.2,
  speed       = 0.5,
  mouseTilt   = true,
  fullBleed   = false,
  className   = "",
  style       = {},
  scrollScrub = 1.2,
  scrollStart = "top 60%",
  scrollEnd   = "top 50%",
}) {
  const sentinelRef = useRef(null);
  const canvasRef   = useRef(null);

  // ── GSAP ScrollTrigger: slow fade-in ────────────────────────────────────
// ── GSAP ScrollTrigger: slow fade-in ────────────────────────────────────
useEffect(() => {
  const sentinel = sentinelRef.current;   // ← use sentinelRef, NOT sectionRef
  const canvas = canvasRef.current;

  if (!sentinel || !canvas) return;

  gsap.set(canvas, {
    xPercent: -100,
    opacity: 0.8258,
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sentinel,          // ← sentinel, not sectionRef.current
      start: "center center",
      end: "+=1200",
      scrub: 3,
      pin: true,
      anticipatePin: 1,
    },
  });

  tl.to(canvas, {
    xPercent: 0,
    ease: "none",
  });

  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}, []);

  // ── Three.js renderer ────────────────────────────────────────────────────
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    let width    = container.clientWidth;
    let heightPx = container.clientHeight;
    if (width === 0 || heightPx === 0) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const supportsHoverTilt =
      mouseTilt &&
      typeof window !== "undefined" &&
      window.matchMedia?.("(pointer: fine)").matches;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 640 ? 1.5 : 2));
    renderer.setSize(width, heightPx);
    renderer.domElement.style.cssText = "display:block;width:100%;height:100%;";
    container.appendChild(renderer.domElement);

    let imageAspect = null;
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imageUrl, (t) => {
      const img = t.image;
      if (img?.width) {
        imageAspect = img.width / img.height;
        buildMesh();
      }
    });
    texture.colorSpace = THREE.SRGBColorSpace;
    // MirroredRepeat prevents edge-pixel bleeding when vUv goes slightly OOB
    texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;

    // ── Vertex shader ──────────────────────────────────────────────────────
    // Wave only displaces Z (depth) — no X/Y movement so UV never
    // wanders outside [0,1] in screen space. Edges stay clean.
    const vertexShader = /* glsl */`
      uniform float uTime;
      uniform float uAmplitude;
      uniform float uFrequency;
      uniform float uSpeed;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vec3 pos = position;

        float a  = uv.x * 6.2831853 * uFrequency;
        float w1 = sin(a       + uTime * uSpeed)       * uAmplitude;
        float w2 = sin(a * 2.1 + uTime * uSpeed * 1.4) * uAmplitude * 0.35;
        pos.z += w1 + w2;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    // ── Fragment shader ────────────────────────────────────────────────────
    // 100% passthrough — zero color math, zero tint, zero lighting.
    // Image renders exactly as your original file.
    const fragmentShader = /* glsl */`
      uniform sampler2D uTexture;
      varying vec2 vUv;

      void main() {
        gl_FragColor = texture2D(uTexture, vUv);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime:      { value: 0 },
        uTexture:   { value: texture },
        uAmplitude: { value: amplitude },
        uFrequency: { value: frequency },
        uSpeed:     { value: prefersReducedMotion ? 0 : speed },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    let geometry = null;
    let mesh     = null;
    const PLANE_Z = 5;

    const getVisiblePlaneSize = () => {
      const vFov = (camera.fov * Math.PI) / 180;
      const h    = 2 * Math.tan(vFov / 2) * PLANE_Z;
      return { w: h * camera.aspect, h };
    };

    const getSegmentCounts = (w) => {
      if (w < 640)  return { x: 80,  y: 32 };
      if (w < 1024) return { x: 140, y: 56 };
      return                { x: 200, y: 80 };
    };

    // Cover UV: fills the plane exactly, no stretching, no empty strips
   const applyCoverUV = (planeW, planeH) => {
  if (!imageAspect) return;
  const planeAspect = planeW / planeH;

  if (imageAspect > planeAspect) {
    // Image is wider than plane → crop sides, AND shift up to cut white bottom
    texture.repeat.set(planeAspect / imageAspect, 1);
    texture.offset.set((1 - texture.repeat.x) / 2, 0.55); // ← 0.55 shifts up, shows wave not white gap
  } else {
    texture.repeat.set(1, imageAspect / planeAspect);
    texture.offset.set(0, (1 - texture.repeat.y) / 2);
  }
  texture.needsUpdate = true;
};

    const buildMesh = () => {
      if (mesh) { scene.remove(mesh); geometry.dispose(); }
      const { w, h }         = getVisiblePlaneSize();
      const { x: sx, y: sy } = getSegmentCounts(width);
      // Make plane 2% larger than viewport in each direction so
      // wave displacement never reveals the background at the edges.
      geometry = new THREE.PlaneGeometry(w * 1.02, h * 1.02, sx, sy);
      mesh     = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      applyCoverUV(w * 1.02, h * 1.02);
    };

    buildMesh();

    // Mouse parallax tilt (desktop only)
    const targetRotation = { x: 0, y: 0 };
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      targetRotation.y =  ((e.clientX - rect.left) / rect.width  - 0.5) * 0.06;
      targetRotation.x = -((e.clientY - rect.top)  / rect.height - 0.5) * 0.04;
    };
    if (supportsHoverTilt) container.addEventListener("mousemove", handleMouseMove);

    const clock = new THREE.Clock();
    let frameId;
    const animate = () => {
      material.uniforms.uTime.value = clock.getElapsedTime();
      if (supportsHoverTilt && mesh) {
        mesh.rotation.x += (targetRotation.x - mesh.rotation.x) * 0.04;
        mesh.rotation.y += (targetRotation.y - mesh.rotation.y) * 0.04;
      }
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const resizeObserver = new ResizeObserver(() => {
      width    = container.clientWidth;
      heightPx = container.clientHeight;
      if (width === 0 || heightPx === 0) return;
      camera.aspect = width / heightPx;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 640 ? 1.5 : 2));
      renderer.setSize(width, heightPx);
      buildMesh();
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      if (supportsHoverTilt) container.removeEventListener("mousemove", handleMouseMove);
      if (geometry) geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, amplitude, frequency, speed, mouseTilt]);

  // ── Layout ───────────────────────────────────────────────────────────────
  const sentinelStyle = {
    position : "relative",
    overflow : "hidden",   // clips the 2% oversized plane — keeps layout clean
    height,
    ...(fullBleed
      ? { width: "100vw", left: "50%", transform: "translateX(-50%)" }
      : { width: "100%" }),
  };

  const canvasStyle = {
    position   : "absolute",
    inset      : 0,
    width      : "100%",
    height     : "100%",
    background : "transparent",  // transparent so your PNG bg shows through
    willChange : "opacity, transform",
  };

  return (
    <div ref={sentinelRef} style={sentinelStyle} className={className}>
      <div ref={canvasRef} style={{ ...canvasStyle, ...style }} />
    </div>
  );
}