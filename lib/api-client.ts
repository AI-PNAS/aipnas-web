export type ApiResult<T> = {
  ok: boolean;
  status: number;
  data: T | null;
  message: string;
};

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
  timeoutMs = 15000,
): Promise<ApiResult<T>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {}),
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();

    if (contentType.includes('text/html') || text.trimStart().startsWith('<!DOCTYPE') || text.trimStart().startsWith('<html')) {
      return {
        ok: false,
        status: response.status,
        data: null,
        message: 'The server returned an HTML error page instead of JSON. Please retry or contact support.',
      };
    }

    let data: T | null = null;
    if (text) {
      try {
        data = JSON.parse(text) as T;
      } catch {
        return {
          ok: false,
          status: response.status,
          data: null,
          message: 'The server returned an invalid response.',
        };
      }
    }

    if (!response.ok) {
      const message =
        data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
          ? data.message
          : `Request failed (${response.status}).`;
      return { ok: false, status: response.status, data, message };
    }

    return { ok: true, status: response.status, data, message: 'Success' };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { ok: false, status: 0, data: null, message: 'The request timed out. Please try again.' };
    }
    return {
      ok: false,
      status: 0,
      data: null,
      message: 'Network error. Check your connection and try again.',
    };
  } finally {
    clearTimeout(timeout);
  }
}
