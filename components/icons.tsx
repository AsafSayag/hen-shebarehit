// Line icons from the designer's set (design/…/אייקונים), redrawn with currentColor so CSS sets their color.
// Icons the set did not include (menu, close, heart, map, external link, chevron down) follow the same 1.6 stroke style.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 20, viewBox, children, ...rest }: IconProps & { viewBox: string }) {
  return (
    <svg width={size} height={size} viewBox={viewBox} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...rest}>
      {children}
    </svg>
  );
}

export const ArrowLeftIcon = (p: IconProps) => (
  <Svg viewBox="0 0 20 20" strokeWidth={1.5} {...p}><path d="M15.83 10H4.17" /><path d="M9.17 5l-5 5 5 5" /></Svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Svg viewBox="0 0 20 20" strokeWidth={1.5} {...p}><path d="M4.17 10h11.66" /><path d="M10.83 5l5 5-5 5" /></Svg>
);

export const ChevronUpIcon = (p: IconProps) => (
  <Svg viewBox="0 0 20 20" strokeWidth={1.5} {...p}><path d="M15 12.5l-5-5-5 5" /></Svg>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <Svg viewBox="0 0 20 20" strokeWidth={1.5} {...p}><path d="M12.5 15l-5-5 5-5" /></Svg>
);

export const SearchIcon = (p: IconProps) => (
  <Svg viewBox="0 0 24 24" strokeWidth={1.56} {...p}><circle cx="10.6" cy="10.6" r="5.96" /><path d="M18.8 18.8l-3.85-3.85" /></Svg>
);

export const WhatsappIcon = (p: IconProps) => (
  <Svg viewBox="0 0 18 18" strokeWidth={1.2} {...p}>
    <path d="M3 15l.98-3a6.04 6.04 0 1 1 2.32 2.25L3 15z" />
    <path d="M6.75 6.9c.23 1.73 1.95 3.45 3.68 3.68l.75-.83 1.2.53-.23 1.05c-2.7.15-5.33-2.48-5.17-5.18l1.05-.22.52 1.2-1.8-.23z" />
  </Svg>
);

export const PhoneIcon = (p: IconProps) => (
  <Svg viewBox="0 0 22 22" strokeWidth={1.6} {...p}>
    <path d="M4.58 3.67h3.67l1.83 4.58-2.29 1.38a10 10 0 0 0 4.58 4.58l1.38-2.29 4.58 1.83v3.67a.92.92 0 0 1-.92.92A14.67 14.67 0 0 1 3.67 4.58a.92.92 0 0 1 .91-.91z" />
  </Svg>
);

export const LocationIcon = (p: IconProps) => (
  <Svg viewBox="0 0 22 22" strokeWidth={1.6} {...p}>
    <path d="M11 19.25s-6.42-5.68-6.42-10.08a6.42 6.42 0 0 1 12.84 0c0 4.4-6.42 10.08-6.42 10.08z" />
    <circle cx="11" cy="9.17" r="2.29" />
  </Svg>
);

export const ClockIcon = (p: IconProps) => (
  <Svg viewBox="0 0 22 22" strokeWidth={1.6} {...p}><circle cx="11" cy="11" r="7.79" /><path d="M11 6.88V11l2.75 1.83" /></Svg>
);

export const NavigateIcon = (p: IconProps) => (
  <Svg viewBox="0 0 18 18" strokeWidth={1.2} {...p}><path d="M2.25 8.25l13.5-6-6 13.5-1.5-6-6-1.5z" /></Svg>
);

export const MapIcon = (p: IconProps) => (
  <Svg viewBox="0 0 22 22" strokeWidth={1.6} {...p}><path d="M3.67 5.5l4.58-1.83 5.5 1.83 4.58-1.83v12.83l-4.58 1.83-5.5-1.83-4.58 1.83V5.5z" /><path d="M8.25 3.67v12.83M13.75 5.5v12.83" /></Svg>
);

export const ExternalIcon = (p: IconProps) => (
  <Svg viewBox="0 0 20 20" strokeWidth={1.5} {...p}><path d="M11.67 3.33h5v5" /><path d="M16.67 3.33L9.17 10.83" /><path d="M14.17 11.67v3.33a1.67 1.67 0 0 1-1.67 1.67H5a1.67 1.67 0 0 1-1.67-1.67V7.5A1.67 1.67 0 0 1 5 5.83h3.33" /></Svg>
);

export const InstagramIcon = (p: IconProps) => (
  <Svg viewBox="0 0 20 20" strokeWidth={1.33} {...p}>
    <rect x="2.92" y="2.92" width="14.17" height="14.17" rx="4.17" /><circle cx="10" cy="10" r="3.33" /><circle cx="14.33" cy="5.67" r=".5" fill="currentColor" stroke="none" />
  </Svg>
);

