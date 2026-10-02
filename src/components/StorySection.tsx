import React from 'react';
import { Sparkles, Heart, Quote } from 'lucide-react';

export const StorySection: React.FC = () => {
  return (
    <section id="story" className="py-20 sm:py-28 bg-[#FAF7F2] relative border-t border-[#E8DFD0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-[#8A7969] uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C85A32]" />
            <span>THE 10TH D JOURNEY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif-display font-bold text-[#1F1C19] tracking-tight">
            How 8 Years Flew By
          </h2>
          <div className="w-12 h-1 bg-[#C85A32] mx-auto mt-4 rounded-full" />
        </div>

        {/* Narrative Box with Vintage Editorial Layout */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#E3D7C5] shadow-xs relative">
          
          <Quote className="w-10 h-10 text-[#E0D3C0] mb-4" />

          <div className="space-y-6 text-[#453E37] text-base sm:text-lg leading-relaxed font-sans">
            <p className="first-letter:text-5xl first-letter:font-serif-display first-letter:font-bold first-letter:text-[#C85A32] first-letter:float-left first-letter:mr-3 first-letter:leading-none">
              In March 2018, we walked out of our 10th Standard D classroom for what we thought was just another summer vacation. We signed uniform shirts with ballpoint pens, took shaky phone selfies, promised to stay in touch forever, and went our separate ways.
            </p>

            <p>
              Then adulthood happened. Pre-university, college degrees, new cities, first jobs, career pressures, and growing responsibilities. WhatsApp groups that once buzzed with 500 messages a day slowly turned quiet, reserved for birthday wishes and festival greetings.
            </p>

            <p>
              Yet, whenever any two of us cross paths, whether at an airport, a wedding, or a local tea stall, the years melt away in three seconds. The same laughter returns. The same old nicknames come alive.
            </p>

            <div className="p-5 bg-[#FAF0E6] rounded-xl border border-[#E8D4C0] my-6">
              <p className="font-serif-display italic text-[#241F1A] text-lg sm:text-xl text-center">
                &ldquo;Because 10th D wasn&apos;t just a classroom section. It was the golden era when our worries were small and our friendships were infinite.&rdquo;
              </p>
            </div>

            <p>
              On <strong>Saturday, 14 November 2026</strong>, at <strong>Royal Villa, Okketturu</strong>, we are putting our busy adult routines on pause. No titles, no resumes, no pretenses — just the 10th D batch back together under one roof.
            </p>
          </div>

          {/* Signoff */}
          <div className="mt-8 pt-6 border-t border-[#EAE1D3] flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="font-handwriting text-2xl sm:text-3xl text-[#C85A32] font-bold">
                See you across the table!
              </div>
              <div className="text-xs text-[#8C8074] font-mono mt-0.5">
                The 10th D Reunion Organizing Crew
              </div>
            </div>

            <div className="text-xs font-mono font-bold bg-[#FAF0E6] text-[#C85A32] px-3 py-1.5 rounded-lg border border-[#E8D4C0]">
              2018 ➔ 2026
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
