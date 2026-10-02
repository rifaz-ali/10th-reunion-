import { getAllRSVPs } from './storage.js';
import { PublicRSVPResponse } from './types.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
};

export default async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: CORS_HEADERS,
    });
  }

  try {
    const records = await getAllRSVPs();

    // Sort consistently by newest submission first
    const sorted = [...records].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    // Strip private device IDs and internal secrets
    const publicList: PublicRSVPResponse[] = sorted.map(r => ({
      id: r.id,
      name: r.name,
      status: r.status,
      note: r.note || '',
      submittedAt: r.submittedAt,
    }));

    return new Response(JSON.stringify(publicList), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (err: any) {
    console.error('Error fetching public responses:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to retrieve responses' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};
