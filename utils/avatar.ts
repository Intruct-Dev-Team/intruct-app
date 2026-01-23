/**
 * Avatar URI normalization utility
 *
 * Handles multiple avatar formats transparently:
 * - Supabase public URLs (http/https)
 * - Data URIs (data:image/...)
 * - Base64 strings (wrapped as data:image/png;base64,...)
 *
 * Returns a safe, RN-compatible URI or undefined if invalid.
 */

export function normalizeAvatarUri(raw?: string): string | undefined {
  if (!raw) return undefined;

  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  // Already a full URI
  if (trimmed.startsWith("data:")) return trimmed;
  if (trimmed.startsWith("http")) return trimmed;

  // Backend may return only the filename/key (e.g. "abc.png").
  // Convert it into a Supabase Storage public URL for the `avatars` bucket.
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseId = process.env.EXPO_PUBLIC_SUPABASE_ID;
  const supabaseBase = supabaseUrl?.trim()
    ? supabaseUrl.trim()
    : supabaseId?.trim()
      ? `https://${supabaseId.trim()}.supabase.co`
      : undefined;

  if (supabaseBase) {
    const looksLikeFilename = /^[^\s]+\.[A-Za-z0-9]+$/.test(trimmed);
    const looksLikePath = trimmed.includes("/");
    if (looksLikeFilename || looksLikePath) {
      const normalizedBase = supabaseBase.replace(/\/+$/, "");
      const objectPath = trimmed.startsWith("avatars/")
        ? trimmed.slice("avatars/".length)
        : trimmed;
      const encodedObjectPath = objectPath
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");
      return `${normalizedBase}/storage/v1/object/public/avatars/${encodedObjectPath}`;
    }
  }

  // Bare base64 string – wrap as data URI
  const isBase64Like = /^[A-Za-z0-9+/=]+$/.test(trimmed.replace(/\s+/g, ""));
  if (isBase64Like) return `data:image/png;base64,${trimmed}`;
  return undefined;
}
