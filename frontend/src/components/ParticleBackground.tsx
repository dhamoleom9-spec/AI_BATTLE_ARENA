import React, { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  isBattling?: boolean;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ isBattling = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particleCount = isBattling ? 80 : 50;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * (isBattling ? 1.5 : 0.6),
      vy: (Math.random() - 0.5) * (isBattling ? 1.5 : 0.6),
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '#00f0ff' : '#ff007f',
      alpha: Math.random() * 0.6 + 0.2,
    }));

    let pulse = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      pulse += 0.02;

      // Draw faint grid overlay
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
      ctx.lineWidth = 1;

      // Update and draw particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha + (isBattling ? Math.sin(pulse + idx) * 0.2 : 0);
        ctx.fill();

        // Connect nearby particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = isBattling ? 140 : 100;

          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / maxDist) * 0.15;
            ctx.stroke();
          }
        }
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isBattling]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
      style={{ opacity: isBattling ? 0.85 : 0.5 }}
    />
  );
};
