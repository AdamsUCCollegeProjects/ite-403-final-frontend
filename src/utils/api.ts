/**
 * Extracts a list from an API response.
 *
 * Supports responses that are either:
 * - A raw array: `[...]`
 * - An object containing the array under the specified key:
 *   `{ [key]: [...] }`
 *
 * Returns an empty array when the expected list cannot be found.
 */
export function unwrapList<T>(response: unknown, key: string): T[] {
  if (Array.isArray(response)) {
    return response
  }

  if (response !== null && typeof response === 'object') {
    const nested = (response as Record<string, unknown>)[key]

    if (Array.isArray(nested)) {
      return nested as T[]
    }
  }

  return []
}
