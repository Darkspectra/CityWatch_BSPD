import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";

// A drag-to-spin dot globe (cobe: https://github.com/shuding/cobe).
//
// IMPORTANT: the installed cobe@2.0.1 build exposes only `update(state)` /
// `destroy()` — there is no built-in `onRender` animation loop (that's a
// convenience some wrapper components add on top, not part of this
// version's actual API). Passing `onRender` as an option is silently
// ignored, the globe draws exactly one static frame at creation time, and
// never rotates again — which is exactly why it looked frozen/inert. The
// fix is to drive our own requestAnimationFrame loop and call
// globe.update({...}) every frame ourselves.
//
// `size` is a max-width in px — the globe itself is fully responsive and
// fills its container up to that cap.
export default function Globe({ size = 480 }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);
  const rotationRef = useRef(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!wrapRef.current) return undefined;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width;
      if (w) setWidth(w);
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!width || !canvasRef.current) return undefined;

    let phi = 0;
    let rafId = null;
    let destroyed = false;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.38, 0.46, 0.42],
      markerColor: [0.96, 0.75, 0.29],
      glowColor: [0.13, 0.55, 0.45],
      markers: [
        { location: [23.8103, 90.4125], size: 0.09 }, // Dhaka
        { location: [51.5072, -0.1276], size: 0.05 }, // London
        { location: [35.6762, 139.6503], size: 0.05 }, // Tokyo
        { location: [-33.8688, 151.2093], size: 0.05 }, // Sydney
        { location: [40.7128, -74.006], size: 0.05 }, // New York
        { location: [1.3521, 103.8198], size: 0.05 }, // Singapore
      ],
    });

    const frame = () => {
      if (destroyed) return;
      if (!pointerInteracting.current) {
        phi += 0.0045;
      }
      globe.update({
        phi: phi + rotationRef.current,
        width: width * 2,
        height: width * 2,
      });
      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);

    requestAnimationFrame(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1";
    });

    return () => {
      destroyed = true;
      if (rafId) cancelAnimationFrame(rafId);
      globe.destroy();
    };
  }, [width]);

  const releaseCapture = (e) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // no-op — pointer was never captured
    }
  };

  return (
    <div
      ref={wrapRef}
      className="globe-wrap"
      style={{ width: "100%", maxWidth: size, aspectRatio: "1", margin: "0 auto", position: "relative" }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          e.currentTarget.style.cursor = "grabbing";
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerUp={(e) => {
          pointerInteracting.current = null;
          e.currentTarget.style.cursor = "grab";
          releaseCapture(e);
        }}
        onPointerCancel={(e) => {
          pointerInteracting.current = null;
          e.currentTarget.style.cursor = "grab";
          releaseCapture(e);
        }}
        onPointerMove={(e) => {
          if (pointerInteracting.current === null) return;
          const delta = e.clientX - pointerInteracting.current;
          pointerInteractionMovement.current = delta;
          rotationRef.current = delta / 200;
        }}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          contain: "layout paint size",
          opacity: 0,
          transition: "opacity 1s ease",
          touchAction: "none",
        }}
      />
    </div>
  );
}
