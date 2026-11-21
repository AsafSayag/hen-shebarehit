"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeftIcon, ArrowRightIcon, PauseIcon, PlayIcon } from "@/components/icons";

type Props = {
  label: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  // "large" shows fewer, bigger slides with a progress bar; "thirds" fits three cards (reviews).
  variant?: "default" | "large" | "thirds";
  // Moves one card at a time and starts over at the end. Stops while the pointer or focus is on the rail,
  // after a swipe or a button press, when the rail is off screen, and for visitors who prefer reduced motion.
  autoplay?: boolean;
};

const autoplayDelay = 3800;
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// A horizontal, swipeable row with previous/next buttons. In RTL the row scrolls toward negative scrollLeft.
export function ScrollRail({ label, children, footer, variant = "default", autoplay = false }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia(reducedMotionQuery).matches, () => false);
  const holding = useRef(false);
  const lastTouch = useRef(0);
  const visible = useRef(false);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const travelled = Math.abs(el.scrollLeft);
      setEdges({ start: travelled < 4, end: travelled > max - 4 });
      setProgress(max > 0 ? Math.min(1, travelled / max) : 1);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { el.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  const playing = autoplay && !paused && !reducedMotion;

  useEffect(() => {
    const el = track.current;
    if (!el || !playing) return;
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; }, { threshold: 0.4 });
    observer.observe(el);
    const timer = window.setInterval(() => {
      if (!visible.current || holding.current || document.hidden || Date.now() - lastTouch.current < autoplayDelay * 2) return;
      const max = el.scrollWidth - el.clientWidth;
      if (Math.abs(el.scrollLeft) > max - 4) {
        el.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      const first = el.firstElementChild as HTMLElement | null;
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      const step = (first?.offsetWidth ?? el.clientWidth) + gap;
      const rtl = getComputedStyle(el).direction === "rtl";
      el.scrollBy({ left: step * (rtl ? -1 : 1), behavior: "smooth" });
    }, autoplayDelay);
    return () => { observer.disconnect(); window.clearInterval(timer); };
  }, [playing]);

  const move = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    lastTouch.current = Date.now();
    const step = el.clientWidth * 0.8;
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({ left: direction * step * (rtl ? -1 : 1), behavior: "smooth" });
  };

  const hold = (on: boolean) => { holding.current = on; };

  return (
    <div
      className={`scroll-rail scroll-rail-${variant}`}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") hold(true); }}
      onPointerLeave={(event) => { if (event.pointerType === "mouse") hold(false); }}
      onPointerDown={() => { lastTouch.current = Date.now(); }}
      onFocus={(event) => { if ((event.target as HTMLElement).matches(":focus-visible")) hold(true); }}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) hold(false); }}
    >
      <div className="scroll-rail-track" ref={track} role="region" aria-label={`רשימת ${label}`} tabIndex={0} onWheel={() => { lastTouch.current = Date.now(); }}>
        {children}
      </div>
      <div className="scroll-rail-footer">
        {variant === "large" && (
          <span className="scroll-rail-progress" aria-hidden="true"><span style={{ transform: `scaleX(${Math.max(progress, 0.06)})` }} /></span>
        )}
        <div className="scroll-rail-buttons">
          {autoplay && !reducedMotion && (
            <button type="button" className="round-button scroll-rail-pause" aria-label={paused ? "הפעלת הגלילה האוטומטית" : "עצירת הגלילה האוטומטית"} onClick={() => setPaused((value) => !value)}>
              {paused ? <PlayIcon size={18} /> : <PauseIcon size={16} />}
            </button>
          )}
          <button type="button" className="round-button scroll-rail-arrow" aria-label="הקודם" onClick={() => move(-1)} disabled={edges.start}><ArrowRightIcon size={20} /></button>
          <button type="button" className="round-button scroll-rail-arrow" aria-label="הבא" onClick={() => move(1)} disabled={edges.end}><ArrowLeftIcon size={20} /></button>
        </div>
        {footer}
      </div>
    </div>
  );
}
