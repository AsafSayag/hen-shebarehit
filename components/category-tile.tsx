import Link from "next/link";
import { CategoryIcon } from "@/components/category-icon";
import type { CategoryIconName } from "@/lib/site";

type Props = {
  title: string;
  href: string;
  icon: CategoryIconName;
  tone: string;
};

export function CategoryTile({ title, href, icon, tone }: Props) {
  return (
    <Link href={href} className="category-tile">
      <span className={`category-orb tone-${tone}`}>
        <CategoryIcon name={icon} className="category-icon" />
      </span>
      <span className="category-name">{title}</span>
      <span className="category-arrow" aria-hidden="true">←</span>
    </Link>
  );
}
