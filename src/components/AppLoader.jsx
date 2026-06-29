// import { useEffect, useRef } from "react";

// export default function AppLoader({ onComplete }) {
//   const wrapRef    = useRef(null);
//   const fillRef    = useRef(null);
//   const w1Ref      = useRef(null);
//   const w2Ref      = useRef(null);
//   const pctRef     = useRef(null);
//   const barRef     = useRef(null);
//   const svgRef     = useRef(null);
//   const svgWrapRef = useRef(null);
//   const ptRef      = useRef(null);
//   const progressRef= useRef(0);
//   const doneRef    = useRef(false);
//   const rafRef     = useRef(null);
//   const bubbleRefs = useRef([]);

//   useEffect(() => {
//     const fill = fillRef.current;
//     const svg  = svgRef.current;

//     /* ── set fill level ── */
//     function setFill(p) {
//       const y = 130 - (130 * p / 100);
//       fill.setAttribute("y", y);
//       w1Ref.current.setAttribute("transform", `translate(0,${y})`);
//       w2Ref.current.setAttribute("transform", `translate(0,${y})`);
//       if (pctRef.current) pctRef.current.textContent = Math.round(p) + "%";
//       if (barRef.current) barRef.current.style.width = p + "%";
//     }

//     /* ── bubbles ── */
//     function animBubble(el, delay) {
//       setTimeout(() => {
//         let cy = 120, op = 0;
//         el.setAttribute("cy", cy); el.setAttribute("opacity", "0");
//         const fadeIn = setInterval(() => {
//           op = Math.min(0.5, op + 0.05);
//           el.setAttribute("opacity", op);
//           if (op >= 0.5) { clearInterval(fadeIn); riseUp(); }
//         }, 30);
//         function riseUp() {
//           const speed = 0.8 + Math.random() * 0.6;
//           const iv = setInterval(() => {
//             if (doneRef.current) { clearInterval(iv); return; }
//             cy -= speed;
//             el.setAttribute("cy", cy);
//             const o = parseFloat(el.getAttribute("opacity")) - 0.008;
//             el.setAttribute("opacity", Math.max(0, o));
//             if (cy < 55 || o <= 0) {
//               clearInterval(iv);
//               setTimeout(() => animBubble(el, Math.random() * 2000), 300);
//             }
//           }, 30);
//         }
//       }, delay);
//     }
//     const bbls = bubbleRefs.current;
//     animBubble(bbls[0], 400);
//     animBubble(bbls[1], 1200);
//     animBubble(bbls[2], 2100);

//     /* ── floating particles ── */
//     const ptContainer = ptRef.current;
//     const ptInterval = setInterval(() => {
//       if (doneRef.current) return;
//       const p = document.createElement("div");
//       const sz = 2 + Math.random() * 4;
//       p.style.cssText = `
//         position:absolute;border-radius:50%;background:#1b9e9a;
//         width:${sz}px;height:${sz}px;
//         left:${20 + Math.random() * 60}%;bottom:${10 + Math.random() * 20}%;
//         opacity:0;animation:ptFloat ${2.5 + Math.random() * 2}s ease-out forwards;
//       `;
//       ptContainer.appendChild(p);
//       setTimeout(() => p.remove(), 4500);
//     }, 380);

//     /* ── auto progress ── */
//     function tick() {
//       if (doneRef.current) return;
//       const rem = 92 - progressRef.current;
//       progressRef.current = Math.min(92, progressRef.current + Math.max(rem * 0.006, 0.04));
//       setFill(progressRef.current);
//       rafRef.current = requestAnimationFrame(tick);
//     }
//     rafRef.current = requestAnimationFrame(tick);

//     /* ── finish at 3.5s ── */
//     const loadTimer = setTimeout(() => {
//       cancelAnimationFrame(rafRef.current);
//       const start = progressRef.current, t0 = performance.now(), dur = 1100;
//       function finishFill(now) {
//         const t = Math.min((now - t0) / dur, 1);
//         const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
//         progressRef.current = start + (100 - start) * ease;
//         setFill(progressRef.current);
//         t < 1 ? requestAnimationFrame(finishFill) : finish();
//       }
//       requestAnimationFrame(finishFill);
//     }, 3500);

//     /* ── tap burst ── */
//     function burstRipple() {
//       const ring = document.createElement("div");
//       ring.style.cssText = `
//         position:absolute;top:50%;left:50%;
//         width:80px;height:80px;border-radius:50%;
//         border:1.5px solid #1b9e9a;pointer-events:none;
//         animation:burst .55s ease-out forwards;
//       `;
//       svgWrapRef.current.appendChild(ring);
//       setTimeout(() => ring.remove(), 600);
//     }

