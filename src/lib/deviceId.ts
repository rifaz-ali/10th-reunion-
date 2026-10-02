const DEVICE_ID_KEY = '10th_d_reunion_device_id';
const SUBMITTED_CACHE_KEY = '10th_d_reunion_submitted_status';

export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'server_render_placeholder';

  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id || id.trim().length < 8) {
      const randomPart = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const timestamp = Date.now().toString(36);
      id = `dev_${timestamp}_${randomPart}`;
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch (err) {
    console.warn('LocalStorage unavailable for device ID generation:', err);
    return `fallback_dev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
}

export interface CachedSubmission {
  name: string;
  status: 'YES' | 'MAYBE' | 'NO';
  submittedAt: string;
}

export function getLocalSubmissionState(): CachedSubmission | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SUBMITTED_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setLocalSubmissionState(submission: CachedSubmission): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SUBMITTED_CACHE_KEY, JSON.stringify(submission));
  } catch (err) {
    console.warn('Could not save submission state to localStorage', err);
  }
}
