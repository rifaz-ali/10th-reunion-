import React, { useState, useRef } from 'react';
import { ZoomIn, Download, Upload, Maximize2, Sparkles, X } from 'lucide-react';

interface ClassPhotoSectionProps {
  photoSrc: string;
  onUpdatePhoto: (newSrc: string) => void;
  isModalOpen?: boolean;
  onCloseModal?: () => void;
  onOpenModal?: () => void;
}

export const ClassPhotoSection: React.FC<ClassPhotoSectionProps> = ({
  photoSrc,
  onUpdatePhoto,
  isModalOpen: controlledModalOpen,
  onCloseModal: controlledCloseModal,
  onOpenModal: controlledOpenModal,
}) => {
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isModalOpen = controlledModalOpen !== undefined ? controlledModalOpen : internalModalOpen;
  const openModal = controlledOpenModal || (() => setInternalModalOpen(true));
  const closeModal = controlledCloseModal || (() => setInternalModalOpen(false));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onUpdatePhoto(result);
          setImageError(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photoSrc;
    link.download = '10th_D_2018_Batch_Official_Photo.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const effectiveSrc = imageError ? '/class_photo_fallback.svg' : photoSrc;

  return (
    <section id="memories" className="py-20 sm:py-28 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-[#947659] uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C85A32]" />
            <span>OFFICIAL CLASS OF 2018 MEMOIR</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif-display font-bold text-[#1F1C19] tracking-tight">
            One batch. Too many memories.
          </h2>
          <p className="text-base sm:text-lg text-[#5A524A] mt-4 leading-relaxed font-normal">
            We were just students then. Class benches, lunch breaks, last-bench madness, PT periods, group studies and countless inside jokes. Now everyone has their own life, but for one evening, let&apos;s bring 10th D back together.
          </p>
        </div>

        {/* The Single Authentic Class Photo Showcase Card */}
        <div className="polaroid-card p-4 sm:p-8 rounded-xl max-w-4xl mx-auto shadow-2xl relative">
          
          {/* Washi tape on top */}
          <div className="w-36 h-7 washi-tape -mt-11 sm:-mt-14 mb-5 mx-auto rounded-xs opacity-90 pointer-events-none" />

          {/* Photo Container */}
          <div
            onClick={openModal}
            className="relative w-full aspect-[4/3] sm:aspect-[16/11] bg-[#1F1C19] rounded-lg overflow-hidden border-2 border-[#E8DEC8] cursor-pointer group shadow-inner flex items-center justify-center"
          >
            <img
              src={effectiveSrc}
              alt="10th Standard D Section 2018 Passouts official class group photo"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-contain sm:object-cover object-center group-hover:scale-[1.015] transition-transform duration-300"
            />

            {/* Click to zoom overlay pill */}
            <div className="absolute bottom-4 right-4 bg-black/70 hover:bg-black/85 text-white px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5 transition-all shadow-md">
              <ZoomIn className="w-3.5 h-3.5 text-[#E0A938]" />
              <span>Click to Zoom &amp; Inspect</span>
            </div>

            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="bg-white/95 text-[#22201E] px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-[#C85A32]" />
                View Fullscreen Photo
              </span>
            </div>
          </div>

          {/* Bottom Handwritten Caption and Batch Details */}
          <div className="pt-6 pb-2 px-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#F0E8DC] mt-4">
            <div>
              <p className="font-handwriting text-2xl sm:text-3xl text-[#2F2924] font-bold leading-tight">
                &ldquo;Front row with our teachers, surrounded by the 10th D gang.&rdquo;
              </p>
              <p className="text-xs text-[#7D7063] font-mono mt-1">
                Official 10th Standard D Section Photo • March 2018 Passouts
              </p>
            </div>

            {/* Actions: Download & Replace/Upload */}
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                onClick={handleDownload}
                className="px-3.5 py-2 bg-[#FAF7F2] hover:bg-[#EFE8DC] text-[#3D352D] border border-[#DCD0C0] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Download class photograph"
              >
                <Download className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>Save Photo</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 bg-white hover:bg-[#FAF7F2] text-[#63574A] border border-[#DCD0C0] text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Replace with high-res photo from your device"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Select Photo</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

        </div>

      </div>

      {/* Lightbox / Zoom Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={closeModal}
        >
          {/* Close button */}
          <div className="w-full max-w-5xl flex items-center justify-between text-white mb-3 px-2">
            <div className="text-xs sm:text-sm font-mono tracking-wider text-amber-200">
              10TH D • 2018 OFFICIAL CLASS PHOTOGRAPH
            </div>
            <button
              onClick={closeModal}
              className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Fullscreen Photo Container */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center overflow-auto rounded-xl bg-black border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={effectiveSrc}
              alt="10th Standard D Section 2018 Passouts official class photo zoomed"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>

          <div className="text-center text-white/70 text-xs mt-3 font-sans">
            Click anywhere outside or press the close button to return.
          </div>
        </div>
      )}

    </section>
  );
};
