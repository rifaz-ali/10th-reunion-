import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, HelpCircle, XCircle, Send, CheckCircle2, AlertCircle, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { submitRSVP, DuplicateRSVPError } from '../lib/api';
import { getLocalSubmissionState, CachedSubmission } from '../lib/deviceId';

interface RSVPSectionProps {
  onRSVPSuccess?: () => void;
  onViewEveryone?: () => void;
  preselectedStatus?: 'YES' | 'MAYBE' | 'NO';
}

export const RSVPSection: React.FC<RSVPSectionProps> = ({
  onRSVPSuccess,
  onViewEveryone,
  preselectedStatus = 'YES',
}) => {
  const [fullName, setFullName] = useState('');
  const [status, setStatus] = useState<'YES' | 'MAYBE' | 'NO'>(preselectedStatus);
  const [note, setNote] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDuplicate, setIsDuplicate] = useState(false);

  // Success state
  const [submittedData, setSubmittedData] = useState<CachedSubmission | null>(null);

  // Check on mount if device has already submitted
  useEffect(() => {
    const existing = getLocalSubmissionState();
    if (existing) {
      setSubmittedData(existing);
    }
  }, []);

  useEffect(() => {
    if (preselectedStatus) {
      setStatus(preselectedStatus);
    }
  }, [preselectedStatus]);

  const triggerConfettiCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C85A32', '#E0A938', '#4E7D55', '#FAF7F2'],
      });
    } catch {
      // Ignore if canvas confetti fails in sandbox
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsDuplicate(false);

    const trimmedName = fullName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage('Please enter your full name as everyone knew you in school.');
      return;
    }

    if (trimmedName.length > 80) {
      setErrorMessage('Name must be 80 characters or fewer.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitRSVP({
        name: trimmedName,
        status,
        note: note.trim(),
      });

      const submissionInfo: CachedSubmission = {
        name: trimmedName,
        status,
        submittedAt: new Date().toISOString(),
      };

      setSubmittedData(submissionInfo);
      setIsSubmitting(false);

      if (status === 'YES') {
        triggerConfettiCelebration();
      }

      if (onRSVPSuccess) {
        onRSVPSuccess();
      }
    } catch (err: any) {
      setIsSubmitting(false);
      if (err instanceof DuplicateRSVPError || err.isDuplicate) {
        setIsDuplicate(true);
        setErrorMessage(
          err.message || 'Looks like you already submitted your RSVP. Each device can submit once.'
        );
      } else {
        setErrorMessage(err.message || 'Unable to submit RSVP. Please check your connection and try again.');
      }
    }
  };

  return (
    <section id="rsvp" className="py-20 sm:py-28 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-[#8A7969] uppercase mb-2">
            <Heart className="w-3.5 h-3.5 text-[#C85A32] fill-[#C85A32]" />
            <span>CONFIRM YOUR ATTENDANCE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif-display font-bold text-[#1F1C19] tracking-tight">
            Are you in?
          </h2>
          <p className="text-base sm:text-lg text-[#5A524A] mt-3">
            Tell us your status. We want to know who&apos;s coming so we can plan the reunion properly.
          </p>
        </div>

        {/* Confirmation State if Submitted */}
        {submittedData ? (
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#E0D5C3] shadow-lg text-center max-w-2xl mx-auto relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Washi tape decor */}
            <div className="w-32 h-6 washi-tape -mt-9 mb-6 mx-auto rounded-xs" />

            <div className="w-16 h-16 bg-[#F4EDE2] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E5DACB]">
              <CheckCircle2 className="w-9 h-9 text-[#C85A32]" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#1F1C19] mb-2">
              You&apos;re on the list! ❤️
            </h3>

            <p className="text-lg text-[#4E443B] font-medium mb-1">
              {submittedData.name}
            </p>

            <div className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full mb-4 bg-[#FAF0E6] text-[#C85A32] border border-[#E8D4C0]">
              Status: {submittedData.status === 'YES' ? "YES, I'm coming" : submittedData.status === 'MAYBE' ? 'MAYBE' : "Can't make it"}
            </div>

            <p className="text-base text-[#5A524A] mb-8 max-w-md mx-auto">
              See you on 14 November at Royal Villa, Okketturu. Get ready to turn back the clock!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[#EAE2D5]">
              <button
                onClick={onViewEveryone}
                className="w-full sm:w-auto px-6 py-3 bg-[#C85A32] hover:bg-[#B34720] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>See Who&apos;s Coming</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* RSVP Form Card */
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#E3D7C5] shadow-md max-w-2xl mx-auto relative">
            
            {/* Washi tape topper */}
            <div className="w-32 h-6 washi-tape -mt-9 sm:-mt-13 mb-6 mx-auto rounded-xs opacity-90" />

            {/* Duplicate Notice or General Error */}
            {errorMessage && (
              <div
                className={`p-4 rounded-xl mb-6 text-sm flex items-start gap-3 ${
                  isDuplicate
                    ? 'bg-[#FFF8E6] text-[#7A5B15] border border-[#F2DEB0]'
                    : 'bg-[#FDF2F2] text-[#9E2B2B] border border-[#F5CACA]'
                }`}
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">
                    {isDuplicate ? 'Looks like you already submitted your RSVP.' : 'Please review your entry:'}
                  </div>
                  <div className="mt-0.5">{errorMessage}</div>
                  {isDuplicate && (
                    <div className="text-xs text-[#8F722C] mt-1 font-mono">
                      Each device can submit once.
                    </div>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Field 1: Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-mono font-bold uppercase tracking-wider text-[#6B5F54] mb-1.5">
                  1. Full Name <span className="text-[#C85A32]">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  maxLength={80}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rifaz / Anjali Shenoy"
                  className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#D8CEBF] rounded-xl text-[#1F1C19] placeholder-[#9E9488] text-base focus:outline-none focus:ring-2 focus:ring-[#C85A32] focus:border-transparent transition-all"
                />
                <p className="text-[11px] text-[#8C8074] mt-1">
                  Use the name classmates remember you by from our 10th D roll call.
                </p>
              </div>

              {/* Field 2: RSVP Status */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#6B5F54] mb-2">
                  2. Your Status <span className="text-[#C85A32]">*</span>
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* YES */}
                  <button
                    type="button"
                    onClick={() => setStatus('YES')}
                    className={`p-3.5 rounded-xl border text-left flex items-center sm:flex-col sm:items-center sm:text-center justify-between sm:justify-center gap-2 cursor-pointer transition-all ${
                      status === 'YES'
                        ? 'border-[#C85A32] bg-[#FAF0E8] text-[#C85A32] font-semibold ring-1 ring-[#C85A32]'
                        : 'border-[#E0D5C3] bg-[#FAF7F2] text-[#554E46] hover:bg-[#F2EDE4]'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${status === 'YES' ? 'fill-[#C85A32] text-[#C85A32]' : 'text-[#8A7969]'}`} />
                    <span className="text-sm">YES, I&apos;m coming ❤️</span>
                  </button>

                  {/* MAYBE */}
                  <button
                    type="button"
                    onClick={() => setStatus('MAYBE')}
                    className={`p-3.5 rounded-xl border text-left flex items-center sm:flex-col sm:items-center sm:text-center justify-between sm:justify-center gap-2 cursor-pointer transition-all ${
                      status === 'MAYBE'
                        ? 'border-[#D97706] bg-[#FFFBEB] text-[#B45309] font-semibold ring-1 ring-[#D97706]'
                        : 'border-[#E0D5C3] bg-[#FAF7F2] text-[#554E46] hover:bg-[#F2EDE4]'
                    }`}
                  >
                    <HelpCircle className={`w-5 h-5 ${status === 'MAYBE' ? 'text-[#B45309]' : 'text-[#8A7969]'}`} />
                    <span className="text-sm">MAYBE 🤔</span>
                  </button>

                  {/* NO */}
                  <button
                    type="button"
                    onClick={() => setStatus('NO')}
                    className={`p-3.5 rounded-xl border text-left flex items-center sm:flex-col sm:items-center sm:text-center justify-between sm:justify-center gap-2 cursor-pointer transition-all ${
                      status === 'NO'
                        ? 'border-[#64748B] bg-[#F1F5F9] text-[#334155] font-semibold ring-1 ring-[#64748B]'
                        : 'border-[#E0D5C3] bg-[#FAF7F2] text-[#554E46] hover:bg-[#F2EDE4]'
                    }`}
                  >
                    <XCircle className={`w-5 h-5 ${status === 'NO' ? 'text-[#334155]' : 'text-[#8A7969]'}`} />
                    <span className="text-sm">NO, can&apos;t make it ❌</span>
                  </button>

                </div>
              </div>

              {/* Field 3: Optional Message/Note */}
              <div>
                <label htmlFor="note" className="block text-xs font-mono font-bold uppercase tracking-wider text-[#6B5F54] mb-1.5 flex items-center justify-between">
                  <span>3. Optional Message / Note</span>
                  <span className="text-[11px] font-normal text-[#8C8074]">Optional</span>
                </label>
                <textarea
                  id="note"
                  rows={3}
                  maxLength={500}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Share an inside joke, message for the gang, or who you're excited to see..."
                  className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#D8CEBF] rounded-xl text-[#1F1C19] placeholder-[#9E9488] text-sm focus:outline-none focus:ring-2 focus:ring-[#C85A32] focus:border-transparent transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#C85A32] hover:bg-[#B34720] text-white text-base font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <span>Recording your response...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SUBMIT RSVP ❤️</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <span className="text-xs text-[#8A7B6E] font-mono">
                  Each device can submit once. Data stored securely.
                </span>
              </div>

            </form>
          </div>
        )}

      </div>
    </section>
  );
};
