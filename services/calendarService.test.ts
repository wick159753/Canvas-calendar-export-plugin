// Fix: Import Jest globals to resolve TypeScript errors.
import { describe, it, expect, jest, beforeAll, beforeEach } from '@jest/globals';
import { generateGoogleCalendarUrl, generateAndDownloadIcsFile } from './calendarService';
import { CanvasEvent } from '../types';

// Mocking the global ics object provided by the CDN script
beforeAll(() => {
  (window as any).ics = {
    createEvents: jest.fn((events) => {
      if (!events || events.length === 0) {
        return { error: new Error('No events provided'), value: null };
      }
      return { error: null, value: 'BEGIN:VCALENDAR...' };
    }),
  };
});

// Mocking Browser APIs for file download
beforeEach(() => {
    // Fix: Use `window` instead of `global` for browser APIs in a jsdom environment.
    window.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    window.URL.revokeObjectURL = jest.fn();
});

const mockEvent: CanvasEvent = {
  id: '1',
  title: 'Test Event',
  start: new Date('2024-01-01T10:00:00Z'),
  end: new Date('2024-01-01T11:00:00Z'),
  course: 'TEST 101',
  description: 'This is a test event.',
  location: 'Test Location',
};

describe('calendarService', () => {
  describe('generateGoogleCalendarUrl', () => {
    it('should generate a valid Google Calendar URL', () => {
      const url = generateGoogleCalendarUrl(mockEvent);
      const params = new URL(url).searchParams;

      expect(url).toContain('https://calendar.google.com/calendar/render');
      expect(params.get('action')).toBe('TEMPLATE');
      expect(params.get('text')).toBe('TEST 101: Test Event');
      expect(params.get('dates')).toBe('20240101T100000Z/20240101T110000Z');
      expect(params.get('details')).toContain('This is a test event.');
      expect(params.get('location')).toBe('Test Location');
    });
  });

  describe('generateAndDownloadIcsFile', () => {
    it('should create and trigger a download for an .ics file', () => {
      const link = {
        href: '',
        setAttribute: jest.fn(),
        click: jest.fn(),
      };
      
      // Mock document.createElement to intercept the link creation
      document.createElement = jest.fn(() => link as any);
      document.body.appendChild = jest.fn();
      document.body.removeChild = jest.fn();


      generateAndDownloadIcsFile([mockEvent], 'test-event.ics');

      // Check if ics.createEvents was called correctly
      expect((window as any).ics.createEvents).toHaveBeenCalledWith([
        expect.objectContaining({
          title: 'TEST 101: Test Event',
          start: [2024, 1, 1, 10, 0],
        }),
      ]);

      // Check if a link was created and clicked to trigger download
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(link.setAttribute).toHaveBeenCalledWith('download', 'test-event.ics');
      expect(link.href).toBe('blob:mock-url');
      expect(document.body.appendChild).toHaveBeenCalledWith(link);
      expect(link.click).toHaveBeenCalled();
      expect(document.body.removeChild).toHaveBeenCalledWith(link);
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

     it('should handle errors from the ics library gracefully', () => {
      // Spy on window.alert and console.error
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Force the mock to return an error
      (window as any).ics.createEvents.mockReturnValueOnce({ error: new Error('ICS generation failed'), value: null });

      generateAndDownloadIcsFile([mockEvent]);
      
      expect(alertSpy).toHaveBeenCalledWith('An error occurred while creating the .ics file.');
      expect(consoleErrorSpy).toHaveBeenCalledWith(new Error('ICS generation failed'));

      // Restore original implementations
      alertSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });
});