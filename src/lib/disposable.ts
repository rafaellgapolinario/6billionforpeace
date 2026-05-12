import 'server-only';
import list from 'disposable-email-domains';

/**
 * Wraps the disposable-email-domains list as a Set for O(1) lookup.
 * Loaded once per Function cold-start (~120k entries, ~3MB in memory).
 */
const DISPOSABLE_DOMAINS: Set<string> = new Set(list as string[]);

export function isDisposableEmail(email: string): boolean {
  const at = email.lastIndexOf('@');
  if (at < 0) return false;
  const domain = email.slice(at + 1).toLowerCase().trim();
  return DISPOSABLE_DOMAINS.has(domain);
}
