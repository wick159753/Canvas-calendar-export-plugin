import React, { useState, useEffect, useRef } from 'react';
import { CanvasEvent } from '../types';

const BellIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

interface NotificationBellProps {
  newEvents: CanvasEvent[];
}

const NotificationBell: React.FC<NotificationBellProps> = ({ newEvents }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notificationCount = newEvents.length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-slate-500 bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label={`View notifications. ${notificationCount} new items.`}
      >
        <BellIcon className="w-6 h-6" />
        {notificationCount > 0 && (
          <span className="absolute top-0 right-0 block h-4 w-4 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
            {notificationCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-20">
          <div className="py-2 px-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-semibold text-slate-800">New Assignments</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notificationCount > 0 ? (
              <ul>
                {newEvents.map(event => (
                  <li key={event.id}>
                    <a
                      href={`#event-${event.id}`}
                      onClick={handleLinkClick}
                      className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <p className="font-semibold text-indigo-600 truncate">{event.course}</p>
                      <p className="text-slate-800 truncate">{event.title}</p>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-slate-500 py-6 px-4">No new assignments.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