//     function onTap() {
//       if (doneRef.current) return;
//       progressRef.current = Math.min(100, progressRef.current + 8);
//       setFill(progressRef.current);
//       burstRipple();
//       svg.style.transition = "transform .12s";
//       svg.style.transform = "scale(1.08)";
//       setTimeout(() => { svg.style.transform = "scale(1)"; svg.style.transition = "transform .25s"; }, 120);
//       if (progressRef.current >= 100) finish();
//     }

//     /* ── finish ── */
//     function finish() {
//       if (doneRef.current) return;
//       doneRef.current = true;
//       clearTimeout(loadTimer);
//       cancelAnimationFrame(rafRef.current);
//       clearInterval(ptInterval);
//       setFill(100);
//       svg.style.transition = "transform .4s, opacity .4s";
//       svg.style.transform = "scale(1.2)";
//       svg.style.opacity = "0";
//       setTimeout(() => {
//         const w = wrapRef.current;
//         if (w) { w.style.transition = "opacity .35s"; w.style.opacity = "0"; }
//         setTimeout(() => onComplete?.(), 350);
//       }, 420);
//     }

//     svgWrapRef.current.addEventListener("click", onTap);
//     svgWrapRef.current.addEventListener("keydown", e => {
//       if (e.key === "Enter" || e.key === " ") onTap();
//     });
//     setFill(0);

//     return () => {
//       clearTimeout(loadTimer);
//       clearInterval(ptInterval);
//       cancelAnimationFrame(rafRef.current);
//     };
//   }, [onComplete]);

//   return (
//     <>
//       <style>{`
//         @keyframes ptFloat {
//           0%   { transform: translateY(0) scale(1); opacity: .45 }
//           100% { transform: translateY(-180px) scale(.3); opacity: 0 }
//         }
//         @keyframes burst {
//           0%   { transform: translate(-50%,-50%) scale(0); opacity: .7 }
//           100% { transform: translate(-50%,-50%) scale(3.5); opacity: 0 }
//         }
//       `}</style>

//       <div ref={wrapRef} style={{
//         position:"fixed",inset:0,zIndex:9999,
//         background:"#f7fafa",display:"flex",flexDirection:"column",
//         alignItems:"center",justifyContent:"center",gap:0,overflow:"hidden",
//       }}>
//         {/* particles */}
//         <div ref={ptRef} style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}/>


//         {/* drop */}
//         <div ref={svgWrapRef} style={{position:"relative",cursor:"pointer",outline:"none"}}
//           role="button" aria-label="Loading, tap to speed up" tabIndex={0}>
//           <svg ref={svgRef} viewBox="0 0 100 130" width="120" height="156">
//             <defs>
//               <clipPath id="dropClip">
//                 <path d="M50,8 C50,8 14,68 14,90 A36,36 0 1 0 86,90 C86,68 50,8 50,8 Z"/>
//               </clipPath>
//             </defs>
//             <path d="M50,8 C50,8 14,68 14,90 A36,36 0 1 0 86,90 C86,68 50,8 50,8 Z"
//               fill="none" stroke="#1b9e9a" strokeWidth="1.6" opacity=".25"/>
//             <g clipPath="url(#dropClip)">
//               <rect x="0" y="0" width="100" height="130" fill="#e8f7f6"/>
//               <rect ref={fillRef} x="0" y="130" width="100" height="130" fill="#1b9e9a" opacity=".22"/>
//               <path ref={w1Ref}
//                 d="M-60,0 Q-45,-8 -30,0 T0,0 T30,0 T60,0 T90,0 T120,0 T150,0 V130 H-60 Z"
//                 fill="#1b9e9a" opacity=".5" transform="translate(0,130)">
//                 <animateTransform attributeName="transform" type="translate"
//                   from="0 130" to="-90 130" dur="2.8s" repeatCount="indefinite" additive="sum"/>
//               </path>
//               <path ref={w2Ref}
//                 d="M-60,0 Q-45,8 -30,0 T0,0 T30,0 T60,0 T90,0 T120,0 T150,0 V130 H-60 Z"
//                 fill="#1b9e9a" opacity=".75" transform="translate(0,130)">
//                 <animateTransform attributeName="transform" type="translate"
//                   from="0 130" to="90 130" dur="3.6s" repeatCount="indefinite" additive="sum"/>
//               </path>
//               {[{cx:38,r:2.2},{cx:58,r:1.5},{cx:46,r:1.8}].map((b,i)=>(
//                 <circle key={i} ref={el=>bubbleRefs.current[i]=el}
//                   cx={b.cx} cy="120" r={b.r} fill="white" opacity="0"/>
//               ))}
//             </g>
//             <path d="M50,8 C50,8 14,68 14,90 A36,36 0 1 0 86,90 C86,68 50,8 50,8 Z"
//               fill="none" stroke="#1b9e9a" strokeWidth="1.6" opacity=".75"/>
//             <ellipse cx="34" cy="52" rx="4" ry="7" fill="white" opacity=".15" transform="rotate(-18,34,52)"/>
//             <ellipse cx="40" cy="38" rx="2" ry="4" fill="white" opacity=".1" transform="rotate(-12,40,38)"/>
//           </svg>
//         </div>

