import React, { useState, useEffect } from 'react';
import { X, Megaphone } from '@phosphor-icons/react';

const M = "'Manrope', sans-serif";

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [announcement, setAnnouncement] = useState<any>(null);

  useEffect(() => {
    // Check session storage to see if user dismissed it in this session
    const dismissed = sessionStorage.getItem('announcementDismissed');
    
    // Fetch settings
    const fetchSettings = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';
        const baseUrl = API_BASE.startsWith('http') ? API_BASE : `${window.location.origin}${API_BASE}`;
        const res = await fetch(`${baseUrl}/settings`);
        if (res.ok) {
          const json = await res.json();
          const settings = json.data || json;
          if (settings?.announcement?.isActive) {
            setAnnouncement(settings.announcement);
            if (!dismissed) {
              setIsVisible(true);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to fetch announcement settings', err);
      }
    };
    
    fetchSettings();
  }, []);

  if (!isVisible || !announcement) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('announcementDismissed', 'true');
  };

  return (
    <div 
      className="w-full relative z-50 flex items-center justify-center px-4 py-2"
      style={{ backgroundColor: announcement.bgColor || '#0C3352', color: announcement.textColor || '#FFFFFF' }}
    >
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-center pr-8">
        <Megaphone size={16} weight="fill" className="shrink-0" />
        <p className="text-sm font-semibold text-center break-words" style={{ fontFamily: M }}>
          {announcement.text}{' '}
          {announcement.link && (
            <a href={announcement.link} className="underline hover:opacity-80 ml-1">
              Learn more
            </a>
          )}
        </p>
      </div>
      <button 
        onClick={handleDismiss}
        className="absolute right-4 hover:opacity-70 transition-opacity"
        aria-label="Close announcement"
      >
        <X size={16} weight="bold" />
      </button>
    </div>
  );
};
