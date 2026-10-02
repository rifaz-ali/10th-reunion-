import { getStore } from '@netlify/blobs';
import fs from 'node:fs';
import path from 'node:path';
import { RSVPRecord } from './types.js';

const STORE_NAME = '10th_d_reunion_rsvps';
const LOCAL_STORE_FILE = path.resolve(process.cwd(), '.data', 'rsvps.json');

function ensureLocalDir() {
  const dir = path.dirname(LOCAL_STORE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_STORE_FILE)) {
    // Start completely clean with zero dummy data as requested
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readLocalRecords(): RSVPRecord[] {
  try {
    ensureLocalDir();
    const data = fs.readFileSync(LOCAL_STORE_FILE, 'utf-8');
    return JSON.parse(data) || [];
  } catch (err) {
    console.error('Error reading local RSVP records:', err);
    return [];
  }
}

function writeLocalRecords(records: RSVPRecord[]) {
  try {
    ensureLocalDir();
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local RSVP records:', err);
  }
}

export async function getAllRSVPs(): Promise<RSVPRecord[]> {
  try {
    const store = getStore({ name: STORE_NAME, consistency: 'strong' });
    const { blobs } = await store.list();
    if (blobs && blobs.length > 0) {
      const records: RSVPRecord[] = [];
      for (const blob of blobs) {
        const item = await store.get(blob.key, { type: 'json' });
        if (item && typeof item === 'object' && 'deviceId' in item) {
          records.push(item as RSVPRecord);
        }
      }
      return records;
    }
  } catch (err) {
    // If running in dev without Netlify Blobs context or if store not found, use local store
  }
  return readLocalRecords();
}

export async function saveRSVP(record: RSVPRecord): Promise<void> {
  let savedInBlobs = false;
  try {
    const store = getStore({ name: STORE_NAME, consistency: 'strong' });
    await store.setJSON(record.id, record);
    savedInBlobs = true;
  } catch (err) {
    // Netlify Blobs not connected in local dev environment
  }

  // Always sync to local file store when in dev or as secondary safety
  const current = readLocalRecords();
  const idx = current.findIndex(r => r.id === record.id);
  if (idx >= 0) {
    current[idx] = record;
  } else {
    current.push(record);
  }
  writeLocalRecords(current);
}

export async function deleteRSVP(id: string): Promise<boolean> {
  let deleted = false;
  try {
    const store = getStore({ name: STORE_NAME });
    await store.delete(id);
    deleted = true;
  } catch (err) {
    //
  }

  const current = readLocalRecords();
  const filtered = current.filter(r => r.id !== id);
  if (filtered.length !== current.length) {
    writeLocalRecords(filtered);
    deleted = true;
  }
  return deleted;
}

export async function findByDeviceId(deviceId: string): Promise<RSVPRecord | null> {
  const all = await getAllRSVPs();
  return all.find(r => r.deviceId.trim().toLowerCase() === deviceId.trim().toLowerCase()) || null;
}
