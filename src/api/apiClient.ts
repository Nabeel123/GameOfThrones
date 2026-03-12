import type { ZodSchema } from 'zod'
import { ZodError } from 'zod'
import { QUERY_CONFIG } from '@/config/api'

type ApiErrorType = 'network' | 'timeout' | 'parse' | 'validation' | 'server'

/** Caught exception or error (avoids `unknown`) */
type CaughtError = Error | object

export class ApiError extends Error {
  constructor(
    public readonly type: ApiErrorType,
    message: string,
    public readonly status?: number,
    public readonly cause?: CaughtError
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(url: string, schema: ZodSchema<T>): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), QUERY_CONFIG.fetchTimeout)

  let response: Response
  try {
    response = await fetch(url, { signal: controller.signal })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError(
        'timeout',
        `Request timed out after ${QUERY_CONFIG.fetchTimeout}ms`,
        undefined,
        err
      )
    }
    throw new ApiError('network', 'Network request failed', undefined, err as CaughtError)
  } finally {
    clearTimeout(timeoutId)
  }

  if (!response.ok) {
    throw new ApiError('server', `Server responded with ${response.status}`, response.status)
  }

  type JsonLike = object | string | number | boolean | null
  let json: JsonLike
  try {
    json = (await response.json()) as JsonLike
  } catch (err) {
    throw new ApiError('parse', 'Failed to parse response as JSON', undefined, err as CaughtError)
  }

  try {
    return schema.parse(json)
  } catch (err) {
    const detail = err instanceof ZodError ? `: ${err.message}` : ''
    throw new ApiError(
      'validation',
      `Response validation failed${detail}`,
      undefined,
      err as CaughtError
    )
  }
}
