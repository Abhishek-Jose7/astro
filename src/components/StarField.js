'use client';

import { useEffect, useRef } from 'react';
import styles from './StarField.module.css';

export default function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let stars = [];
    let shootingStars = [];
    let nebulaClouds = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createStars() {
      stars = [];
      const count = Math.floor((canvas.width * canvas.height) / 6000);
      for (let i = 0; i < count; i++) {
        // Some stars are violet-tinted, most are warm white
        const hue = Math.random() > 0.7 ? 'violet' : Math.random() > 0.85 ? 'gold' : 'white';
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.6 + 0.15,
          opacity: Math.random() * 0.65 + 0.2,
          speed: Math.random() * 0.018 + 0.003,
          phase: Math.random() * Math.PI * 2,
          hue,
        });
      }
    }

    function createNebulaClouds() {
      nebulaClouds = [
        { x: canvas.width * 0.75, y: canvas.height * 0.15, r: canvas.width * 0.28, color: 'rgba(91,63,160,0.06)' },
        { x: canvas.width * 0.15, y: canvas.height * 0.55, r: canvas.width * 0.22, color: 'rgba(139,34,82,0.05)' },
        { x: canvas.width * 0.55, y: canvas.height * 0.85, r: canvas.width * 0.20, color: 'rgba(124,92,191,0.05)' },
      ];
    }

    function spawnShootingStar() {
      const startX = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
      const startY = Math.random() * canvas.height * 0.4;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
      const speed = 14 + Math.random() * 10;
      shootingStars.push({
        x: startX, y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 80 + Math.random() * 120,
        opacity: 1,
        fade: 0.025 + Math.random() * 0.015,
        size: 1.2 + Math.random() * 0.8,
      });
    }

    let lastShootTime = 0;
    const SHOOT_INTERVAL = 3200; // ms between shooting stars

    function drawNebula() {
      for (const cloud of nebulaClouds) {
        const grad = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.r);
        grad.addColorStop(0, cloud.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function draw(time) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // nebula
      drawNebula();

      // stars
      for (const star of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(time * star.speed + star.phase);
        const alpha = star.opacity * twinkle;

        let color;
        if (star.hue === 'violet') {
          color = `rgba(180, 160, 255, ${alpha})`;
        } else if (star.hue === 'gold') {
          color = `rgba(220, 195, 130, ${alpha})`;
        } else {
          color = `rgba(230, 222, 245, ${alpha})`;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Glow for brighter stars
        if (star.size > 1.1) {
          const glowColor = star.hue === 'gold'
            ? `rgba(196,160,85,${alpha * 0.12})`
            : `rgba(124,92,191,${alpha * 0.1})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = glowColor;
          ctx.fill();
        }
      }

      // Spawn shooting stars
      if (time - lastShootTime > SHOOT_INTERVAL) {
        spawnShootingStar();
        lastShootTime = time;
        if (Math.random() > 0.7) {
          setTimeout(spawnShootingStar, 400);
        }
      }

      // Draw & update shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        const tailX = s.x - Math.cos(Math.atan2(s.vy, s.vx)) * s.length;
        const tailY = s.y - Math.sin(Math.atan2(s.vy, s.vx)) * s.length;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(200, 185, 255, 0)`);
        grad.addColorStop(0.6, `rgba(200, 185, 255, ${s.opacity * 0.3})`);
        grad.addColorStop(1, `rgba(230, 218, 255, ${s.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.size;
        ctx.stroke();

        // Head sparkle
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 230, 255, ${s.opacity * 0.9})`;
        ctx.fill();

        s.x += s.vx;
        s.y += s.vy;
        s.opacity -= s.fade;
        if (s.opacity <= 0 || s.x > canvas.width + 100 || s.y > canvas.height + 100) {
          shootingStars.splice(i, 1);
        }
      }

      animationId = requestAnimationFrame(draw);
    }

    function handleResize() {
      resize();
      createStars();
      createNebulaClouds();
    }

    resize();
    createStars();
    createNebulaClouds();
    animationId = requestAnimationFrame(draw);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}

