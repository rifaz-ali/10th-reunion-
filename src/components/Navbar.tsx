import React, { useState } from 'react';
import { Menu, X, Users, Heart, Calendar } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string, hash?: string) => void;
  comingCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, comingCount }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (path: string, hash?: string) => {
    setMobileMenuOpen(false);
    onNavigate(path, hash);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8E2D5] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        
        {/* Zone 1: Single Brand Wordmark */}
        <button
          onClick={() => handleNavClick('/')}
          className="text-left font-serif-display text-xl sm:text-2xl font-bold tracking-tight text-[#22201E] hover:text-[#C85A32] transition-colors flex items-center gap-2 group cursor-pointer"
        >
          <span className="bg-[#C85A32] text-white text-xs px-2 py-0.5 rounded font-sans font-bold tracking-wider">
            10TH D
          </span>
          <span className="font-serif-display italic font-normal text-[#6B635B]">/</span>
          <span className="tracking-wide">2018 REUNION</span>
        </button>

        {/* Zone 2: Clean Text Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#554E46]">
          {currentPath === '/' ? (
            <>
              <a
                href="#story"
                onClick={(e) => { e.preventDefault(); handleNavClick('/', '#story'); }}
                className="hover:text-[#C85A32] transition-colors cursor-pointer py-1"
              >
                Story
              </a>
              <a
                href="#memories"
                onClick={(e) => { e.preventDefault(); handleNavClick('/', '#memories'); }}
                className="hover:text-[#C85A32] transition-colors cursor-pointer py-1"
              >
                Memories
              </a>
              <a
                href="#event"
                onClick={(e) => { e.preventDefault(); handleNavClick('/', '#event'); }}
                className="hover:text-[#C85A32] transition-colors cursor-pointer py-1"
              >
                Event
              </a>
              <a
                href="#rsvp"
                onClick={(e) => { e.preventDefault(); handleNavClick('/', '#rsvp'); }}
                className="hover:text-[#C85A32] transition-colors cursor-pointer py-1"
              >
                RSVP
              </a>
            </>
          ) : (
            <button
              onClick={() => handleNavClick('/')}
              className="hover:text-[#C85A32] transition-colors cursor-pointer py-1"
            >
              ← Back to Main Invite
            </button>
          )}

          <button
            onClick={() => handleNavClick('/everyone')}
            className={`transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
              currentPath === '/everyone' ? 'text-[#C85A32] font-semibold' : 'hover:text-[#C85A32]'
            }`}
          >
            <Users className="w-4 h-4 text-[#C85A32]" />
            <span>Everyone</span>
            {comingCount !== undefined && comingCount > 0 && (
              <span className="text-xs bg-[#EADCC8] text-[#4A3E31] px-1.5 py-0.5 rounded-full font-mono font-medium">
                {comingCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => {
              if (currentPath !== '/') {
                handleNavClick('/', '#rsvp');
              } else {
                const el = document.getElementById('rsvp');
                el?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#C85A32] hover:bg-[#B34720] rounded-lg transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>RSVP Now</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => handleNavClick('/everyone')}
            className="p-2 text-[#554E46] hover:text-[#C85A32] transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium bg-[#EFE9DF] rounded-md px-2.5 py-1.5"
            aria-label="View who is coming"
          >
            <Users className="w-3.5 h-3.5 text-[#C85A32]" />
            <span>List</span>
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#22201E] hover:text-[#C85A32] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A32] rounded-md"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E2D5] bg-[#FAF7F2] px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col gap-3 text-base font-medium text-[#3A352F]">
            <button
              onClick={() => handleNavClick('/')}
              className="text-left py-2 px-2 hover:bg-[#EFE9DF] rounded-md transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('/', '#story')}
              className="text-left py-2 px-2 hover:bg-[#EFE9DF] rounded-md transition-colors"
            >
              The Story
            </button>
            <button
              onClick={() => handleNavClick('/', '#memories')}
              className="text-left py-2 px-2 hover:bg-[#EFE9DF] rounded-md transition-colors"
            >
              Memories & Photos
            </button>
            <button
              onClick={() => handleNavClick('/', '#event')}
              className="text-left py-2 px-2 hover:bg-[#EFE9DF] rounded-md transition-colors"
            >
              Event Details & Venue
            </button>
            <button
              onClick={() => handleNavClick('/', '#rsvp')}
              className="text-left py-2 px-2 hover:bg-[#EFE9DF] rounded-md transition-colors text-[#C85A32] font-semibold"
            >
              RSVP Form
            </button>
            <button
              onClick={() => handleNavClick('/everyone')}
              className="text-left py-2 px-2 hover:bg-[#EFE9DF] rounded-md transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#C85A32]" />
                Who's Coming List
              </span>
              {comingCount !== undefined && comingCount > 0 && (
                <span className="text-xs bg-[#C85A32] text-white px-2 py-0.5 rounded-full font-mono font-medium">
                  {comingCount}
                </span>
              )}
            </button>
            <div className="pt-2 border-t border-[#E8E2D5]">
              <button
                onClick={() => handleNavClick('/', '#rsvp')}
                className="w-full py-2.5 text-center font-semibold text-white bg-[#C85A32] rounded-lg shadow-sm flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                Submit Your RSVP
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
