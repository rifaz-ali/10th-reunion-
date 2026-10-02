import React, { useState, useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';

// 14 November 2026, 5:00 PM IST (UTC+05:30)
const TARGET_DATE = new Date('2026-11-14T17:00:00+05:30').getTime();

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateTimeRemaining(): TimeRemaining {
  const now = Date.now();
  const diff = TARGET_DATE - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
}

export const Countdown: React.FC = () => {
  const [time, setTime] = useState<TimeRemaining>(calculateTimeRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 border-y border-[#E8E0D2] bg-[#F5EFE4] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-[#8A7969] uppercase mb-1">
            <Clock className="w-3.5 h-3.5 text-[#C85A32]" />
            <span>COUNTING DOWN TO THE REUNION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#201D1A]">
            Until 10th D Reunites
          </h2>
          <p className="text-sm text-[#665D54] mt-1 font-sans">
            14 November 2026 • 5:00 PM IST • Royal Villa, Okketturu
          </p>
        </div>

        {/* Countdown Timer Display */}
        {time.isExpired ? (
          <div className="text-center py-6 px-4 bg-white rounded-2xl border border-[#E3D7C5] shadow-xs max-w-lg mx-auto">
            <div className="font-serif-display text-3xl sm:text-4xl font-bold text-[#C85A32] flex items-center justify-center gap-2">
              <Sparkles className="w-7 h-7 text-[#E0A938]" />
              <span>Today is the day! ❤️</span>
              <Sparkles className="w-7 h-7 text-[#E0A938]" />
            </div>
            <p className="text-[#554E46] text-base mt-2 font-medium">
              Head over to Royal Villa, Okketturu. The 10th D gang is waiting for you!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-3xl mx-auto">
            
            {/* Days */}
            <div className="bg-white rounded-xl p-4 sm:p-6 text-center border border-[#E4D8C6] shadow-xs hover:border-[#D1BFA6] transition-colors">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-serif-display font-bold text-[#201D1A] font-mono tabular-nums leading-none mb-2">
                {String(time.days).padStart(2, '0')}
              </div>
              <div className="text-xs uppercase tracking-widest font-semibold text-[#8C7D6F]">
                Days
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-xl p-4 sm:p-6 text-center border border-[#E4D8C6] shadow-xs hover:border-[#D1BFA6] transition-colors">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-serif-display font-bold text-[#201D1A] font-mono tabular-nums leading-none mb-2">
                {String(time.hours).padStart(2, '0')}
              </div>
              <div className="text-xs uppercase tracking-widest font-semibold text-[#8C7D6F]">
                Hours
              </div>
            </div>

            {/* Minutes */}
            <div className="bg-white rounded-xl p-4 sm:p-6 text-center border border-[#E4D8C6] shadow-xs hover:border-[#D1BFA6] transition-colors">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-serif-display font-bold text-[#201D1A] font-mono tabular-nums leading-none mb-2">
                {String(time.minutes).padStart(2, '0')}
              </div>
              <div className="text-xs uppercase tracking-widest font-semibold text-[#8C7D6F]">
                Minutes
              </div>
            </div>

            {/* Seconds */}
            <div className="bg-white rounded-xl p-4 sm:p-6 text-center border border-[#E4D8C6] shadow-xs hover:border-[#D1BFA6] transition-colors">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-serif-display font-bold text-[#C85A32] font-mono tabular-nums leading-none mb-2">
                {String(time.seconds).padStart(2, '0')}
              </div>
              <div className="text-xs uppercase tracking-widest font-semibold text-[#8C7D6F]">
                Seconds
              </div>
            </div>

          </div>
        )}

        {/* Nostalgic quote beneath countdown */}
        <div className="mt-8 text-center">
          <span className="font-handwriting text-2xl text-[#875E40] font-semibold">
            &ldquo;Can&apos;t wait to hear every update and laugh like we used to in 2018!&rdquo;
          </span>
        </div>

      </div>
    </section>
  );
};
