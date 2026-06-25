'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollAnimations() {
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const triggerStart = 'top 92%';
    const ctx = gsap.context(() => {

      // ── 1. h1 headings — scan wipe ──────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>('main h1').forEach((el) => {
        gsap.fromTo(el,
          { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
          { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: isMobile ? 0.7 : 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: triggerStart, toggleActions: 'play reverse play reverse' } }
        );
      });

      // ── 2. h2 headings — slide from left ────────────────────────────────────
      gsap.utils.toArray<HTMLElement>('main h2').forEach((el, i) => {
        gsap.fromTo(el,
          { x: isMobile ? -30 : -60, opacity: 0, filter: 'blur(4px)' },
          { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.65, delay: i * 0.03, ease: 'expo.out', scrollTrigger: { trigger: el, start: triggerStart, toggleActions: 'play reverse play reverse' } }
        );
      });

      // ── 3. h3 headings — fade + scale ───────────────────────────────────────
      gsap.utils.toArray<HTMLElement>('main h3').forEach((el, i) => {
        gsap.fromTo(el,
          { y: isMobile ? 15 : 30, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.55, delay: i * 0.02, ease: 'back.out(1.4)', scrollTrigger: { trigger: el, start: triggerStart, toggleActions: 'play reverse play reverse' } }
        );
      });

      // ── 4. Paragraphs & list items — stagger fade ───────────────────────────
      gsap.utils.toArray<HTMLElement>('main p, main li').forEach((el, i) => {
        gsap.fromTo(el,
          { y: isMobile ? 12 : 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, delay: (i % 4) * 0.05, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 95%', toggleActions: 'play reverse play reverse' } }
        );
      });

      // ── 5. Articles — reveal alternating direction ───────────────────────────
      gsap.utils.toArray<HTMLElement>('main article:not(.reveal-card)').forEach((el, i) => {
        const x = isMobile ? 0 : (i % 3 === 0 ? -30 : i % 3 === 1 ? 30 : 0);
        const y = isMobile ? 25 : (x === 0 ? 40 : 15);
        gsap.fromTo(el,
          { x, y, opacity: 0, scale: isMobile ? 0.97 : 0.93 },
          { x: 0, y: 0, opacity: 1, scale: 1, duration: isMobile ? 0.5 : 0.65, delay: (i % 3) * 0.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 93%', toggleActions: 'play reverse play reverse' } }
        );
      });

      // ── 6. Glass panels — rise + blur ───────────────────────────────────────
      gsap.utils.toArray<HTMLElement>('main .glass-panel').forEach((el, i) => {
        gsap.fromTo(el,
          { y: isMobile ? 20 : 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, delay: (i % 3) * 0.08, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 93%', toggleActions: 'play reverse play reverse' } }
        );
      });

      // ── 7. reveal-section containers ────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>('main .reveal-section').forEach((el, i) => {
        gsap.fromTo(el,
          { y: isMobile ? 20 : 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, delay: i * 0.05, ease: 'power3.out', scrollTrigger: { trigger: el, start: triggerStart, toggleActions: 'play reverse play reverse' } }
        );
      });

      // ── 8. reveal-card elements ──────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>('main .reveal-card').forEach((el, i) => {
        gsap.fromTo(el,
          { y: isMobile ? 20 : 35, opacity: 0, scale: 0.97 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, delay: (i % 3) * 0.12, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 94%', toggleActions: 'play reverse play reverse' } }
        );
      });

      // ── 9. MUI Icons — spin fade ─────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>('main .MuiSvgIcon-root').forEach((el, i) => {
        gsap.fromTo(el,
          { rotation: -90, opacity: 0, scale: 0.5 },
          { rotation: 0, opacity: 1, scale: 1, duration: 0.45, delay: (i % 5) * 0.06, ease: 'back.out(1.7)', scrollTrigger: { trigger: el, start: 'top 95%', toggleActions: 'play reverse play reverse' } }
        );
      });

      // ── 10. Images — parallax slide up ──────────────────────────────────────
      gsap.utils.toArray<HTMLElement>('main img:not(.skill-icon)').forEach((el) => {
        gsap.fromTo(el,
          { y: isMobile ? 30 : 60, opacity: 0, scale: 1.05 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: triggerStart, toggleActions: 'play reverse play reverse' } }
        );
      });

      // ── 11. Horizontal dividers — scaleX draw ───────────────────────────────
      gsap.utils.toArray<HTMLElement>('main [class*="h-px"]').forEach((el) => {
        gsap.fromTo(el,
          { scaleX: 0, transformOrigin: 'left center', opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.7, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 95%', toggleActions: 'play reverse play reverse' } }
        );
      });

      // ── 12. fade-in-up legacy class ─────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>('main .fade-in-up').forEach((el, i) => {
        gsap.fromTo(el,
          { y: isMobile ? 20 : 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, delay: i * 0.05, ease: 'power3.out', scrollTrigger: { trigger: el, start: triggerStart, toggleActions: 'play reverse play reverse' } }
        );
      });

      // ── 13. Aside panels — slide from right ─────────────────────────────────
      gsap.utils.toArray<HTMLElement>('main aside > div').forEach((el, i) => {
        gsap.fromTo(el,
          { x: isMobile ? 0 : 50, y: isMobile ? 20 : 0, opacity: 0 },
          { x: 0, y: 0, opacity: 1, duration: 0.55, delay: i * 0.08, ease: 'expo.out', scrollTrigger: { trigger: el, start: triggerStart, toggleActions: 'play reverse play reverse' } }
        );
      });

      // ── 14. Skill items — staggered sequential reveal ───────────────────────
      gsap.utils.toArray<HTMLElement>('main .skill-group').forEach((group) => {
        const items = group.querySelectorAll('.skill-item');
        if (items.length > 0) {
          gsap.fromTo(items,
            { y: isMobile ? 15 : 25, opacity: 0, scale: 0.95 },
            { 
              y: 0, 
              opacity: 1, 
              scale: 1,
              duration: 0.4, 
              stagger: 0.05, 
              ease: 'back.out(1.5)', 
              scrollTrigger: { 
                trigger: group, 
                start: 'top 92%', 
                toggleActions: 'play reverse play reverse' 
              } 
            }
          );
        }
      });

    }, document.querySelector('main') || document.body);

    return () => {
      ctx.revert(); // Properly cleans up GSAP context and restores original styles
    };
  }, []);

  return null;
}