//         <p style={{fontSize:10,color:"#7bbfbc",marginTop:10,letterSpacing:1,textTransform:"uppercase",opacity:.7}}>
//           tap to boost
//         </p>
//         <p ref={pctRef} style={{fontFamily:"monospace",fontSize:26,fontWeight:600,color:"#1b9e9a",marginTop:14}}>0%</p>
//         <div style={{width:140,height:3,background:"#d0eceb",borderRadius:2,overflow:"hidden",marginTop:10}}>
//           <div ref={barRef} style={{height:"100%",width:"0%",background:"#1b9e9a",borderRadius:2,transition:"width .15s linear"}}/>
//         </div>
//       </div>
//     </>
//   );
// }
import { useEffect, useRef } from "react";
import { Droplets } from "lucide-react";

export default function AppLoader({ onComplete }) {
  const wrapRef      = useRef(null);
  const iconBoxRef   = useRef(null);
  const iconRef      = useRef(null);
  const pctRef       = useRef(null);
  const fillCircleRef= useRef(null);   // ← circle stroke ref
  const hintRef      = useRef(null);
  const iconWrapRef  = useRef(null);
  const progressRef  = useRef(0);
  const doneRef      = useRef(false);
  const rafRef       = useRef(null);

  const RADIUS       = 45;
  const CIRCUMFERENCE= 2 * Math.PI * RADIUS;   // ≈ 282.7

  useEffect(() => {
    /* ── particles container ── */
    const ptContainer = document.createElement("div");
    Object.assign(ptContainer.style, {
      position:"absolute", inset:"0", pointerEvents:"none", overflow:"hidden",
    });
    wrapRef.current?.appendChild(ptContainer);

    /* ── spawn particles ── */
    const ptTimer = setInterval(() => {
      if (doneRef.current) return;
      const p = document.createElement("div");
      const sz  = 2 + Math.random() * 5;
      const dur = 2 + Math.random() * 2;
      Object.assign(p.style, {
        position:"absolute", borderRadius:"50%", background:"#1b9e9a",
        width:`${sz}px`, height:`${sz}px`,
        left:`${25 + Math.random() * 50}%`,
        bottom:`${5 + Math.random() * 30}%`,
        opacity:"0",
        animation:`ptFloat ${dur}s ease-out forwards`,
      });
      ptContainer.appendChild(p);
      setTimeout(() => p.remove(), dur * 1000 + 100);
    }, 350);

    /* ── set progress ── */
    function setProgress(p) {
      const offset = CIRCUMFERENCE * (1 - p / 100);
      if (fillCircleRef.current)
        fillCircleRef.current.style.strokeDashoffset = offset;
      if (pctRef.current)
        pctRef.current.textContent = Math.round(p) + "%";
    }

    /* ── auto tick ── */
    function tick() {
      if (doneRef.current) return;
      const rem = 92 - progressRef.current;
      progressRef.current = Math.min(92, progressRef.current + Math.max(rem * 0.006, 0.04));
      setProgress(progressRef.current);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    /* ── burst ring on tap ── */
    function burstRing() {
      const r = document.createElement("div");
      Object.assign(r.style, {
        position:"absolute", top:"50%", left:"50%",
        width:"80px", height:"80px", borderRadius:"50%",
        border:"1.5px solid #1b9e9a", pointerEvents:"none",
        animation:"burst .5s ease-out forwards",
      });
      iconWrapRef.current?.appendChild(r);
      setTimeout(() => r.remove(), 550);
    }

    /* ── finish ── */
    function finish() {
      if (doneRef.current) return;
      doneRef.current = true;
      clearTimeout(loadTimer);
      cancelAnimationFrame(rafRef.current);
      clearInterval(ptTimer);
      setProgress(100);
      if (hintRef.current) hintRef.current.style.opacity = "0";

      const icon = iconRef.current;
      if (icon) {
        icon.style.transition = "transform .25s, opacity .25s";
        icon.style.transform  = "scale(1.3)";
        icon.style.opacity    = "0";
      }
      setTimeout(() => {
        const box = iconBoxRef.current;
        if (box) {
          box.style.transition = "transform .3s, opacity .3s";
          box.style.transform  = "scale(0)";
          box.style.opacity    = "0";
        }
      }, 200);
      setTimeout(() => {
        const w = wrapRef.current;
        if (w) { w.style.transition = "opacity .4s"; w.style.opacity = "0"; }
        setTimeout(() => onComplete?.(), 400);
      }, 620);
    }

    /* ── auto complete at 3s ── */
    const loadTimer = setTimeout(() => {
      cancelAnimationFrame(rafRef.current);
      const start = progressRef.current, t0 = performance.now(), dur = 1000;
      function finishFill(now) {
        const t = Math.min((now - t0) / dur, 1);
        const e = t < .5 ? 2*t*t : -1+(4-2*t)*t;
        progressRef.current = start + (100 - start) * e;
        setProgress(progressRef.current);
        t < 1 ? requestAnimationFrame(finishFill) : finish();
      }
      requestAnimationFrame(finishFill);
    }, 3000);

    /* ── tap to boost ── */
    function onTap() {
      if (doneRef.current) return;
      progressRef.current = Math.min(100, progressRef.current + 10);
      setProgress(progressRef.current);
      burstRing();
      const icon = iconRef.current;
      if (icon) {
        icon.style.transition = "transform .1s";
        icon.style.transform  = "scale(1.25)";
        setTimeout(() => {
          icon.style.transform  = "scale(1)";
          icon.style.transition = "transform .2s";
        }, 110);
      }
      if (progressRef.current >= 100) finish();
    }

    const el = iconWrapRef.current;
    el?.addEventListener("click", onTap);
    el?.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") onTap(); });
    setProgress(0);

    return () => {
      clearTimeout(loadTimer);
      clearInterval(ptTimer);
      cancelAnimationFrame(rafRef.current);
      el?.removeEventListener("click", onTap);
    };
  }, [onComplete]);

  return (
    <>
      <style>{`
        @keyframes ptFloat {
          0%   { transform: translateY(0) scale(1); opacity: .5 }
          100% { transform: translateY(-160px) scale(.2); opacity: 0 }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.1); }
        }
        @keyframes ringPop {
          0%   { transform: scale(.6); opacity: .6 }
          100% { transform: scale(2.2); opacity: 0 }
        }
        @keyframes burst {
          0%   { transform: translate(-50%,-50%) scale(0); opacity: .6 }
          100% { transform: translate(-50%,-50%) scale(3.2); opacity: 0 }
        }
      `}</style>

      <div ref={wrapRef} style={{
        position:"fixed", inset:0, zIndex:9999,
        background:"#f7fafa",
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        overflow:"hidden",
      }}>

        {/* icon + circle progress ring */}
        <div ref={iconWrapRef}
          style={{ position:"relative", width:110, height:110,
            display:"flex", alignItems:"center", justifyContent:"center",
            cursor:"pointer", outline:"none" }}
          role="button" tabIndex={0} aria-label="Loading, tap to speed up"
        >
          {/* SVG circle progress — rotated so it starts at top */}
          <svg viewBox="0 0 110 110"
            style={{ position:"absolute", inset:0, width:110, height:110, transform:"rotate(-90deg)" }}>
            {/* track (background ring) */}
            <circle cx="55" cy="55" r={RADIUS}
              fill="none" stroke="#d0eceb" strokeWidth="3"/>
            {/* fill ring */}
            <circle ref={fillCircleRef} cx="55" cy="55" r={RADIUS}
              fill="none" stroke="#1b9e9a" strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE}
              style={{ transition:"stroke-dashoffset .12s linear" }}
            />
          </svg>

          {/* pulsing ambient rings */}
          {[0, 0.9].map((delay, i) => (
            <div key={i} style={{
              position:"absolute", inset:0, borderRadius:"50%",
              border:"1.5px solid #1b9e9a",
              animation:`ringPop 2s ease-out ${delay}s infinite`,
            }}/>
          ))}

          {/* icon circle */}
          <div ref={iconBoxRef} style={{
            width:72, height:72, borderRadius:"50%",
            background:"#e4f6f5",
            display:"flex", alignItems:"center", justifyContent:"center",
            animation:"pulse 2s ease-in-out infinite",
            position:"relative", zIndex:1,
          }}>
            <div ref={iconRef}>
              <Droplets size={30} color="#1b9e9a" />
            </div>
          </div>
        </div>


      </div>
    </>
  );
}