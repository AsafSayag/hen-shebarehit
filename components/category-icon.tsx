import type { CategoryIconName } from "@/lib/site";

type Props = {
  name: CategoryIconName;
  className?: string;
};

export function CategoryIcon({ name, className }: Props) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...common}
    >
      {name === "bed" && (
        <>
          <path d="M9 39V20a5 5 0 0 1 5-5h36a5 5 0 0 1 5 5v19" />
          <path d="M9 39h46v11H9zM13 50v5m38-5v5M14 31h36a5 5 0 0 1 5 5v3H9v-3a5 5 0 0 1 5-5Z" />
          <path d="M17 27h11m8 0h11" />
        </>
      )}
      {name === "wardrobe" && (
        <>
          <path d="M12 12h40v42H12zM32 12v42M12 46h40M17 54v4m30-4v4" />
          <path d="M27 30v8m10-8v8" />
        </>
      )}
      {name === "mattress" && (
        <>
          <rect x="10" y="17" width="44" height="18" rx="5" />
          <path d="M10 27c10 5 34 5 44 0M13 40h38a4 4 0 0 1 4 4v5H9v-5a4 4 0 0 1 4-4ZM13 49v5m38-5v5" />
          <path d="M18 21h9m10 0h9" />
        </>
      )}
      {name === "chair" && (
        <>
          <path d="M19 38V16a5 5 0 0 1 5-5h16a5 5 0 0 1 5 5v22" />
          <path d="M16 38h32v8H16zM20 46v11m24-11v11M16 38l-4-5m36 5 4-5" />
        </>
      )}
      {name === "dining" && (
        <>
          <path d="M18 28h28l3 5H15l3-5ZM22 33v20m20-20v20" />
          <path d="M7 23h10v21H7zm40 0h10v21H47zM10 44v10m44-10v10M7 36h10m30 0h10" />
        </>
      )}
      {name === "sofa" && (
        <>
          <path d="M12 37V25a8 8 0 0 1 8-8h24a8 8 0 0 1 8 8v12" />
          <path d="M12 32a6 6 0 0 0-6 6v9a5 5 0 0 0 5 5h42a5 5 0 0 0 5-5v-9a6 6 0 0 0-6-6M12 39h40M15 52v5m34-5v5" />
        </>
      )}
      {name === "sideboard" && (
        <>
          <path d="M9 23h46v28H9zM9 32h46M32 32v19M14 51v6m36-6v6" />
          <path d="M24 39v6m16-6v6M13 18h38" />
        </>
      )}
      {name === "holy-closet" && (
        <>
          <path d="M15 54V22a17 17 0 0 1 34 0v32H15ZM32 6v48M15 24h34M19 54v4m26-4v4" />
          <path d="M27 36v7m10-7v7" />
        </>
      )}
    </svg>
  );
}
