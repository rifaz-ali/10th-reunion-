import { getOrCreateDeviceId, setLocalSubmissionState } from './deviceId';

export interface RSVPPayload {
  name: string;
  status: 'YES' | 'MAYBE' | 'NO';
  note?: string;
}

export interface PublicResponseItem {
  id: string;
  name: string;
  status: 'YES' | 'MAYBE' | 'NO';
  note?: string;
  submittedAt: string;
}

export interface AdminStats {
  yes: number;
  maybe: number;
  no: number;
  total: number;
}

export interface AdminResponseItem {
  id: string;
  name: string;
  status: 'YES' | 'MAYBE' | 'NO';
  note?: string;
  submittedAt: string;
  deviceMask: string;
}

export interface AdminData {
  authenticated: boolean;
  stats: AdminStats;
  responses: AdminResponseItem[];
}

export class DuplicateRSVPError extends Error {
  isDuplicate = true;
  constructor(message: string) {
    super(message);
    this.name = 'DuplicateRSVPError';
  }
}

export async function submitRSVP(data: RSVPPayload): Promise<{ success: boolean; message: string; record: any }> {
  const deviceId = getOrCreateDeviceId();

  const response = await fetch('/.netlify/functions/rsvp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: data.name.trim(),
      status: data.status,
      note: data.note?.trim() || '',
      deviceId,
    }),
  });

  const resJson = await response.json().catch(() => ({}));

  if (response.status === 409) {
    // Record duplicate state in localStorage to prevent unnecessary submissions
    setLocalSubmissionState({
      name: data.name,
      status: data.status,
      submittedAt: new Date().toISOString(),
    });
    throw new DuplicateRSVPError(
      resJson.message || "You've already submitted your response from this device."
    );
  }

  if (!response.ok) {
    throw new Error(resJson.error || 'Failed to submit your RSVP. Please try again.');
  }

  // Cache successful submission
  if (resJson.record) {
    setLocalSubmissionState({
      name: resJson.record.name,
      status: resJson.record.status,
      submittedAt: resJson.record.submittedAt,
    });
  }

  return resJson;
}

export async function getPublicResponses(): Promise<PublicResponseItem[]> {
  const response = await fetch('/.netlify/functions/responses', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to load reunion responses.');
  }

  return response.json();
}

export async function getAdminData(password: string): Promise<AdminData> {
  const response = await fetch('/.netlify/functions/admin', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${password.trim()}`,
      'x-admin-password': password.trim(),
      'Accept': 'application/json',
    },
  });

  if (response.status === 401) {
    throw new Error('Incorrect admin password. Please try again.');
  }

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    throw new Error(errorJson.error || 'Failed to fetch admin data.');
  }

  return response.json();
}

export async function deleteResponseAdmin(id: string, password: string): Promise<void> {
  const response = await fetch(`/.netlify/functions/admin?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${password.trim()}`,
      'x-admin-password': password.trim(),
    },
  });

  if (response.status === 401) {
    throw new Error('Unauthorized.');
  }

  if (!response.ok) {
    throw new Error('Failed to delete response.');
  }
}

export async function exportAdminCSV(password: string): Promise<void> {
  const response = await fetch('/.netlify/functions/admin?export=csv', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${password.trim()}`,
      'x-admin-password': password.trim(),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to generate CSV export.');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `10th_D_2018_Reunion_Responses_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
