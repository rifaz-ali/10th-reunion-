import { getAllRSVPs, deleteRSVP } from './storage.js';
import { RSVPStats } from './types.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-password',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

function verifyAdminAuth(req: Request): boolean {
  const configuredPassword = process.env.ADMIN_PASSWORD || 'reunion2018';
  
  const authHeader = req.headers.get('authorization') || '';
  const xAdminPassword = req.headers.get('x-admin-password') || '';

  let providedPassword = '';
  if (authHeader.startsWith('Bearer ')) {
    providedPassword = authHeader.slice(7).trim();
  } else if (authHeader) {
    providedPassword = authHeader.trim();
  } else if (xAdminPassword) {
    providedPassword = xAdminPassword.trim();
  }

  return Boolean(providedPassword && providedPassword === configuredPassword);
}

function generateCSV(records: any[]): string {
  const headers = ['ID', 'Full Name', 'RSVP Status', 'Message / Note', 'Submission Date (UTC)'];
  const rows = records.map(r => [
    `"${(r.id || '').replace(/"/g, '""')}"`,
    `"${(r.name || '').replace(/"/g, '""')}"`,
    `"${(r.status || '').replace(/"/g, '""')}"`,
    `"${(r.note || '').replace(/"/g, '""')}"`,
    `"${(r.submittedAt || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
}

export default async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  // Check admin authentication
  if (!verifyAdminAuth(req)) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized: Invalid admin credentials.' }),
      { status: 401, headers: CORS_HEADERS }
    );
  }

  const url = new URL(req.url);

  // Handle DELETE request to delete an entry
  if (req.method === 'DELETE') {
    const idToDelete = url.searchParams.get('id');
    if (!idToDelete) {
      return new Response(
        JSON.stringify({ error: 'Missing response ID to delete.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const success = await deleteRSVP(idToDelete);
    if (!success) {
      return new Response(
        JSON.stringify({ error: 'Record not found or already deleted.' }),
        { status: 404, headers: CORS_HEADERS }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Response deleted successfully.', id: idToDelete }),
      { status: 200, headers: CORS_HEADERS }
    );
  }

  // Handle GET request
  if (req.method === 'GET') {
    try {
      const records = await getAllRSVPs();
      const sorted = [...records].sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );

      // Support CSV export directly
      if (url.searchParams.get('export') === 'csv') {
        const csvContent = generateCSV(sorted);
        return new Response(csvContent, {
          status: 200,
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="10th_D_2018_Reunion_Responses.csv"',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      // Compute statistics
      const stats: RSVPStats = {
        yes: sorted.filter(r => r.status === 'YES').length,
        maybe: sorted.filter(r => r.status === 'MAYBE').length,
        no: sorted.filter(r => r.status === 'NO').length,
        total: sorted.length,
      };

      // Return admin payload
      return new Response(
        JSON.stringify({
          authenticated: true,
          stats,
          responses: sorted.map(r => ({
            id: r.id,
            name: r.name,
            status: r.status,
            note: r.note,
            submittedAt: r.submittedAt,
            // Masked device identifier for admin duplicate-audit only (e.g. "dev_...a4f2")
            deviceMask: r.deviceId ? `${r.deviceId.substring(0, 4)}...${r.deviceId.substring(r.deviceId.length - 4)}` : 'unknown',
          })),
        }),
        { status: 200, headers: CORS_HEADERS }
      );
    } catch (err: any) {
      console.error('Admin API error:', err);
      return new Response(
        JSON.stringify({ error: 'Failed to retrieve admin data.' }),
        { status: 500, headers: CORS_HEADERS }
      );
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: CORS_HEADERS,
  });
};
