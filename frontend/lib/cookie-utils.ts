const CONSENT_KEY = "cookie_consent"

export type ConsentStatus = {
  essential: boolean
  analytics: boolean
  marketing: boolean
  timestamp: string
}

/**
 * Retrieves the current cookie consent status from local storage.
 * @returns {ConsentStatus | null} The consent status if found, otherwise null.
 */
export function getConsent(): ConsentStatus | null {
  if (typeof window === "undefined") {
    return null
  }
  try {
    const consentString = localStorage.getItem(CONSENT_KEY)
    if (consentString) {
      return JSON.parse(consentString)
    }
  } catch (error) {
    console.error("Failed to parse cookie consent from localStorage", error)
  }
  return null
}

/**
 * Sets the cookie consent status in local storage.
 * @param {ConsentStatus} consent The consent status to save.
 */
export function setConsent(consent: ConsentStatus): void {
  if (typeof window === "undefined") {
    return
  }
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent))
  } catch (error) {
    console.error("Failed to save cookie consent to localStorage", error)
  }
}

/**
 * Checks if consent has been given.
 * @returns {boolean} True if consent has been given, false otherwise.
 */
export function hasConsent(): boolean {
  return getConsent() !== null
}

/**
 * Clears the cookie consent from local storage.
 */
export function clearConsent(): void {
  if (typeof window === "undefined") {
    return
  }
  try {
    localStorage.removeItem(CONSENT_KEY)
  } catch (error) {
    console.error("Failed to clear cookie consent from localStorage", error)
  }
}
