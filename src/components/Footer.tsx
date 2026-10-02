import React from 'react';
import { Heart, Lock, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigateAdmin: () => void;
  onNavigateHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateAdmin, onNavigateHome }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#201D1A] text-[#E0D7CC] pt-16 pb-12 border-t border-[#36302B]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col items-center text-center">
          
          {/* Main Motto */}
          <div className="text-xl sm:text-2xl md:text-3xl font-serif-display font-bold tracking-tight text-white mb-2">
            ONCE 10TH D, ALWAYS 10TH D. ❤️
          </div>

          {/* Reunion Subtitle */}
          <div className="text-sm sm:text-base font-semibold text-[#D49E72] font-mono tracking-widest uppercase mb-1">
            2018 Batch Reunion
          </div>

          {/* Date & Venue */}
          <div className="text-xs sm:text-sm text-[#A89C8F] mb-8 font-sans">
            14 November 2026 • Royal Villa, Okketturu
          </div>

          {/* Nostalgic divider */}
          <div className="w-16 h-0.5 bg-[#4A423A] mb-8" />

          {/* Quick links and Organizer access */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#8C8074]">
            <button
              onClick={onNavigateHome}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Main Invitation
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
            <span>•</span>
            <button
              onClick={onNavigateAdmin}
              className="hover:text-[#D49E72] transition-colors cursor-pointer flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>Organizer Portal</span>
            </button>
          </div>

          {/* Copyright notice */}
          <div className="mt-8 text-[11px] text-[#695E54] font-mono">
            Crafted with nostalgia for the 10th Standard D Section, 2018 Passouts.
          </div>

        </div>

      </div>
    </footer>
  );
};
