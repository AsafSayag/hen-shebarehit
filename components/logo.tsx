// The החן שברהיט logo (option C, "מנורה", chosen 20 November 2026): a pendant lamp lighting a sofa,
// next to the name set in Assistant, the site's typeface. The text is live text so it stays sharp at any size.

import { business } from "@/lib/site";

type Tone = "light" | "dark";

const colors: Record<Tone, { ink: string; warm: string }> = {
  light: { ink: "#333530", warm: "#8a755a" },
  dark: { ink: "#f6f2eb", warm: "#c9b79c" },
};

export function LogoMark({ tone = "light", className }: { tone?: Tone; className?: string }) {
  const { ink, warm } = colors[tone];
  return (
    <svg className={className} viewBox="0 0 64 72" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M32 2v15" stroke={warm} strokeWidth="1.8" />
      <path d="M17 33c0-9.4 6.7-16 15-16s15 6.6 15 16z" fill={warm} />
      <circle cx="32" cy="36.5" r="2.6" fill={warm} />
      <path d="M24 42.5q8 4.5 16 0" stroke={warm} strokeWidth="1.6" />
      <path d="M17 59v-3.5a3 3 0 0 1 3-3h24a3 3 0 0 1 3 3V59" stroke={ink} strokeWidth="2.4" />
      <path d="M12 68v-7.5a3 3 0 0 1 6 0V63h28v-2.5a3 3 0 0 1 6 0V68z" stroke={ink} strokeWidth="2.4" />
    </svg>
  );
}

export function Logo({ tone = "light", className }: { tone?: Tone; className?: string }) {
  return (
    <span className={`logo logo-${tone}${className ? ` ${className}` : ""}`} aria-hidden="true">
      <LogoMark tone={tone} className="logo-mark" />
      <span className="logo-words">
        {/* The space keeps the name and tagline apart in the link's text ("שברהיט איכות"); a flex column does not draw it. */}
        <span className="logo-name"><span className="logo-first">החן</span> <span className="logo-second">שברהיט</span></span>{" "}
        <span className="logo-tagline">{business.tagline}</span>
      </span>
    </span>
  );
}
