import React from 'react';
import { Calendar, MapPin, GraduationCap, Sparkles, Navigation, CalendarPlus, Clock } from 'lucide-react';

export const EventDetails: React.FC = () => {
  const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=Royal+Villa+Okketturu';

  // Google Calendar event creation URL
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=10th+Standard+D+Section+2018+Batch+Reunion&dates=20261114T113000Z/20261114T173000Z&details=Same+class.+New+stories.+10th+D+Section+2018+Passout+Reunion+at+Royal+Villa,+Okketturu.&location=Royal+Villa,+Okketturu`;

  const handleDownloadICS = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//10th D 2018 Reunion//EN',
      'BEGIN:VEVENT',
      'UID:10th-d-reunion-2018-20261114',
      'DTSTAMP:20261001T000000Z',
      'DTSTART:20261114T113000Z',
      'DTEND:20261114T173000Z',
      'SUMMARY:10th Standard D Section 2018 Batch Reunion',
      'DESCRIPTION:Same class. New stories. Bring the gang together again at Royal Villa, Okketturu.',
      'LOCATION:Royal Villa, Okketturu',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '10th_D_2018_Reunion.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="event" className="py-20 sm:py-28 bg-[#F4EDE2] border-t border-[#E8DFD0] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-[#8A7969] uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C85A32]" />
            <span>EVENT LOGISTICS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif-display font-bold text-[#1F1C19] tracking-tight">
            The Gathering Details
          </h2>
          <p className="text-base text-[#5A524A] mt-3">
            Mark your calendar. Book your travel early so we don&apos;t miss a single classmate.
          </p>
        </div>

        {/* 4 Details Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Card 1: DATE */}
          <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#E3D7C5] shadow-xs flex flex-col justify-between hover:border-[#C85A32]/40 transition-colors">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#FAF0E6] flex items-center justify-center mb-5 border border-[#E8D4C0]">
                <Calendar className="w-6 h-6 text-[#C85A32]" />
              </div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A7B6E] mb-1">
                DATE
              </div>
              <div className="text-xl font-serif-display font-bold text-[#1F1C19] mb-1">
                Saturday, 14 November 2026
              </div>
              <div className="text-xs text-[#6B6156] flex items-center gap-1.5 mt-2">
                <Clock className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>5:00 PM IST Onwards</span>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-[#EFE8DC] text-[11px] text-[#8C8074]">
              Evening gathering &amp; dinner
            </div>
          </div>

          {/* Card 2: VENUE */}
          <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#E3D7C5] shadow-xs flex flex-col justify-between hover:border-[#C85A32]/40 transition-colors">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#FAF0E6] flex items-center justify-center mb-5 border border-[#E8D4C0]">
                <MapPin className="w-6 h-6 text-[#C85A32]" />
              </div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A7B6E] mb-1">
                VENUE
              </div>
              <div className="text-xl font-serif-display font-bold text-[#1F1C19] mb-1">
                Royal Villa
              </div>
              <div className="text-xs text-[#6B6156]">
                Okketturu
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-[#EFE8DC]">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-xs font-semibold text-[#C85A32] hover:text-[#B34720] inline-flex items-center gap-1 transition-colors"
              >
                <span>Google Maps View</span>
                <Navigation className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 3: BATCH */}
          <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#E3D7C5] shadow-xs flex flex-col justify-between hover:border-[#C85A32]/40 transition-colors">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#FAF0E6] flex items-center justify-center mb-5 border border-[#E8D4C0]">
                <GraduationCap className="w-6 h-6 text-[#C85A32]" />
              </div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A7B6E] mb-1">
                BATCH
              </div>
              <div className="text-xl font-serif-display font-bold text-[#1F1C19] mb-1">
                10th Standard D
              </div>
              <div className="text-xs text-[#6B6156]">
                2018 Passout Batch
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-[#EFE8DC] text-[11px] text-[#8C8074]">
              High school memories
            </div>
          </div>

          {/* Card 4: DRESS CODE */}
          <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#E3D7C5] shadow-xs flex flex-col justify-between hover:border-[#C85A32]/40 transition-colors">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#FAF0E6] flex items-center justify-center mb-5 border border-[#E8D4C0]">
                <Sparkles className="w-6 h-6 text-[#C85A32]" />
              </div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A7B6E] mb-1">
                DRESS CODE
              </div>
              <div className="text-base font-serif-display font-bold text-[#1F1C19] mb-1">
                Come as you are.
              </div>
              <div className="text-xs text-[#6B6156]">
                Bring the old-school energy.
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-[#EFE8DC] text-[11px] text-[#8C8074]">
              Smart casuals or throwback vibe
            </div>
          </div>

        </div>

        {/* Action Buttons for Directions and Calendar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="w-full sm:w-auto px-7 py-3.5 bg-[#22201E] hover:bg-[#36322E] text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Navigation className="w-4 h-4 text-[#E0A938]" />
            <span>Get Directions on Google Maps</span>
          </a>

          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-[#EDE5D8] text-[#2F2923] border border-[#D6CABE] text-sm font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4 text-[#C85A32]" />
            <span>Add to Google Calendar</span>
          </a>

          <button
            onClick={handleDownloadICS}
            className="w-full sm:w-auto px-5 py-3.5 bg-transparent hover:bg-black/5 text-[#524940] text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Download .ICS file</span>
          </button>
        </div>

      </div>
    </section>
  );
};
