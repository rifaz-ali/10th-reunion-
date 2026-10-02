import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Lock, Download, Trash2, RefreshCw, ArrowLeft, ShieldCheck, AlertCircle, Search, CheckCircle, Image as ImageIcon, Upload } from 'lucide-react';
import { getAdminData, deleteResponseAdmin, exportAdminCSV, AdminData, AdminResponseItem } from '../lib/api';

interface AdminPageProps {
  onBackToHome: () => void;
  photoSrc?: string;
  onUpdatePhoto?: (newSrc: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onBackToHome, photoSrc, onUpdatePhoto }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState<AdminData | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [itemToDelete, setItemToDelete] = useState<AdminResponseItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'YES' | 'MAYBE' | 'NO'>('ALL');

  // Attempt login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg('Please enter the admin password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const data = await getAdminData(password);
      setAdminData(data);
      setIsAuthenticated(true);
      sessionStorage.setItem('10th_d_admin_token', password);
    } catch (err: any) {
      setErrorMsg(err.message || 'Incorrect password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check saved session on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('10th_d_admin_token');
    if (saved) {
      setPassword(saved);
      setIsLoading(true);
      getAdminData(saved)
        .then((data) => {
          setAdminData(data);
          setIsAuthenticated(true);
        })
        .catch(() => {
          sessionStorage.removeItem('10th_d_admin_token');
        })
        .finally(() => setIsLoading(false));
    }
  }, []);

  const refreshData = async () => {
    if (!password) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await getAdminData(password);
      setAdminData(data);
      setSuccessMsg('List refreshed successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to refresh.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = async () => {
    if (!password) return;
    try {
      await exportAdminCSV(password);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to export CSV.');
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete || !password) return;
    setIsDeleting(true);
    try {
      await deleteResponseAdmin(itemToDelete.id, password);
      setItemToDelete(null);
      await refreshData();
      setSuccessMsg(`Deleted entry for "${itemToDelete.name}".`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete record.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('10th_d_admin_token');
    setPassword('');
    setIsAuthenticated(false);
    setAdminData(null);
  };

  // Filtered response list
  const filteredResponses = useMemo(() => {
    if (!adminData) return [];
    return adminData.responses.filter((r) => {
      const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.note && r.note.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFilter = statusFilter === 'ALL' || r.status === statusFilter;
      return matchesSearch && matchesFilter;
    });
  }, [adminData, searchQuery, statusFilter]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="bg-white p-8 rounded-2xl border border-[#E3D7C5] shadow-lg max-w-md w-full relative">
          <div className="w-24 h-6 washi-tape -mt-11 mb-6 mx-auto rounded-xs" />

          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs text-[#706456] hover:text-[#C85A32] mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to main invite</span>
          </button>

          <div className="w-12 h-12 rounded-xl bg-[#FAF0E6] flex items-center justify-center mx-auto mb-4 border border-[#E8D4C0]">
            <Lock className="w-6 h-6 text-[#C85A32]" />
          </div>

          <h2 className="text-2xl font-serif-display font-bold text-center text-[#1F1C19] mb-1">
            Admin Portal
          </h2>
          <p className="text-xs text-center text-[#6B5E51] mb-6">
            Enter the reunion organizer password to manage RSVPs and export attendee data.
          </p>

          {errorMsg && (
            <div className="p-3 mb-4 rounded-xl bg-[#FDF2F2] border border-[#F5CACA] text-[#9E2B2B] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="adminPass" className="block text-xs font-mono font-bold uppercase tracking-wider text-[#6B5F54] mb-1">
                Admin Password
              </label>
              <input
                id="adminPass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D8CEBF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
              />
              <p className="text-[11px] text-[#8C8074] mt-1 font-mono">
                Tip: Default password is <span className="font-bold">reunion2018</span> (or set ADMIN_PASSWORD in Netlify).
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#C85A32] hover:bg-[#B34720] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Unlock Admin Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const stats = adminData?.stats || { yes: 0, maybe: 0, no: 0, total: 0 };

  return (
    <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6">
      
      {/* Top Bar with actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E8DFC8]">
        <div>
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs text-[#706456] hover:text-[#C85A32] mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to main invite</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#1F1C19] flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-[#C85A32]" />
            <span>Reunion Admin Dashboard</span>
          </h1>
          <p className="text-xs text-[#7A6E61]">
            10th Standard D Section • 2018 Batch Passouts
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="px-3 py-2 bg-white border border-[#D8CEBF] text-xs font-semibold text-[#3D352D] rounded-lg hover:bg-[#F2ECE1] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-2 bg-white border border-[#D8CEBF] text-xs font-semibold text-[#8C2D2D] hover:bg-[#FDF2F2] rounded-lg transition-colors cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3 mb-6 rounded-xl bg-[#EBF7EE] border border-[#C6E8CE] text-[#22672B] text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 mb-6 rounded-xl bg-[#FDF2F2] border border-[#F5CACA] text-[#9E2B2B] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Stat Cards Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-[#E3D7C5] shadow-xs">
          <div className="text-xs font-mono font-bold uppercase text-[#7D7063]">
            Total Confirmed (YES)
          </div>
          <div className="text-3xl font-serif-display font-bold text-[#2E7D32] font-mono tabular-nums mt-1">
            {stats.yes}
          </div>
          <div className="text-[11px] text-[#8C8074] mt-1">
            {stats.total > 0 ? `${Math.round((stats.yes / stats.total) * 100)}% of total responses` : '0%'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E3D7C5] shadow-xs">
          <div className="text-xs font-mono font-bold uppercase text-[#7D7063]">
            Undecided (MAYBE)
          </div>
          <div className="text-3xl font-serif-display font-bold text-[#D97706] font-mono tabular-nums mt-1">
            {stats.maybe}
          </div>
          <div className="text-[11px] text-[#8C8074] mt-1">Follow up with them</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E3D7C5] shadow-xs">
          <div className="text-xs font-mono font-bold uppercase text-[#7D7063]">
            Declined (NO)
          </div>
          <div className="text-3xl font-serif-display font-bold text-[#64748B] font-mono tabular-nums mt-1">
            {stats.no}
          </div>
          <div className="text-[11px] text-[#8C8074] mt-1">Unable to attend</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E3D7C5] shadow-xs">
          <div className="text-xs font-mono font-bold uppercase text-[#7D7063]">
            Total Responses
          </div>
          <div className="text-3xl font-serif-display font-bold text-[#1F1C19] font-mono tabular-nums mt-1">
            {stats.total}
          </div>
          <div className="text-[11px] text-[#8C8074] mt-1">10th D Batch size</div>
        </div>
      </div>

      {/* Official Class Photo Management Card */}
      <div className="bg-white p-6 rounded-xl border border-[#E3D7C5] shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#FAF0E6] flex items-center justify-center border border-[#E8D4C0] shrink-0">
              <ImageIcon className="w-6 h-6 text-[#C85A32]" />
            </div>
            <div>
              <h3 className="font-serif-display text-lg font-bold text-[#1F1C19]">
                Official 10th D Batch Photo
              </h3>
              <p className="text-xs text-[#7A6E61]">
                Active on Home &amp; Memories sections: <span className="font-mono text-[#C85A32]">{photoSrc?.startsWith('data:') ? 'Custom uploaded image (saved)' : photoSrc || 'Default photo'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && onUpdatePhoto) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const result = event.target?.result as string;
                    if (result) {
                      onUpdatePhoto(result);
                      setSuccessMsg(`Uploaded and set "${file.name}" as the official photo.`);
                      setTimeout(() => setSuccessMsg(null), 4000);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-[#C85A32] hover:bg-[#B34720] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload New Photo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-white p-3 rounded-xl border border-[#E3D7C5]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8074]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or note..."
            className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#D8CEBF] rounded-lg text-xs placeholder-[#9E9488]"
          />
        </div>

        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          {(['ALL', 'YES', 'MAYBE', 'NO'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors whitespace-nowrap ${
                statusFilter === filter
                  ? 'bg-[#C85A32] text-white'
                  : 'bg-[#FAF7F2] text-[#554E46] hover:bg-[#ECE4D8]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Responses Table */}
      <div className="bg-white rounded-xl border border-[#E3D7C5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E3D7C5] text-[#6B5F54] font-mono uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">RSVP Status</th>
                <th className="py-3 px-4">Classmate Note</th>
                <th className="py-3 px-4">Submitted (UTC)</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE8DC]">
              {filteredResponses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#8C8074]">
                    No responses found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredResponses.map((r) => (
                  <tr key={r.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#1F1C19]">
                      {r.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase ${
                          r.status === 'YES'
                            ? 'bg-[#EBF7EE] text-[#22672B]'
                            : r.status === 'MAYBE'
                            ? 'bg-[#FFFBEB] text-[#B45309]'
                            : 'bg-[#F1F5F9] text-[#475569]'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs text-[#524B43] truncate">
                      {r.note || <span className="text-[#A39688] italic">—</span>}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#7A6E61]">
                      {new Date(r.submittedAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setItemToDelete(r)}
                        className="p-1.5 text-[#B91C1C] hover:bg-[#FDF2F2] rounded-lg transition-colors cursor-pointer"
                        title="Delete response"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setItemToDelete(null)}
        >
          <div
            className="bg-white max-w-sm w-full p-6 rounded-2xl shadow-xl border border-[#E3D7C5]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-[#FDF2F2] flex items-center justify-center mx-auto mb-3 text-[#B91C1C]">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif-display text-lg font-bold text-center text-[#1F1C19]">
              Delete this response?
            </h3>
            <p className="text-xs text-center text-[#6B5E51] mt-1 mb-5">
              Are you sure you want to remove the response from{' '}
              <strong className="text-[#1F1C19]">&ldquo;{itemToDelete.name}&rdquo;</strong>?
              This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2 text-xs font-semibold bg-[#EFE8DC] hover:bg-[#E4DBCB] text-[#332E28] rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2 text-xs font-semibold bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
