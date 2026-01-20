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

  // Bare base64 string – wrap as data URI
  const isBase64Like = /^[A-Za-z0-9+/=]+$/.test(trimmed.replace(/\s+/g, ""));
  if (isBase64Like) return `data:image/png;base64,${trimmed}`;
  return undefined;
}
