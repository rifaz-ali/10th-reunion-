import React, { useState, useEffect, useMemo } from 'react';
import { Users, Search, RefreshCw, Heart, MessageSquare, ArrowLeft, Clock } from 'lucide-react';
import { getPublicResponses, PublicResponseItem } from '../lib/api';

interface EveryonePageProps {
  onBackToHome: () => void;
  onGoToRSVP: () => void;
}

export const EveryonePage: React.FC<EveryonePageProps> = ({ onBackToHome, onGoToRSVP }) => {
  const [responses, setResponses] = useState<PublicResponseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'YES' | 'MAYBE' | 'NO'>('ALL');

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await getPublicResponses();
      setResponses(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to load attendees list. Please refresh.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute live stats
  const stats = useMemo(() => {
    return {
      yes: responses.filter(r => r.status === 'YES').length,
      maybe: responses.filter(r => r.status === 'MAYBE').length,
      no: responses.filter(r => r.status === 'NO').length,
      total: responses.length,
    };
  }, [responses]);

  // Filtered and searched list (sorted newest first)
  const filteredList = useMemo(() => {
    return responses.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.note && item.note.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter = statusFilter === 'ALL' || item.status === statusFilter;

      return matchesSearch && matchesFilter;
    });
  }, [responses, searchQuery, statusFilter]);

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="py-10 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Top back navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#5A5147] hover:text-[#C85A32] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event Details</span>
        </button>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 text-xs text-[#706456] hover:text-[#22201E] px-2.5 py-1 rounded bg-[#EFE8DC] transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-[#8A7969] uppercase mb-2">
          <Users className="w-3.5 h-3.5 text-[#C85A32]" />
          <span>ATTENDANCE ROLL CALL</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif-display font-bold text-[#1F1C19] tracking-tight">
          Who&apos;s coming?
        </h1>
        <p className="text-base sm:text-lg text-[#5A524A] mt-2">
          The 10th D gang is getting back together.
        </p>
      </div>

      {/* Live RSVP Statistics Banner */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-10 max-w-2xl mx-auto">
        
        {/* YES Coming */}
        <button
          onClick={() => setStatusFilter(statusFilter === 'YES' ? 'ALL' : 'YES')}
          className={`p-4 rounded-xl text-center border transition-all cursor-pointer ${
            statusFilter === 'YES'
              ? 'bg-[#FAF0E6] border-[#C85A32] ring-2 ring-[#C85A32]/30 shadow-xs'
              : 'bg-white border-[#E4D8C6] hover:border-[#D0C0AA]'
          }`}
        >
          <div className="text-2xl sm:text-4xl font-serif-display font-bold text-[#2E7D32] font-mono tabular-nums">
            {stats.yes}
          </div>
          <div className="text-xs sm:text-sm font-semibold text-[#38312A] mt-1 flex items-center justify-center gap-1">
            <span>✅</span>
            <span>Coming</span>
          </div>
        </button>

        {/* MAYBE */}
        <button
          onClick={() => setStatusFilter(statusFilter === 'MAYBE' ? 'ALL' : 'MAYBE')}
          className={`p-4 rounded-xl text-center border transition-all cursor-pointer ${
            statusFilter === 'MAYBE'
              ? 'bg-[#FFFBEB] border-[#D97706] ring-2 ring-[#D97706]/30 shadow-xs'
              : 'bg-white border-[#E4D8C6] hover:border-[#D0C0AA]'
          }`}
        >
          <div className="text-2xl sm:text-4xl font-serif-display font-bold text-[#D97706] font-mono tabular-nums">
            {stats.maybe}
          </div>
          <div className="text-xs sm:text-sm font-semibold text-[#38312A] mt-1 flex items-center justify-center gap-1">
            <span>🤔</span>
            <span>Maybe</span>
          </div>
        </button>

        {/* NO Can't Come */}
        <button
          onClick={() => setStatusFilter(statusFilter === 'NO' ? 'ALL' : 'NO')}
          className={`p-4 rounded-xl text-center border transition-all cursor-pointer ${
            statusFilter === 'NO'
              ? 'bg-[#F1F5F9] border-[#64748B] ring-2 ring-[#64748B]/30 shadow-xs'
              : 'bg-white border-[#E4D8C6] hover:border-[#D0C0AA]'
          }`}
        >
          <div className="text-2xl sm:text-4xl font-serif-display font-bold text-[#64748B] font-mono tabular-nums">
            {stats.no}
          </div>
          <div className="text-xs sm:text-sm font-semibold text-[#38312A] mt-1 flex items-center justify-center gap-1">
            <span>❌</span>
            <span>Can&apos;t Come</span>
          </div>
        </button>

      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-8">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8074]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search classmate name..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#D8CEBF] rounded-xl text-sm placeholder-[#9E9488] text-[#1F1C19] focus:outline-none focus:ring-2 focus:ring-[#C85A32] focus:border-transparent transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#EFE9DF] rounded-xl w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'ALL'
                ? 'bg-white text-[#1F1C19] shadow-xs'
                : 'text-[#695E52] hover:text-[#1F1C19]'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setStatusFilter('YES')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'YES'
                ? 'bg-white text-[#2E7D32] shadow-xs'
                : 'text-[#695E52] hover:text-[#1F1C19]'
            }`}
          >
            Coming ({stats.yes})
          </button>
          <button
            onClick={() => setStatusFilter('MAYBE')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'MAYBE'
                ? 'bg-white text-[#D97706] shadow-xs'
                : 'text-[#695E52] hover:text-[#1F1C19]'
            }`}
          >
            Maybe ({stats.maybe})
          </button>
          <button
            onClick={() => setStatusFilter('NO')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'NO'
                ? 'bg-white text-[#64748B] shadow-xs'
                : 'text-[#695E52] hover:text-[#1F1C19]'
            }`}
          >
            Can&apos;t ({stats.no})
          </button>
        </div>

      </div>

      {/* Error state */}
      {errorMessage && (
        <div className="p-4 mb-6 rounded-xl bg-[#FDF2F2] border border-[#F5CACA] text-[#9E2B2B] text-sm text-center">
          {errorMessage}
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white p-5 rounded-xl border border-[#E8DEC8] animate-pulse h-36" />
          ))}
        </div>
      ) : filteredList.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl p-10 border border-[#E8DEC8] text-center max-w-md mx-auto my-8">
          <div className="w-14 h-14 bg-[#FAF0E6] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E8D4C0]">
            <Users className="w-7 h-7 text-[#C85A32]" />
          </div>
          <h3 className="font-serif-display text-xl font-bold text-[#1F1C19] mb-1">
            {searchQuery ? 'No classmates match your search' : 'No responses yet!'}
          </h3>
          <p className="text-sm text-[#6B5E51] mb-6">
            {searchQuery
              ? 'Try searching with a different first name or nickname.'
              : 'Be the first one from 10th D to RSVP and inspire the whole class!'}
          </p>
          <button
            onClick={onGoToRSVP}
            className="px-6 py-2.5 bg-[#C85A32] hover:bg-[#B34720] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Submit Your RSVP ❤️
          </button>
        </div>
      ) : (
        /* Attendee Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredList.map((person) => {
            const isComing = person.status === 'YES';
            const isMaybe = person.status === 'MAYBE';

            return (
              <div
                key={person.id}
                className="bg-white p-5 rounded-xl border border-[#E4D8C6] shadow-xs hover:border-[#D0C0AA] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-serif-display font-bold text-[#1F1C19] leading-snug">
                      {person.name}
                    </h3>

                    {/* Status Badge */}
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                        isComing
                          ? 'bg-[#EBF7EE] text-[#22672B] border border-[#C6E8CE]'
                          : isMaybe
                          ? 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                          : 'bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]'
                      }`}
                    >
                      {isComing ? '✅ COMING' : isMaybe ? '🤔 MAYBE' : '❌ NOT COMING'}
                    </span>
                  </div>

                  {/* Optional Note / Message */}
                  {person.note ? (
                    <p className="text-xs text-[#524B43] italic bg-[#FAF7F2] p-2.5 rounded-lg border border-[#EDE4D6] mt-2 mb-3 leading-relaxed">
                      &ldquo;{person.note}&rdquo;
                    </p>
                  ) : (
                    <div className="h-2" />
                  )}
                </div>

                {/* Card footer date */}
                <div className="pt-2 border-t border-[#F0EAE0] flex items-center justify-between text-[11px] text-[#8C8074]">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-[#A89A8C]" />
                    <span>{formatRelativeTime(person.submittedAt)}</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#A89A8C]">
                    10th D Batch &apos;18
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating prompt to RSVP */}
      <div className="mt-14 p-6 bg-[#FAF0E6] rounded-2xl border border-[#E8DAC6] text-center max-w-xl mx-auto">
        <h4 className="font-serif-display text-xl font-bold text-[#1F1C19] mb-1">
          Haven&apos;t submitted your RSVP yet?
        </h4>
        <p className="text-sm text-[#5C5248] mb-4">
          Add your name to the list so your old bench-partners know you&apos;re coming!
        </p>
        <button
          onClick={onGoToRSVP}
          className="px-6 py-2.5 bg-[#C85A32] hover:bg-[#B34720] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          RSVP for the Reunion ❤️
        </button>
      </div>

    </div>
  );
};
