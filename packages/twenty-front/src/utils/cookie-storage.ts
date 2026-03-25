import Cookies from 'js-cookie';

/**
 * CookieStorage with in-memory fallback for third-party iframe contexts.
 *
 * When the app runs inside an iframe on a different origin (e.g., TAU admin
 * embedding the CRM panel), browsers block third-party cookie access.
 * In that case, we fall back to an in-memory store so that tokens set
 * during the verify flow remain accessible to the Apollo client within
 * the same page session.
 *
 * In production, both apps share *.taubot.ai (same-site), so cookies
 * work normally. The in-memory fallback is primarily for dev environments
 * where origins differ.
 */
class CookieStorage {
  private keys: Set<string> = new Set();
  private memoryStore: Map<string, string> = new Map();
  private isThirdPartyContext: boolean;

  constructor() {
    this.isThirdPartyContext = this.detectThirdPartyContext();
  }

  private detectThirdPartyContext(): boolean {
    try {
      return window !== window.parent;
    } catch {
      // Cross-origin parent access throws — definitely third-party
      return true;
    }
  }

  getItem(key: string): string | undefined {
    // Always try cookie first
    const cookieValue = Cookies.get(key);
    if (cookieValue) {
      return cookieValue;
    }

    // Fall back to memory store in iframe contexts
    if (this.isThirdPartyContext) {
      return this.memoryStore.get(key);
    }

    return undefined;
  }

  setItem(
    key: string,
    value: string,
    attributes?: Cookies.CookieAttributes,
  ): void {
    this.keys.add(key);

    const secureAttributes = {
      secure: window.location.protocol === 'https:',
      sameSite: 'lax' as const,
      ...attributes,
    };

    // Try to set cookie (may silently fail in third-party context)
    Cookies.set(key, value, secureAttributes);

    // Always store in memory as fallback
    if (this.isThirdPartyContext) {
      this.memoryStore.set(key, value);
    }
  }

  removeItem(key: string, attributes?: Cookies.CookieAttributes): void {
    this.keys.delete(key);
    Cookies.remove(key, attributes);
    this.memoryStore.delete(key);
  }

  clear(): void {
    this.keys.forEach((key) => this.removeItem(key));
    this.memoryStore.clear();
  }
}

export const cookieStorage = new CookieStorage();
