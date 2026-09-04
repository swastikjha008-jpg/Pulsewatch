import type { Check, CreateMonitorInput, Monitor } from './types';

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
      cache: 'no-store',
    });
  } catch {
    throw new ApiError(`Can't reach the API at ${API_URL}. Is it running?`, 0);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.error ?? res.statusText, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  listMonitors: () => request<Monitor[]>('/monitors'),
  getMonitor: (id: string) => request<Monitor>(`/monitors/${id}`),
  listChecks: (id: string, limit = 50) => request<Check[]>(`/monitors/${id}/checks?limit=${limit}`),
  createMonitor: (input: CreateMonitorInput) =>
    request<Monitor>('/monitors', { method: 'POST', body: JSON.stringify(input) }),
  deleteMonitor: (id: string) => request<void>(`/monitors/${id}`, { method: 'DELETE' }),
};
