import { useState, useEffect } from 'react';

const PHOTO_STORAGE_KEY = '10th_d_class_photo_custom';

export function useClassPhoto() {
  const [photoSrc, setPhotoSrc] = useState<string>('IMG_20261002_070755959_HDR.jpg');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(PHOTO_STORAGE_KEY);
      if (stored) {
        setPhotoSrc(stored);
      }
    }
  }, []);

  const updatePhoto = (dataUrl: string) => {
    setPhotoSrc(dataUrl);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(PHOTO_STORAGE_KEY, dataUrl);
      } catch (err) {
        console.warn('Could not save photo to localStorage (quota exceeded)', err);
      }
    }
  };

  return { photoSrc, updatePhoto };
}
