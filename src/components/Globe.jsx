import { useEffect, useRef } from "react";

const CONTINENT_POINTS = [
  [40, -100], [45, -110], [50, -95], [35, -105], [30, -90], [45, -75], [55, -100], [25, -100], [48, -122], [38, -95],
  [42, -85], [33, -85], [40, -80], [50, -110], [55, -75], [60, -100], [35, -115], [45, -95], [28, -95], [50, -85],
  [-10, -60], [-20, -60], [-5, -55], [-15, -70], [-25, -55], [-30, -65], [0, -65], [-35, -65], [-10, -75], [-20, -45],
  [50, 10], [55, 15], [45, 5], [52, 20], [48, 25], [58, 12], [40, 15], [45, 25], [55, 30], [50, -5],
  [10, 20], [0, 25], [-10, 25], [20, 10], [-20, 25], [5, 15], [-25, 30], [15, 30], [-5, 35], [25, 30],
  [0, 40], [-30, 22], [10, 40], [-15, 15],
  [50, 90], [40, 100], [30, 110], [55, 60], [45, 80], [35, 75], [25, 90], [20, 100], [60, 100], [35, 120],
  [50, 120], [30, 70], [40, 60], [45, 140], [25, 55], [10, 78],
  [-25, 135], [-30, 145], [-20, 130], [-35, 145], [-22, 150], [-28, 120],
];

function latLngToVec3(lat, lng, rotation) {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = ((lng + rotation) * Math.PI) / 180;
  return {
    x: Math.cos(latRad) * Math.sin(lngRad),
    y: Math.sin(latRad),
    z: Math.cos(latRad) * Math.cos(lngRad),
  };
}

function slerp(a, b, t) {
  const dot = Math.max(-1, Math.min(1, a.x * b.x + a.y * b.y + a.z * b.z));
  const theta = Math.acos(dot) * t;
  const relX = b.x - a.x * dot, relY = b.y - a.y * dot, relZ = b.z - a.z * dot;
  const relLen = Math.sqrt(relX * relX + relY * relY + relZ * relZ) || 1;
  const rx = relX / relLen, ry = relY / relLen, rz = relZ / relLen;
  return {
    x: a.x * Math.cos(theta) + rx * Math.sin(theta),
    y: a.y * Math.cos(theta) + ry * Math.sin(theta),
    z: a.z * Math.cos(theta) + rz * Math.sin(theta),
  };
}

export default function Globe() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const size = 420;
    canvas.width = size;
    canvas.height = size;
    const cx = size / 2, cy = size / 2;
    const radius = size * 0.4;

    // Precompute connection pairs (nearby points on the raw lat/lng grid)
    const raw = CONTINENT_POINTS.map(([lat, lng]) => ({ lat, lng, v: latLngToVec3(lat, lng, 0) }));
    const pairs = [];
    for (let i = 0; i < raw.length; i++) {
      for (let j = i + 1; j < raw.length; j++) {
        const dx = raw[i].lat - raw[j].lat;
        const dy = raw[i].lng - raw[j].lng;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 14) pairs.push([i, j]);
      }
    }

    let rotation = 0;
    let animationId;

    const drawGrid = (rot) => {
      ctx.strokeStyle = "rgba(0, 0, 0, 0.12)";
      ctx.lineWidth = 0.7;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let started = false;
        for (let lng = -180; lng <= 180; lng += 4) {
          const v = latLngToVec3(lat, lng, rot);
          if (v.z > -0.15) {
            const sx = cx + v.x * radius, sy = cy - v.y * radius;
            if (!started) { ctx.moveTo(sx, sy); started = true; } else ctx.lineTo(sx, sy);
          } else started = false;
        }
        ctx.stroke();
      }
      for (let lng = -180; lng < 180; lng += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -90; lat <= 90; lat += 4) {
          const v = latLngToVec3(lat, lng, rot);
          if (v.z > -0.15) {
            const sx = cx + v.x * radius, sy = cy - v.y * radius;
            if (!started) { ctx.moveTo(sx, sy); started = true; } else ctx.lineTo(sx, sy);
          } else started = false;
        }
        ctx.stroke();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      // White sphere fill
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.1, cx, cy, radius);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(1, "#e9f4f0");
      ctx.fillStyle = grad;
      ctx.fill();

      drawGrid(rotation);

      // Curved surface-hugging connection arcs
      ctx.strokeStyle = "rgba(0, 0, 0, 0.55)";
      ctx.lineWidth = 1;
      pairs.forEach(([i, j]) => {
        const a = latLngToVec3(raw[i].lat, raw[i].lng, rotation);
        const b = latLngToVec3(raw[j].lat, raw[j].lng, rotation);
        if (a.z < -0.1 && b.z < -0.1) return;

        ctx.beginPath();
        let started = false;
        const steps = 14;
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const v = slerp(a, b, t);
          if (v.z > -0.1) {
            const sx = cx + v.x * radius, sy = cy - v.y * radius;
            if (!started) { ctx.moveTo(sx, sy); started = true; } else ctx.lineTo(sx, sy);
          } else started = false;
        }
        ctx.stroke();
      });

      // Dots
      raw.forEach((p) => {
        const v = latLngToVec3(p.lat, p.lng, rotation);
        if (v.z < -0.1) return;
        const sx = cx + v.x * radius, sy = cy - v.y * radius;
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fill();
      });

      // Outer ring
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      rotation += 0.15;
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="globe-wrap">
      <canvas ref={canvasRef} className="globe-canvas" />
    </div>
  );
}