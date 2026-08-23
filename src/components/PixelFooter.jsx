import { useEffect, useRef, useState } from "react";

export default function PixelFooter() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.4 }
    );
    if (wrapRef.current) observer.observe(wrapRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = 640, H = 160;
    canvas.width = W;
    canvas.height = H;

    // Render target text offscreen to sample pixel positions
    const off = document.createElement("canvas");
    off.width = W; off.height = H;
    const offCtx = off.getContext("2d");
    offCtx.fillStyle = "#fff";
    offCtx.font = "800 64px Inter, sans-serif";
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    offCtx.fillText("BSPD — 2026", W / 2, H / 2);
    const imageData = offCtx.getImageData(0, 0, W, H).data;

    const targets = [];
    const step = 4;
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        const alpha = imageData[(y * W + x) * 4 + 3];
        if (alpha > 128) targets.push({ tx: x, ty: y });
      }
    }

    const particles = targets.map((t) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      tx: t.tx,
      ty: t.ty,
    }));

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    let animationId;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      particles.forEach((p) => {
        const targetX = visible ? p.tx : Math.random() > 0.995 ? Math.random() * W : p.x;
        const targetY = visible ? p.ty : p.y;

        p.x += (targetX - p.x) * 0.08;
        p.y += (targetY - p.y) * 0.08;

        const dx = p.x - mx, dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 40) {
          const force = (40 - dist) / 40;
          p.x += (dx / dist) * force * 6;
          p.y += (dy / dist) * force * 6;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34, 211, 168, 0.85)";
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [visible]);

  return (
    <div ref={wrapRef} className="pixel-footer-wrap">
      <canvas ref={canvasRef} className="pixel-footer-canvas" />
    </div>
  );
}