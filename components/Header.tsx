import React, { useState } from 'react';
import { CanvasEvent } from '../types';
import { generateAndDownloadIcsFile } from '../services/calendarService';
import NotificationBell from './NotificationBell';

interface HeaderProps {
  events: CanvasEvent[];
  newEvents: CanvasEvent[];
  loading: boolean;
}

const DownloadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ events, newEvents, loading }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    if (window.confirm('Are you sure you want to download all calendar events as an .ics file?')) {
      setIsDownloading(true);
      generateAndDownloadIcsFile(events);
      setTimeout(() => setIsDownloading(false), 1000); // Reset button state after 1s
    }
  };

  const isDownloadDisabled = loading || events.length === 0 || isDownloading;

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Calendar Exporter</h1>
        <p className="mt-1 text-slate-600">Export your Canvas calendar to iCal or Google Calendar.</p>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <NotificationBell newEvents={newEvents} />
        <button
          onClick={handleDownload}
          disabled={isDownloadDisabled}
          className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-all duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          <DownloadIcon className="w-5 h-5" />
          {isDownloading ? 'Downloading...' : 'Download All (.ics)'}
        </button>
      </div>
    </header>
  );
};

export default Header;