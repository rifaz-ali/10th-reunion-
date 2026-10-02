import React, { useState } from 'react';
import { Share2, Check, MessageCircle, Copy } from 'lucide-react';

export const ShareButtons: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const getWebsiteUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  };

  const shareText = `10th D 2018 Batch Reunion ❤️\n\n14 November 2026\nRoyal Villa, Okketturu\n\nCome on, we're bringing the whole gang back together!`;

  const getWhatsAppShareUrl = () => {
    const url = getWebsiteUrl();
    const whatsappMessage = `10th D 2018 Batch Reunion ❤️\n\n14 November 2026\nRoyal Villa, Okketturu\n\nWe're bringing the whole gang back together!\n\nRSVP here:\n${url}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;
  };

  const handleShare = async () => {
    const url = getWebsiteUrl();

    if (navigator.share) {
      try {
        await navigator.share({
          title: '10th D 2018 Batch Reunion',
          text: shareText,
          url: url,
        });
        return;
      } catch (err: any) {
        // If user cancelled share sheet, don't show copy error
        if (err.name === 'AbortError') return;
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3500);
    } catch {
      // Manual fallback
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3500);
    }
  };

  return (
    <section className="py-12 bg-[#FAF4EA] border-t border-[#E8DEC8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        
        <h3 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#1F1C19] mb-2">
          Spread the Word to 10th D!
        </h3>
        <p className="text-sm sm:text-base text-[#5E544A] max-w-lg mx-auto mb-6">
          Make sure no one gets left behind. Drop the invite in your old school WhatsApp groups and contacts.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          
          {/* WhatsApp Share Button */}
          <a
            href={getWhatsAppShareUrl()}
            target="_blank"
            rel="noreferrer noopener"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#20BA5A] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Share in WhatsApp</span>
          </a>

          {/* Web Share / Copy Link Button */}
          <button
            onClick={handleShare}
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-[#F2EBE0] text-[#2C2722] border border-[#DCD0C0] text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#2E7D32]" />
                <span className="text-[#2E7D32]">Link copied! Send it to the 10th D group ❤️</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-[#C85A32]" />
                <span>Share Reunion</span>
              </>
            )}
          </button>

        </div>

        {/* Copy feedback notification */}
        {copied && (
          <div className="mt-3 text-xs font-semibold text-[#2E7D32] animate-in fade-in duration-150">
            Link copied! Send it to the 10th D group ❤️
          </div>
        )}

      </div>
    </section>
  );
};
