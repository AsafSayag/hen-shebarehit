import { business } from "@/lib/site";

// The mobile number with the owner's name next to it, so callers know they will reach Shmuel.
export function PhoneLink({ className }: { className?: string }) {
  return (
    <a href={`tel:${business.mobile}`} className={`phone-link${className ? ` ${className}` : ""}`}>
      <span className="phone-link-name">{business.owner}</span> <bdi dir="ltr">{business.mobileDisplay}</bdi>
    </a>
  );
}
