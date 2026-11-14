import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found container">
      <span className="eyebrow">404</span>
      <h1>העמוד לא נמצא</h1>
      <Link href="/catalog" className="button button-primary">חזרה לקטלוג</Link>
    </section>
  );
}
