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
