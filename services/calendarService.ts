import { CanvasEvent } from '../types';

/**
 * Formats a Date object into the UTC format required by Google Calendar URLs.
 * Example: 20240729T183000Z
 * @param date The date to format.
 * @returns A formatted string.
 */
const formatDateForGoogle = (date: Date): string => {
  return date.toISOString().replace(/-|:|\.\d{3}/g, '');
};

/**
 * Generates a URL to add a single event to Google Calendar.
 * @param event The Canvas event to add.
 * @returns A fully formed URL string.
 */
export const generateGoogleCalendarUrl = (event: CanvasEvent): string => {
  const baseUrl = 'https://calendar.google.com/calendar/render';
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${event.course}: ${event.title}`,
    dates: `${formatDateForGoogle(event.start)}/${formatDateForGoogle(event.end)}`,
    details: `${event.description}\n\nCourse: ${event.course}`,
    location: event.location,
  });
  return `${baseUrl}?${params.toString()}`;
};

/**
 * Converts a Date object to the format required by the ics.js library.
 * @param date The date to convert.
 * @returns An array of numbers: [year, month, day, hour, minute].
 */
const toIcsDateArray = (date: Date): [number, number, number, number, number] => {
  return [
    date.getFullYear(),
    date.getMonth() + 1, // month is 1-indexed in ics.js
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ];
};

/**
 * Generates an iCal (.ics) file from a list of events and triggers a download.
 * @param events An array of Canvas events.
 * @param filename The desired filename for the downloaded .ics file.
 */
export const generateAndDownloadIcsFile = (events: CanvasEvent[], filename: string = 'canvas-calendar.ics'): void => {
  if (!(window as any).ics) {
    console.error('ics.js library is not loaded.');
    alert('Error: Could not generate .ics file because the required library (ics.js) is not available.');
    return;
  }

  const ics = (window as any).ics;

  const calendarEvents = events.map(event => ({
    title: `${event.course}: ${event.title}`,
    description: `${event.description}\n\nCourse: ${event.course}`,
    location: event.location,
    start: toIcsDateArray(event.start),
    end: toIcsDateArray(event.end),
    calName: 'Canvas Calendar Export',
    productId: 'CanvasCalendarExporter'
  }));

  const { error, value } = ics.createEvents(calendarEvents);

  if (error) {
    console.error(error);
    alert('An error occurred while creating the .ics file.');
    return;
  }

  if (value) {
    const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};