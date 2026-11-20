"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";

// A horizontal, swipeable row with previous/next buttons. In RTL the row scrolls toward negative scrollLeft.
export function ScrollRail({ label, children, footer }: { label: string; children: React.ReactNode; footer?: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const travelled = Math.abs(el.scrollLeft);
      setEdges({ start: travelled < 4, end: travelled > max - 4 });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { el.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  const move = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const step = el.clientWidth * 0.8;
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({ left: direction * step * (rtl ? -1 : 1), behavior: "smooth" });
  };

  return (
    <div className="scroll-rail">
      <div className="scroll-rail-track" ref={track} role="region" aria-label={label} tabIndex={0}>
        {children}
      </div>
      <div className="scroll-rail-footer">
        <div className="scroll-rail-buttons">
          <button type="button" className="round-button" aria-label="הקודם" onClick={() => move(-1)} disabled={edges.start}><ArrowRightIcon size={20} /></button>
          <button type="button" className="round-button" aria-label="הבא" onClick={() => move(1)} disabled={edges.end}><ArrowLeftIcon size={20} /></button>
        </div>
        {footer}
      </div>
    </div>
  );
}
