import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, Trophy, CheckCircle2 } from 'lucide-react';

interface ConfettiDetail {
  taskTitle?: string;
  subjectCode?: string;
  milestoneTitle?: string;
  isExamAutoComplete?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shape: 'rect' | 'circle' | 'ribbon';
  opacity: number;
  wobble: number;
  wobbleSpeed: number;
}

const CONFETTI_COLORS = [
  '#10b981', // Emerald
  '#f59e0b', // Amber/Gold
  '#3b82f6', // Blue
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#f43f5e', // Rose
  '#eab308', // Yellow
];

export const PENDING_DASHBOARD_CONFETTI_KEY = 'practca_pending_dashboard_confetti';

export const triggerFinalRevisionConfetti = (detail: ConfettiDetail = {}) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      PENDING_DASHBOARD_CONFETTI_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        ...detail,
      })
    );
  } catch {
    // ignore storage errors
  }
  window.dispatchEvent(new CustomEvent('practca_final_revision_confetti', { detail }));
};

export const ConfettiOverlay: React.FC<{ isDashboardView?: boolean }> = ({ isDashboardView = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [bannerInfo, setBannerInfo] = useState<ConfettiDetail | null>(null);
  const bannerTimeoutRef = useRef<number | null>(null);

  const launchConfetti = useCallback((detail: ConfettiDetail = {}) => {
    setBannerInfo(detail);
    if (bannerTimeoutRef.current) {
      window.clearTimeout(bannerTimeoutRef.current);
    }
    bannerTimeoutRef.current = window.setTimeout(() => {
      setBannerInfo(null);
    }, 4500);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const totalParticles = 150;

    // Dual cannon burst from left & right + top center shower
    for (let i = 0; i < totalParticles; i++) {
      const originType = i % 3;
      let startX = canvas.width * 0.5;
      let startY = canvas.height * 0.25;
      let angle = (Math.random() * Math.PI * 2);
      let speed = 5 + Math.random() * 11;

      if (originType === 0) {
        // Left cannon
        startX = canvas.width * 0.12;
        startY = canvas.height * 0.65;
        angle = -Math.PI / 3 + (Math.random() - 0.5) * 0.65;
        speed = 11 + Math.random() * 13;
      } else if (originType === 1) {
        // Right cannon
        startX = canvas.width * 0.88;
        startY = canvas.height * 0.65;
        angle = (-2 * Math.PI) / 3 + (Math.random() - 0.5) * 0.65;
        speed = 11 + Math.random() * 13;
      } else {
        // Center top burst
        startX = canvas.width * (0.25 + Math.random() * 0.5);
        startY = canvas.height * 0.18;
        angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI;
        speed = 4 + Math.random() * 10;
      }

      const shapes: Array<'rect' | 'circle' | 'ribbon'> = ['rect', 'circle', 'ribbon'];
      particles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 6 + Math.random() * 6,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 14,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        opacity: 1,
        wobble: Math.random() * 10,
        wobbleSpeed: 0.05 + Math.random() * 0.08,
      });
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const startTime = performance.now();
    const duration = 4500;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let activeCount = 0;
      for (const p of particles) {
        p.x += p.vx + Math.sin(p.wobble) * 1.2;
        p.y += p.vy;
        p.vy += 0.28; // Gravity
        p.vx *= 0.985; // Air drag
        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;

        if (elapsed > duration * 0.65) {
          p.opacity = Math.max(0, 1 - (elapsed - duration * 0.65) / (duration * 0.35));
        }

        if (p.opacity > 0.02 && p.y < canvas.height + 40) {
          activeCount++;
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;

          if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.shape === 'ribbon') {
            ctx.fillRect(-p.size * 0.9, -p.size * 0.25, p.size * 1.8, p.size * 0.5);
          } else {
            ctx.fillRect(-p.size * 0.5, -p.size * 0.5, p.size, p.size * 0.7);
          }
          ctx.restore();
        }
      }

      if (elapsed < duration && activeCount > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const handleConfettiEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ConfettiDetail>;
      const detail = customEvent.detail || {};
      if (isDashboardView) {
        try {
          localStorage.removeItem(PENDING_DASHBOARD_CONFETTI_KEY);
        } catch {
          // ignore
        }
      }
      launchConfetti(detail);
    };

    window.addEventListener('practca_final_revision_confetti', handleConfettiEvent);

    // If the student completed a Final Revision task in another tab/tool and then opened the Dashboard,
    // replay the celebratory confetti on the Dashboard within a 60-second window.
    if (isDashboardView) {
      try {
        const raw = localStorage.getItem(PENDING_DASHBOARD_CONFETTI_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          localStorage.removeItem(PENDING_DASHBOARD_CONFETTI_KEY);
          if (parsed && typeof parsed.timestamp === 'number' && Date.now() - parsed.timestamp < 60000) {
            setTimeout(() => {
              launchConfetti(parsed);
            }, 180);
          }
        }
      } catch {
        // ignore
      }
    }

    return () => {
      window.removeEventListener('practca_final_revision_confetti', handleConfettiEvent);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (bannerTimeoutRef.current) {
        window.clearTimeout(bannerTimeoutRef.current);
      }
    };
  }, [isDashboardView, launchConfetti]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9998]"
        style={{ width: '100vw', height: '100vh' }}
      />
      {bannerInfo && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900/95 dark:bg-slate-900/95 border border-emerald-500/40 shadow-2xl shadow-emerald-500/20 text-white backdrop-blur-md">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
              {bannerInfo.isExamAutoComplete ? <Trophy className="w-5 h-5 text-amber-400" /> : <Sparkles className="w-5 h-5 text-emerald-400" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {bannerInfo.isExamAutoComplete
                  ? 'Final Exam Milestone Completed'
                  : 'Final Revision Milestone Progress'}
              </div>
              <p className="text-xs font-bold text-slate-100 mt-0.5">
                {bannerInfo.subjectCode ? `[${bannerInfo.subjectCode}] ` : ''}
                {bannerInfo.taskTitle || bannerInfo.milestoneTitle || 'Final Revision task marked as completed!'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
