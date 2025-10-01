import React from 'react';
import { CanvasEvent } from '../types';
import { generateGoogleCalendarUrl, generateAndDownloadIcsFile } from '../services/calendarService';

interface CalendarEventProps {
  event: CanvasEvent;
}

const GoogleCalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 6.5H20V6C20 4.89543 19.1046 4 18 4H16V3C16 2.44772 15.5523 2 15 2C14.4477 2 14 2.44772 14 3V4H10V3C10 2.44772 9.55228 2 9 2C8.44772 2 8 2.44772 8 3V4H6C4.89543 4 4 4.89543 4 6V6.5H3C2.44772 6.5 2 6.94772 2 7.5V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V7.5C22 6.94772 21.5523 6.5 21 6.5ZM20 20H4V11H20V20ZM20 9H4V7.5H20V9Z" fill="currentColor" />
    <path d="M11 15H13V13H15V15H17V17H15V19H13V17H11V15Z" fill="currentColor" />
  </svg>
);

const ICalIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a.75.75 0 00.75-.75v-3.5a.75.75 0 00-1.5 0v3.5A.75.75 0 0012 18zM12 12h.008v.008H12V12z" />
    </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const CalendarEventComponent: React.FC<CalendarEventProps> = ({ event }) => {
  const handleAddToGoogle = () => {
    const url = generateGoogleCalendarUrl(event);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadIcs = () => {
    // Sanitize title to create a valid filename
    const sanitizedTitle = event.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const filename = `${event.course.replace(/\s+/g, '-')}-${sanitizedTitle}.ics`;
    generateAndDownloadIcsFile([event], filename);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };
  
  const isAllDay = event.end.getTime() - event.start.getTime() <= 60000;

  return (
    <div id={`event-${event.id}`} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 transition-shadow hover:shadow-md">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-grow">
          <p className="font-semibold text-indigo-600">{event.course}</p>
          <div className="flex items-center gap-3 mt-1">
            <h3 className="text-xl font-bold text-slate-800">{event.title}</h3>
            {event.isNew && (
                <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">NEW</span>
            )}
          </div>
          <p className="text-slate-600 mt-2">{event.description}</p>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-slate-400" />
              <span>{isAllDay ? 'All Day' : `${formatTime(event.start)} - ${formatTime(event.end)}`}</span>
            </div>
            {event.location && event.location !== 'Online Submission' && (
              <div className="flex items-center gap-2">
                <LocationIcon className="w-4 h-4 text-slate-400" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 sm:self-center">
            <div className="flex flex-col sm:flex-row items-center gap-2">
                 <button
                    onClick={handleDownloadIcs}
                    className="flex items-center gap-2 w-full sm:w-auto justify-center px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    title="Download .ics file for this event"
                >
                    <ICalIcon className="w-5 h-5 text-indigo-500"/>
                    <span>Save .ics</span>
                </button>
                <button
                    onClick={handleAddToGoogle}
                    className="flex items-center gap-2 w-full sm:w-auto justify-center px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    title="Add to Google Calendar"
                >
                    <GoogleCalendarIcon className="w-5 h-5 text-red-500"/>
                    <span>Add to Google</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarEventComponent;