// Set SITE_URL only after the final public domain is connected.
export function getSiteOrigin(): string | null {
  const value = process.env.SITE_URL;
  if (!value) return null;

  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function absoluteSiteUrl(path: string): string | null {
  const origin = getSiteOrigin();
  return origin ? new URL(path, origin).toString() : null;
}

export function canonicalMetadata(path: string) {
  const url = absoluteSiteUrl(path);
  return url ? { alternates: { canonical: url } } : {};
}
