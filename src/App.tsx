import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Countdown } from './components/Countdown';
import { StorySection } from './components/StorySection';
import { ClassPhotoSection } from './components/ClassPhotoSection';
import { EventDetails } from './components/EventDetails';
import { RSVPSection } from './components/RSVPSection';
import { ShareButtons } from './components/ShareButtons';
import { EveryonePage } from './components/EveryonePage';
import { AdminPage } from './components/AdminPage';
import { Footer } from './components/Footer';
import { getPublicResponses, PublicResponseItem } from './lib/api';
import { useClassPhoto } from './lib/classPhoto';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/everyone' || path === '/admin') return path;
    }
    return '/';
  });

  const [responses, setResponses] = useState<PublicResponseItem[]>([]);
  const [preselectedStatus, setPreselectedStatus] = useState<'YES' | 'MAYBE' | 'NO'>('YES');
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const { photoSrc, updatePhoto } = useClassPhoto();

  // Load public responses to show live attendee badge count in Navbar
  const loadAttendeesCount = async () => {
    try {
      const data = await getPublicResponses();
      setResponses(data);
    } catch {
      // Ignore background fetch error
    }
  };

  useEffect(() => {
    loadAttendeesCount();

    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/everyone' || path === '/admin') {
        setCurrentPath(path);
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string, hash?: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      const fullUrl = hash ? `${path}${hash}` : path;
      window.history.pushState({}, '', fullUrl);

      if (path === '/' && hash) {
        // Wait a frame if transitioning back to home page
        setTimeout(() => {
          const id = hash.replace('#', '');
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleHeroRSVP = () => {
    setPreselectedStatus('YES');
    navigateTo('/', '#rsvp');
  };

  const comingCount = responses.filter(r => r.status === 'YES').length;

  return (
    <div className="min-h-screen flex flex-col paper-texture">
      {/* Top Navigation */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigateTo}
        comingCount={comingCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPath === '/everyone' ? (
          <EveryonePage
            onBackToHome={() => navigateTo('/')}
            onGoToRSVP={() => navigateTo('/', '#rsvp')}
          />
        ) : currentPath === '/admin' ? (
          <AdminPage
            onBackToHome={() => navigateTo('/')}
            photoSrc={photoSrc}
            onUpdatePhoto={updatePhoto}
          />
        ) : (
          /* Home Page with complete nostalgic flow */
          <>
            <Hero
              onRSVPClick={handleHeroRSVP}
              onSeeWhoIsComing={() => navigateTo('/everyone')}
              photoSrc={photoSrc}
              onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
            />

            <Countdown />

            <StorySection />

            <ClassPhotoSection
              photoSrc={photoSrc}
              onUpdatePhoto={updatePhoto}
              isModalOpen={isPhotoModalOpen}
              onCloseModal={() => setIsPhotoModalOpen(false)}
              onOpenModal={() => setIsPhotoModalOpen(true)}
            />

            <EventDetails />

            <RSVPSection
              preselectedStatus={preselectedStatus}
              onRSVPSuccess={loadAttendeesCount}
              onViewEveryone={() => navigateTo('/everyone')}
            />

            <ShareButtons />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigateHome={() => navigateTo('/')}
        onNavigateAdmin={() => navigateTo('/admin')}
      />
    </div>
  );
}
