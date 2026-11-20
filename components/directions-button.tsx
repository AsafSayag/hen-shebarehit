"use client";

import { useRef, useState } from "react";
import { ChevronLeftIcon, CloseIcon, LocationIcon, MapIcon, NavigateIcon } from "@/components/icons";

type Props = {
  label: string;
  address: string;
  waze: string;
  googleMaps: string;
  appleMaps: string;
  className?: string;
  children?: React.ReactNode;
};

// Opens a sheet with navigation apps. Apple Maps is offered only on Apple devices.
export function DirectionsButton({ label, address, waze, googleMaps, appleMaps, className, children }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [isApple, setIsApple] = useState(false);

  const open = () => {
    setIsApple(/iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent));
    dialog.current?.showModal();
  };

  const options = [
    { label: "Waze", href: waze, icon: <NavigateIcon size={18} /> },
    { label: "Google Maps", href: googleMaps, icon: <LocationIcon size={20} /> },
    ...(isApple ? [{ label: "Apple Maps", href: appleMaps, icon: <MapIcon size={20} /> }] : []),
  ];

  return (
    <>
      <button type="button" className={className} onClick={open}>
        {children ?? label}
      </button>
      <dialog
        ref={dialog}
        className="directions-sheet"
        aria-labelledby="directions-title"
        onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}
      >
        <div className="directions-sheet-inner">
          <span className="directions-handle" aria-hidden="true" />
          <div className="directions-head">
            <div>
              <h2 id="directions-title">ניווט לאולם התצוגה</h2>
              <p>{address}</p>
            </div>
            <button type="button" className="icon-button" aria-label="סגירה" onClick={() => dialog.current?.close()}><CloseIcon size={22} /></button>
          </div>
          <ul>
            {options.map((option) => (
              <li key={option.label}>
                <a href={option.href} target="_blank" rel="noopener noreferrer">
                  <span className="icon-circle" aria-hidden="true">{option.icon}</span>
                  <span className="directions-label">{option.label}</span>
                  <ChevronLeftIcon size={18} />
                </a>
              </li>
            ))}
          </ul>
          <button type="button" className="button button-outline directions-cancel" onClick={() => dialog.current?.close()}>ביטול</button>
        </div>
      </dialog>
    </>
  );
}
