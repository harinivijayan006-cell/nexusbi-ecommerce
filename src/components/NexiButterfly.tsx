import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Sparkles, ArrowRight, X, Bot, Search, Scale, Tag } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  life: number;
}

export const NexiButterfly: React.FC = () => {
  const {
    butterflyEnabled,
    reduceButterflyMotion,
    currentView,
    setCurrentView,
    setIsAiAssistantOpen,
    nexiSpeechMessage,
    setNexiSpeechMessage,
  } = useApp();

  // Position & movement refs for 60fps GPU animation
  const posRef = useRef({ x: window.innerWidth * 0.85, y: window.innerHeight * 0.7 });
  const targetRef = useRef({ x: window.innerWidth * 0.85, y: window.innerHeight * 0.7 });
  const velRef = useRef({ x: 0, y: 0 });
  const rotRef = useRef(0);
  const wingPhaseRef = useRef(0);
  const mousePosRef = useRef({ x: -1000, y: -1000, speed: 0 });
  const lastMousePosRef = useRef({ x: 0, y: 0, time: Date.now() });

  const [pos, setPos] = useState({ x: posRef.current.x, y: posRef.current.y });
  const [rotation, setRotation] = useState(0);
  const [wingSpeed, setWingSpeed] = useState(1);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  // Check user system preference
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Context-aware speech bubbles
  useEffect(() => {
    if (!butterflyEnabled) return;

    let timer: any;
    let message = '';

    if (nexiSpeechMessage) {
      message = nexiSpeechMessage;
    } else {
      switch (currentView) {
        case 'home':
          message = 'Welcome to Nexus BI! 🦋';
          break;
        case 'products':
          message = 'Searching millions of items... 🔎';
          break;
        case 'product-details':
          message = 'Comparing prices across stores! ⚡';
          break;
        case 'compare':
          message = 'Let us examine specs side-by-side! ⚖️';
          break;
        case 'deals':
          message = 'I found price drops up to 30%! 💰';
          break;
        case 'cart':
          message = 'Ready to order at best price? 🛒';
          break;
        case 'admin':
          message = 'Business Intelligence online! 📊';
          break;
        default:
          message = 'Need shopping advice? Ask AI! ✨';
      }
    }

    setBubbleText(message);
    timer = setTimeout(() => {
      setBubbleText(null);
      if (nexiSpeechMessage) setNexiSpeechMessage(null);
    }, 6000);

    return () => clearTimeout(timer);
  }, [currentView, nexiSpeechMessage, butterflyEnabled]);

  // First-time visit special intro
  useEffect(() => {
    if (!butterflyEnabled || prefersReducedMotion) return;
    const hasSeenIntro = localStorage.getItem('nexi_intro_seen');
    if (!hasSeenIntro) {
      localStorage.setItem('nexi_intro_seen', 'true');
      posRef.current = { x: -60, y: 150 };
      targetRef.current = { x: window.innerWidth * 0.35, y: 180 };
      setBubbleText('Welcome to Nexus BI! 🦋');
      setTimeout(() => setBubbleText(null), 5000);
    }
  }, [butterflyEnabled]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = Math.max(1, now - lastMousePosRef.current.time);
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt;

      mousePosRef.current = { x: e.clientX, y: e.clientY, speed };
      lastMousePosRef.current = { x: e.clientX, y: e.clientY, time: now };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Main 60fps animation loop
  useEffect(() => {
    if (!butterflyEnabled || prefersReducedMotion || reduceButterflyMotion) return;

    let animId: number;
    let frame = 0;

    // Pick new random destination waypoint every 4-8 seconds
    const pickNewTarget = () => {
      const marginX = 80;
      const marginY = 100;
      const maxX = window.innerWidth - marginX;
      const maxY = window.innerHeight - marginY;

      // Prefer top-right or side areas to avoid blocking central content
      const zones = [
        { x: window.innerWidth * 0.85, y: 160 },
        { x: window.innerWidth * 0.9, y: window.innerHeight * 0.65 },
        { x: window.innerWidth * 0.1, y: 220 },
        { x: window.innerWidth * 0.78, y: window.innerHeight * 0.4 },
        { x: window.innerWidth * 0.2, y: window.innerHeight * 0.75 },
      ];

      const chosen = zones[Math.floor(Math.random() * zones.length)];
      targetRef.current = {
        x: Math.max(marginX, Math.min(maxX, chosen.x + (Math.random() - 0.5) * 120)),
        y: Math.max(marginY, Math.min(maxY, chosen.y + (Math.random() - 0.5) * 120)),
      };
    };

    const targetInterval = setInterval(pickNewTarget, 6500);

    const updateLoop = () => {
      frame++;

      // Current position & target
      const dx = targetRef.current.x - posRef.current.x;
      const dy = targetRef.current.y - posRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // React to user cursor proximity
      const mdx = mousePosRef.current.x - posRef.current.x;
      const mdy = mousePosRef.current.y - posRef.current.y;
      const mouseDist = Math.sqrt(mdx * mdx + mdy * mdy);

      let forceX = dx * 0.008;
      let forceY = dy * 0.008;

      // If cursor gets too close (< 90px), gently dodge away
      if (mouseDist < 90 && mouseDist > 0) {
        const repulse = (90 - mouseDist) * 0.08;
        forceX -= (mdx / mouseDist) * repulse;
        forceY -= (mdy / mouseDist) * repulse;
        wingPhaseRef.current += 0.35; // flap faster
      } else {
        wingPhaseRef.current += 0.15;
      }

      // Add gentle organic curved wobble
      const wobbleX = Math.sin(frame * 0.04) * 0.8;
      const wobbleY = Math.cos(frame * 0.03) * 0.6;

      velRef.current.x = (velRef.current.x + forceX) * 0.92 + wobbleX * 0.1;
      velRef.current.y = (velRef.current.y + forceY) * 0.92 + wobbleY * 0.1;

      posRef.current.x += velRef.current.x;
      posRef.current.y += velRef.current.y;

      // Calculate banking angle
      const targetRot = Math.max(-25, Math.min(25, velRef.current.x * 6));
      rotRef.current += (targetRot - rotRef.current) * 0.1;

      // Update state for render every 2 frames for silky smooth performance
      if (frame % 2 === 0) {
        setPos({ x: posRef.current.x, y: posRef.current.y });
        setRotation(rotRef.current);
        setWingSpeed(Math.abs(velRef.current.x) + Math.abs(velRef.current.y) > 0.5 ? 1.5 : 1);
      }

      // Emit subtle golden particles while moving
      if (frame % 8 === 0 && dist > 20) {
        setParticles((prev) => [
          ...prev.slice(-10),
          {
            id: Date.now() + Math.random(),
            x: posRef.current.x + (Math.random() - 0.5) * 10,
            y: posRef.current.y + (Math.random() - 0.5) * 10,
            size: Math.random() * 3 + 2,
            opacity: 0.7,
            life: 1,
          },
        ]);
      }

      animId = requestAnimationFrame(updateLoop);
    };

    animId = requestAnimationFrame(updateLoop);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(targetInterval);
    };
  }, [butterflyEnabled, prefersReducedMotion, reduceButterflyMotion]);

  // Click on butterfly mascot
  const handleButterflyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setClickCount((c) => c + 1);

    // Easter egg check
    if (clickCount >= 2) {
      setIsSpinning(true);
      setBubbleText('Okay okay! You found me! 🦋');
      setClickCount(0);
      setTimeout(() => setIsSpinning(false), 800);
      return;
    }

    setIsMenuOpen(!isMenuOpen);
  };

  const handleAskAi = () => {
    setIsMenuOpen(false);
    // Smooth flight toward AI Assistant button
    targetRef.current = { x: window.innerWidth - 80, y: window.innerHeight - 80 };
    setBubbleText('Opening Nexus AI Shopping Assistant... ✨');
    setTimeout(() => {
      setIsAiAssistantOpen(true);
      setBubbleText(null);
    }, 600);
  };

  if (!butterflyEnabled) return null;

  return (
    <>
      {/* Particle Trail Canvas/SVG */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 shadow-sm shadow-amber-400/50 animate-ping opacity-60"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: '1.2s',
            }}
          />
        ))}
      </div>

      {/* NEXI Butterfly Floating Entity */}
      <div
        className="fixed z-50 select-none cursor-pointer"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: `translate(-50%, -50%) rotate(${rotation}deg) ${isSpinning ? 'rotate(360deg)' : ''}`,
          transition: isSpinning ? 'transform 0.8s ease-in-out' : 'transform 0.15s ease-out',
        }}
        onClick={handleButterflyClick}
        title="NEXI — Your AI Shopping Mascot (Click to interact)"
      >
        {/* Context speech bubble */}
        {bubbleText && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 text-amber-300 text-[11px] font-bold px-3 py-1.5 rounded-full border border-amber-500/50 shadow-lg shadow-black/80 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
            {bubbleText}
            <span className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2 h-2 bg-black border-r border-b border-amber-500/50 rotate-45" />
          </div>
        )}

        {/* Realistic SVG Animated AI Butterfly */}
        <div className="relative group w-12 h-12 flex items-center justify-center">
          {/* Subtle Outer Golden Glow */}
          <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-md group-hover:bg-amber-400/40 transition-all" />

          {/* Butterfly SVG Structure */}
          <svg
            viewBox="0 0 100 100"
            className="w-10 h-10 drop-shadow-[0_0_8px_rgba(245,197,66,0.6)]"
            style={{
              animation: `butterflyFlap ${0.45 / wingSpeed}s ease-in-out infinite alternate`,
            }}
          >
            {/* Left Upper Wing */}
            <path
              d="M 50 48 C 30 15, 5 25, 12 55 C 18 70, 42 62, 50 52 Z"
              fill="url(#goldGradientLeft)"
              stroke="#F5C542"
              strokeWidth="1.5"
              opacity="0.9"
            />
            {/* Left Lower Wing */}
            <path
              d="M 50 54 C 32 60, 20 78, 30 88 C 42 95, 48 75, 50 58 Z"
              fill="url(#goldGradientLeft)"
              stroke="#D4AF37"
              strokeWidth="1.2"
              opacity="0.85"
            />

            {/* Right Upper Wing */}
            <path
              d="M 50 48 C 70 15, 95 25, 88 55 C 82 70, 58 62, 50 52 Z"
              fill="url(#goldGradientRight)"
              stroke="#F5C542"
              strokeWidth="1.5"
              opacity="0.9"
            />
            {/* Right Lower Wing */}
            <path
              d="M 50 54 C 68 60, 80 78, 70 88 C 58 95, 52 75, 50 58 Z"
              fill="url(#goldGradientRight)"
              stroke="#D4AF37"
              strokeWidth="1.2"
              opacity="0.85"
            />

            {/* Futuristic Tech AI Wing Circuits */}
            <path d="M 30 42 Q 40 45 48 50" stroke="#FFF" strokeWidth="1" strokeDasharray="2,2" opacity="0.8" />
            <path d="M 70 42 Q 60 45 52 50" stroke="#FFF" strokeWidth="1" strokeDasharray="2,2" opacity="0.8" />
            <circle cx="30" cy="42" r="2" fill="#FFF" />
            <circle cx="70" cy="42" r="2" fill="#FFF" />

            {/* Central Slender Butterfly Body */}
            <ellipse cx="50" cy="54" rx="3.5" ry="16" fill="#151515" stroke="#F5C542" strokeWidth="1.2" />

            {/* Head & Antennae */}
            <circle cx="50" cy="36" r="3.5" fill="#D4AF37" />
            <path d="M 48 34 Q 40 22 36 20" stroke="#F5C542" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M 52 34 Q 60 22 64 20" stroke="#F5C542" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <circle cx="36" cy="20" r="1.5" fill="#FFF" />
            <circle cx="64" cy="20" r="1.5" fill="#FFF" />

            {/* Gradients */}
            <defs>
              <linearGradient id="goldGradientLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5C542" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#D4AF37" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="goldGradientRight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F5C542" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#D4AF37" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0.9" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Interactive Click Menu */}
        {isMenuOpen && (
          <div
            className="absolute top-14 left-1/2 -translate-x-1/2 w-56 bg-zinc-950 text-white rounded-2xl border border-amber-500/30 p-3 shadow-2xl backdrop-blur-xl space-y-2 z-50 text-xs animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <span className="font-extrabold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NEXI Assistant</span>
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-zinc-400">
              I can help you find products, compare prices across stores, or track flash discounts!
            </p>

            <div className="space-y-1.5 pt-1">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setCurrentView('products');
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-amber-400 font-medium transition-colors flex items-center gap-2"
              >
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span>Find a Product</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setCurrentView('compare');
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-amber-400 font-medium transition-colors flex items-center gap-2"
              >
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>Compare Prices</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setCurrentView('deals');
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-amber-400 font-medium transition-colors flex items-center gap-2"
              >
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Show Top Deals</span>
              </button>

              <button
                onClick={handleAskAi}
                className="w-full text-left px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 font-bold border border-amber-500/30 transition-all flex items-center gap-2"
              >
                <Bot className="w-3.5 h-3.5 text-amber-400" />
                <span>Ask Nexus AI</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes butterflyFlap {
          0% {
            transform: scaleX(1);
          }
          100% {
            transform: scaleX(0.25);
          }
        }
      `}</style>
    </>
  );
};
