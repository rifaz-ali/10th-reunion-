import React, { useState } from 'react';
import { Calendar, MapPin, Heart, Users, Sparkles, ZoomIn } from 'lucide-react';

interface HeroProps {
  onRSVPClick: () => void;
  onSeeWhoIsComing: () => void;
  photoSrc?: string;
  onOpenPhotoModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onRSVPClick,
  onSeeWhoIsComing,
  photoSrc = 'IMG_20261002_070755959_HDR.jpg',
  onOpenPhotoModal,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
      {/* Subtle vintage school background motifs */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#F2E8D8]/50 to-transparent pointer-events-none rounded-3xl blur-2xl" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            
            {/* Batch Header Tag & Nostalgic Stamp */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-xs font-bold tracking-widest uppercase bg-[#EADCC8] text-[#4A3E31] px-3 py-1 rounded-sm border border-[#DACBB5] font-mono">
                10TH D • 2018 BATCH REUNION
              </span>
              <span className="font-handwriting text-[#C85A32] text-xl font-bold tracking-wide transform -rotate-3">
                8 years later!
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-6xl font-bold tracking-tight text-[#1F1C19] font-serif-display leading-[1.08] mb-6">
              Same class. <br />
              <span className="italic font-normal text-[#C85A32]">New stories.</span>
            </h1>

            {/* Supporting Prose */}
            <p className="text-base sm:text-lg text-[#5A524A] leading-relaxed max-w-xl mb-7 font-normal">
              Years passed. Life changed. But the people who made those school days unforgettable are still the same. It&apos;s time to bring the gang together again.
            </p>

            {/* Event Key Details Box */}
            <div className="w-full max-w-lg p-4 sm:p-5 bg-white/85 border border-[#E4DCCE] rounded-xl shadow-xs mb-7 backdrop-blur-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FAF0E6] flex items-center justify-center shrink-0 border border-[#E8D4C0]">
                    <Calendar className="w-5 h-5 text-[#C85A32]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#857B72]">Date &amp; Time</div>
                    <div className="text-sm font-semibold text-[#1F1C19]">14 November 2026</div>
                    <div className="text-xs text-[#857B72]">5:00 PM IST onwards</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FAF0E6] flex items-center justify-center shrink-0 border border-[#E8D4C0]">
                    <MapPin className="w-5 h-5 text-[#C85A32]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#857B72]">Venue</div>
                    <div className="text-sm font-semibold text-[#1F1C19]">Royal Villa</div>
                    <div className="text-xs text-[#857B72]">Okketturu</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <button
                onClick={onRSVPClick}
                className="px-8 py-3.5 bg-[#C85A32] hover:bg-[#B34720] text-white text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer transform active:scale-[0.98]"
              >
                <Heart className="w-5 h-5 fill-white" />
                <span>YES, I&apos;M COMING ❤️</span>
              </button>

              <button
                onClick={onSeeWhoIsComing}
                className="px-6 py-3.5 bg-white hover:bg-[#F2ECE1] text-[#332E29] border border-[#D8CEBF] text-base font-medium rounded-xl shadow-xs hover:border-[#BFB2A0] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Users className="w-5 h-5 text-[#C85A32]" />
                <span>SEE WHO&apos;S COMING</span>
              </button>
            </div>

            {/* Reassurance */}
            <div className="mt-4 flex items-center gap-2 text-[#857B72] text-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E0A938]" />
              <span>Takes less than 30 seconds to RSVP</span>
            </div>

          </div>

          {/* Right Column: The One Authentic Class Photo */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            
            <div
              onClick={onOpenPhotoModal}
              className="relative w-full max-w-lg polaroid-card p-3 sm:p-4 rounded-sm shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
            >
              {/* Scotch tape styling on top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-7 washi-tape rotate-1 rounded-xs pointer-events-none z-10" />

              {/* Photo Area */}
              <div className="relative aspect-[4/3] bg-[#2E2822] rounded-xs overflow-hidden flex items-center justify-center border border-[#E0D5C3]">
                <img
                  src={imageError ? '/class_photo_fallback.svg' : photoSrc}
                  alt="10th Standard D Section 2018 Passouts official class group photo"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold backdrop-blur-xs">
                  <ZoomIn className="w-4 h-4" />
                  <span>Click to view full photo</span>
                </div>
              </div>

              {/* Polaroid Bottom handwritten caption */}
              <div className="pt-3 pb-1 px-1 flex items-center justify-between">
                <div>
                  <p className="font-handwriting text-2xl sm:text-3xl text-[#2F2924] font-bold leading-none tracking-tight">
                    &ldquo;10th D Section • 2018&rdquo;
                  </p>
                  <p className="text-[11px] text-[#8C8074] font-mono mt-1">
                    Teachers &amp; Classmates • The Official Batch Photo
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold bg-[#FAF0E6] text-[#C85A32] px-2.5 py-1 rounded border border-[#EAD3C0]">
                    ❤️ 2018 Passout
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
