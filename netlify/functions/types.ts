export type RSVPStatus = 'YES' | 'MAYBE' | 'NO';

export interface RSVPRecord {
  id: string;
  name: string;
  status: RSVPStatus;
  note: string;
  submittedAt: string;
  deviceId: string;
}

export interface PublicRSVPResponse {
  id: string;
  name: string;
  status: RSVPStatus;
  note: string;
  submittedAt: string;
}

export interface RSVPStats {
  yes: number;
  maybe: number;
  no: number;
  total: number;
}