export const FacebookIcon = (p: IconProps) => (
  <Svg viewBox="0 0 20 20" strokeWidth={1.33} {...p}>
    <path d="M12.08 6.67h2.09V3.75h-2.09a2.92 2.92 0 0 0-2.91 2.92v2.08H7.08v2.92h2.09v5.41h2.91v-5.41h2.09l.41-2.92h-2.5V6.67z" />
  </Svg>
);

export const HeartIcon = (p: IconProps) => (
  <Svg viewBox="0 0 22 22" strokeWidth={1.6} {...p}><path d="M11 18.33S3.67 14 3.67 8.71A3.96 3.96 0 0 1 11 6.6a3.96 3.96 0 0 1 7.33 2.11C18.33 14 11 18.33 11 18.33z" /></Svg>
);

export const MenuIcon = (p: IconProps) => (
  <Svg viewBox="0 0 24 24" strokeWidth={1.6} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Svg>
);

export const CloseIcon = (p: IconProps) => (
  <Svg viewBox="0 0 24 24" strokeWidth={1.6} {...p}><path d="M6 6l12 12M18 6L6 18" /></Svg>
);

export const StarIcon = (p: IconProps) => (
  <Svg viewBox="0 0 14 14" stroke="none" {...p}><path fill="currentColor" d="M6.9 0L9 4.43l4.8.6-3.53 3.3.9 4.72L6.9 10.73l-4.27 2.32.9-4.72L0 5.03l4.8-.6L6.9 0z" /></Svg>
);

export const DeliveryIcon = (p: IconProps) => (
  <Svg viewBox="0 0 28 28" strokeWidth={1.6} {...p}>
    <path d="M2.92 7.58H15.75v10.5H2.92z" /><path d="M15.75 11.08h4.67l3.5 3.74v3.26h-8.17" /><circle cx="7.58" cy="20.42" r="2.1" /><circle cx="19.83" cy="20.42" r="2.1" />
  </Svg>
);

export const PersonIcon = (p: IconProps) => (
  <Svg viewBox="0 0 28 28" strokeWidth={1.6} {...p}><circle cx="14" cy="9.33" r="4.08" /><path d="M5.83 23.33a8.17 8.17 0 0 1 16.34 0" /></Svg>
);

export const SlidersIcon = (p: IconProps) => (
  <Svg viewBox="0 0 28 28" strokeWidth={1.6} {...p}>
    <path d="M4.67 8.17h10.5M22.17 8.17h1.16M4.67 19.83h3.5M15.17 19.83h8.16" /><circle cx="18.67" cy="8.17" r="2.57" /><circle cx="11.67" cy="19.83" r="2.57" />
  </Svg>
);

export const SofaIcon = (p: IconProps) => (
  <Svg viewBox="0 0 28 28" strokeWidth={1.6} {...p}>
    <path d="M5.83 12.83V9.92a3.5 3.5 0 0 1 3.5-3.5h9.34a3.5 3.5 0 0 1 3.5 3.5v2.91" />
    <path d="M3.5 15.75a2.33 2.33 0 0 1 4.67 0v1.75h11.66v-1.75a2.33 2.33 0 0 1 4.67 0V21H3.5v-5.25z" /><path d="M6.42 21v1.75M21.58 21v1.75" />
  </Svg>
);

export const ChatIcon = (p: IconProps) => (
  <Svg viewBox="0 0 30 30" strokeWidth={1.875} {...p}><path d="M5 6.88h20v12.5H11.88l-5.63 5v-5H5V6.88z" /><path d="M10 13.13h10" /></Svg>
);

export const SwatchIcon = (p: IconProps) => (
  <Svg viewBox="0 0 30 30" strokeWidth={1.875} {...p}>
    <rect x="5" y="5" width="8.75" height="20" rx="1.88" />
    <path d="M13.75 11.88l5.75-5.76a1.75 1.75 0 0 1 2.5 0l1.88 1.88a1.75 1.75 0 0 1 0 2.5L13.75 20.63" /><path d="M13.75 25h10.63a.63.63 0 0 0 .62-.63v-8.12" /><circle cx="9.38" cy="20.63" r="1" />
  </Svg>
);

export const HomeIcon = (p: IconProps) => (
  <Svg viewBox="0 0 30 30" strokeWidth={1.875} {...p}><path d="M5 13.75l10-8.13 10 8.13" /><path d="M7.5 11.88V25h15V11.88" /><path d="M12.5 25v-6.25h5V25" /></Svg>
);

export const PlayIcon = (p: IconProps) => (
  <Svg viewBox="0 0 32 32" stroke="none" {...p}><path fill="currentColor" d="M10.67 7.33v17.34a1.07 1.07 0 0 0 1.6.93l13.6-8.67a1.07 1.07 0 0 0 0-1.86l-13.6-8.67a1.07 1.07 0 0 0-1.6.93z" /></Svg>
);
