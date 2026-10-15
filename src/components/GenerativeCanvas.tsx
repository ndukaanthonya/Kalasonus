import React, { useEffect, useRef, useCallback } from 'react';
import { ArtStyle, AudioAnalysis } from '../types';

interface GenerativeCanvasProps {
  stylePreset: ArtStyle;
  seed: number;
  audioAnalysis?: AudioAnalysis | null;
  width?: number;
  height?: number;
  interactive?: boolean;
  className?: string;
  onCanvasReady?: (dataUrl: string) => void;
  useFallbackImage?: boolean;
}

export const HOTLINKED_ART_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuDeSNcANRYaUYp8MHYC_0YFpWCDQF9ZEF_a_SCRV4bIoRm02eZK5wjXx25MLLs8RklGC75JXxOJzIFwqravFRUNRSYP2Gf2jZDjEQL6UFThbTqDm2RpxPcvvabd0gCKCMF9DASZdpdIe7LVTl9Cjh5NOhzwvnz4Hpn1_1CHx7zxkJPUB7P14WejJWXOcSB9fflv7re07G7bUA3t1uHFXQEgplMHrCRNWga6u6HP9D0F9tJsvCio_tTtGw";

export const GenerativeCanvas: React.FC<GenerativeCanvasProps> = ({
  stylePreset,
  seed,
  audioAnalysis,
  width = 600,
  height = 750,
  interactive = true,
  className = "",
  onCanvasReady,
  useFallbackImage = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Pseudo random generator based on seed
    let s = seed || 12345;
    const random = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };

    // Dark background
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, w, h);

    // Audio modulations
    const energy = audioAnalysis?.energy || 0.6;
    const freqFactor = audioAnalysis?.frequencies?.reduce((a, b) => a + b, 0) || 128;

    // Particles count
    const particleCount = stylePreset === 'neon-stipple' ? 3800 : 3000;
    
    // Style colors with rich multi-hue color spectrums
    let colorPalette: string[];
    switch (stylePreset) {
      case 'neon-stipple':
        colorPalette = [
          '#5adace', // Electric turquoise
          '#38bdf8', // Bright cyan
          '#34d399', // Emerald teal
          '#facc15', // Vibrant gold
          '#f43f5e', // Hot magenta
          '#fb923c', // Warm coral
          '#818cf8', // Periwinkle
          '#a855f7'  // Deep violet accent
        ];
        break;
      case 'cosmic-nebula':
        colorPalette = [
          '#38bdf8', // Deep sky cyan
          '#10b981', // Neon emerald
          '#f59e0b', // Stardust amber
          '#fb7185', // Radiant pink
          '#06b6d4', // Bright aqua
          '#3b82f6', // Royal electric blue
          '#c084fc', // Soft lavender
          '#ec4899'  // Nebula magenta
        ];
        break;
      default:
        colorPalette = ['#5adace', '#38bdf8', '#34d399', '#facc15', '#f43f5e', '#a855f7'];
    }

    // Swirl centres
    const numCenters = 3 + Math.floor(random() * 3);
    const centers = Array.from({ length: numCenters }, () => ({
      x: (0.2 + random() * 0.6) * w,
      y: (0.15 + random() * 0.7) * h,
      strength: (random() > 0.5 ? 1 : -1) * (1.2 + random() * 2.0) * energy,
      radius: (100 + random() * 220)
    }));

    // Generate particles
    ctx.globalCompositeOperation = 'screen';

    for (let i = 0; i < particleCount; i++) {
      let px = random() * w;
      let py = random() * h;
      
      // Calculate curl noise / flow field
      let angle = 0;
      centers.forEach((c) => {
        const dx = px - c.x;
        const dy = py - c.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.1;
        if (dist < c.radius * 2) {
          const factor = (1 - dist / (c.radius * 2)) * c.strength;
          angle += Math.atan2(dy, dx) + (Math.PI / 2) * factor * (freqFactor / 150);
        }
      });

      // Flow step
      const stepLen = (15 + random() * 45) * energy;
      const endX = px + Math.cos(angle) * stepLen;
      const endY = py + Math.sin(angle) * stepLen;

      const col = colorPalette[Math.floor(random() * colorPalette.length)];
      const opacity = 0.25 + random() * 0.65;
      const dotSize = stylePreset === 'neon-stipple' ? (0.8 + random() * 1.8) : (1.2 + random() * 2.5);

      ctx.fillStyle = col;
      ctx.globalAlpha = opacity;

      // Draw particle dot or tiny swirl line
      if (stylePreset === 'neon-stipple') {
        ctx.beginPath();
        ctx.arc(endX, endY, dotSize, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = col;
        ctx.lineWidth = dotSize;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.quadraticCurveTo(
          (px + endX) / 2 + (random() - 0.5) * 10,
          (py + endY) / 2 + (random() - 0.5) * 10,
          endX,
          endY
        );
        ctx.stroke();
      }
    }

    // Add subtle ambient central vignette glow
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    
    const grad = ctx.createRadialGradient(w / 2, h / 2, h * 0.1, w / 2, h / 2, h * 0.7);
    grad.addColorStop(0, 'rgba(90, 218, 206, 0.05)');
    grad.addColorStop(1, 'rgba(10, 10, 15, 0.6)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    if (onCanvasReady) {
      try {
        const dataUrl = canvas.toDataURL('image/png');
        onCanvasReady(dataUrl);
      } catch {
        // Fallback safely if canvas tainted
      }
    }
  }, [seed, stylePreset, audioAnalysis, onCanvasReady]);

  useEffect(() => {
    if (useFallbackImage) return;
    drawCanvas();
  }, [drawCanvas, useFallbackImage]);

  if (useFallbackImage) {
    return (
      <img
        src={HOTLINKED_ART_URL}
        alt="Generated Abstract Voice Art"
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`w-full h-full object-cover block ${className}`}
    />
  );
};
