/**
 * Normalize avatar URIs to a safe value for React Native Image source.
 *
 * Supports:
 * - Supabase public URLs (http/https)
 * - Data URIs (data:image/...)
 * - Base64 strings (will be wrapped as data:image/png;base64,...)
 *
 * Future: When backend sends avatar URLs, this function will handle them transparently.
 */
export function normalizeAvatarUri(raw?: string): string | undefined {
  if (!raw) return undefined;

  const value = raw.trim();
  if (!value) return undefined;

  // Already a full URI (Supabase public URL, data URI, etc.)
  if (value.startsWith("data:")) return value;
  if (value.startsWith("http")) return value;

  // Bare base64 string – wrap as data URI
  const isBase64Like = /^[A-Za-z0-9+/=]+$/.test(value.replace(/\s+/g, ""));
  if (isBase64Like) return `data:image/png;base64,${value}`;

  return undefined;
}
