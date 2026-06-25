import useGlobal from '@/store/GlobalStore';
import { emitApiMutation } from '@/utils/app-events';
import { isJson } from '@/utils/is-json';

function showErr(err: unknown): void {
  const msg = err instanceof Error ? err.message : String(err);
  try {
    useGlobal().setMessage(msg);
  } catch {
    console.error(msg);
  }
}

function apiFetch(method?: string) {
  return async (
    input: RequestInfo,
    init: RequestInit = {}
  ): Promise<{ data: unknown; err: unknown }> => {
    try {
      const response = await fetch(input, {
        ...init,
        credentials: 'include',
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(init.headers as Record<string, string> | undefined)
        }
      });
      if (method !== 'GET') emitApiMutation();
      const text = await response.text();
      if (!response.ok) {
        throw new Error(`${response.status} - ${text || response.statusText}`);
      }
      return { data: isJson(text) ? JSON.parse(text) : text, err: false };
    } catch (err) {
      showErr(err);
      return { data: null, err };
    }
  };
}

export const api = {
  get: apiFetch('GET'),
  put: apiFetch('PUT'),
  post: apiFetch('POST'),
  delete: apiFetch('DELETE')
};
