const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://7922-202-62-62-131.ngrok-free.app'

export function resolveApiUrl(path: string | null | undefined): string | null {
  if (!path) {
    return null
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  return `${API_BASE_URL}${path}`
}
