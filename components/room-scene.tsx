"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeftIcon } from "@/components/icons";

type Hotspot = { key: string; label: string; text: string; href: string; thumb: string; x: number; y: number };

// A room photo with markers; each marker opens a small card that leads to the matching category.
export function RoomScene({ image, alt, hotspots }: { image: string; alt: string; hotspots: readonly Hotspot[] }) {
  const [activeKey, setActiveKey] = useState(hotspots[0]?.key);
  const active = hotspots.find((spot) => spot.key === activeKey) ?? hotspots[0];

  return (
    <div className="room-scene">
      <div className="room-scene-image">
        <div className="room-scene-canvas">
          <Image src={image} alt={alt} fill sizes="100vw" className="room-scene-photo" />
          {hotspots.map((spot) => (
            <button
              key={spot.key}
              type="button"
              className={`room-hotspot${spot.key === active.key ? " is-active" : ""}`}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              aria-label={spot.label}
              aria-pressed={spot.key === active.key}
              onClick={() => setActiveKey(spot.key)}
            />
          ))}
        </div>
        <div
          className={`room-card${active.x > 55 ? " is-flipped" : ""}`}
          style={{ "--spot-x": `${active.x}%`, "--spot-y": `${active.y}%` } as React.CSSProperties}
          aria-live="polite"
        >
          <Image src={active.thumb} alt="" width={64} height={64} className="room-card-thumb" />
          <div>
            <strong>{active.label}</strong>
            <p>{active.text}</p>
            <Link href={active.href} className="room-card-link">לצפייה בקטגוריה <ArrowLeftIcon size={16} /></Link>
          </div>
        </div>
      </div>
      <div className="room-chips">
        <span>עוד בחדר הזה</span>
        <div>
          {hotspots.map((spot) => (
            <button key={spot.key} type="button" className={spot.key === active.key ? "is-active" : undefined} aria-pressed={spot.key === active.key} onClick={() => setActiveKey(spot.key)}>
              {spot.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
