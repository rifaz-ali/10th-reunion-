import { getAllRSVPs, saveRSVP, findByDeviceId } from './storage.js';
import { RSVPRecord, RSVPStatus } from './types.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-password',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
};

function sanitizeString(str: string): string {
  return str
    .replace(/[<>]/g, '') // remove HTML tag brackets
    .trim();
}

export default async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: CORS_HEADERS,
    });
  }

  try {
    const body = await req.json();
    const { name, status, note, deviceId } = body || {};

    if (!name || typeof name !== 'string' || sanitizeString(name).length < 2) {
      return new Response(
        JSON.stringify({ error: 'Please enter your full name (minimum 2 characters).' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (name.length > 80) {
      return new Response(
        JSON.stringify({ error: 'Name is too long (maximum 80 characters).' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const cleanStatus = typeof status === 'string' ? status.trim().toUpperCase() : '';
    if (!['YES', 'MAYBE', 'NO'].includes(cleanStatus)) {
      return new Response(
        JSON.stringify({ error: 'Status must be YES, MAYBE, or NO.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (!deviceId || typeof deviceId !== 'string' || deviceId.trim().length < 5) {
      return new Response(
        JSON.stringify({ error: 'Invalid device identifier. Please refresh the page.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (deviceId.length > 128) {
      return new Response(
        JSON.stringify({ error: 'Invalid device identifier length.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Backend duplicate device check
    const existing = await findByDeviceId(deviceId);
    if (existing) {
      return new Response(
        JSON.stringify({
          error: 'DUPLICATE_DEVICE',
          message: 'Looks like you already submitted your RSVP. Each device can submit once.',
          existingRecord: {
            name: existing.name,
            status: existing.status,
            submittedAt: existing.submittedAt,
          },
        }),
        { status: 409, headers: CORS_HEADERS }
      );
    }

    const sanitizedName = sanitizeString(name);
    const sanitizedNote = typeof note === 'string' ? sanitizeString(note).slice(0, 500) : '';

    const newRecord: RSVPRecord = {
      id: `rsvp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: sanitizedName,
      status: cleanStatus as RSVPStatus,
      note: sanitizedNote,
      submittedAt: new Date().toISOString(),
      deviceId: deviceId.trim(),
    };

    await saveRSVP(newRecord);

    // Return safe data without deviceId
    return new Response(
      JSON.stringify({
        success: true,
        message: "You're on the list! ❤️ See you on 14 November.",
        record: {
          id: newRecord.id,
          name: newRecord.name,
          status: newRecord.status,
          note: newRecord.note,
          submittedAt: newRecord.submittedAt,
        },
      }),
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (err: any) {
    console.error('Error handling RSVP submission:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to process RSVP. Please try again.' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};
