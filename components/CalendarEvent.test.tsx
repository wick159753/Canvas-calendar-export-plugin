// Fix: Import Jest globals to resolve TypeScript errors.
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CalendarEventComponent from './CalendarEvent';
import { CanvasEvent } from '../types';
import * as calendarService from '../services/calendarService';

// Mock the calendarService to spy on its methods
jest.mock('../services/calendarService', () => ({
  generateGoogleCalendarUrl: jest.fn(),
  generateAndDownloadIcsFile: jest.fn(),
}));

// Mock window.open
// Fix: Use `window` instead of `global` for browser APIs in a jsdom environment.
window.open = jest.fn();

const mockEvent: CanvasEvent = {
  id: '1',
  title: 'Midterm Exam',
  start: new Date('2024-10-26T09:00:00'),
  end: new Date('2024-10-26T11:00:00'),
  course: 'PSYC 101',
  description: 'Midterm covering chapters 1-5.',
  location: 'Room 201',
  isNew: true,
};

describe('CalendarEventComponent', () => {
  beforeEach(() => {
    // Clear mock history before each test
    (calendarService.generateGoogleCalendarUrl as jest.Mock).mockClear();
    (calendarService.generateAndDownloadIcsFile as jest.Mock).mockClear();
    // Fix: Use `window` instead of `global` for browser APIs in a jsdom environment.
    (window.open as jest.Mock).mockClear();
  });

  it('renders event details correctly', () => {
    render(<CalendarEventComponent event={mockEvent} />);

    expect(screen.getByText('PSYC 101')).toBeInTheDocument();
    expect(screen.getByText('Midterm Exam')).toBeInTheDocument();
    expect(screen.getByText('Midterm covering chapters 1-5.')).toBeInTheDocument();
    expect(screen.getByText('Room 201')).toBeInTheDocument();
    expect(screen.getByText('9:00 AM - 11:00 AM')).toBeInTheDocument();
  });

  it('displays a "NEW" badge for new events', () => {
    render(<CalendarEventComponent event={mockEvent} />);
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  it('does not display a "NEW" badge for old events', () => {
    const oldEvent = { ...mockEvent, isNew: false };
    render(<CalendarEventComponent event={oldEvent} />);
    expect(screen.queryByText('NEW')).not.toBeInTheDocument();
  });

  it('calls generateGoogleCalendarUrl and window.open on "Add to Google" click', () => {
    (calendarService.generateGoogleCalendarUrl as jest.Mock).mockReturnValue('http://fake-google-url.com');
    render(<CalendarEventComponent event={mockEvent} />);

    const googleButton = screen.getByRole('button', { name: /add to google/i });
    fireEvent.click(googleButton);

    expect(calendarService.generateGoogleCalendarUrl).toHaveBeenCalledWith(mockEvent);
    expect(window.open).toHaveBeenCalledWith('http://fake-google-url.com', '_blank', 'noopener,noreferrer');
  });

  it('calls generateAndDownloadIcsFile on "Save .ics" click with a sanitized filename', () => {
    render(<CalendarEventComponent event={mockEvent} />);
    
    const icsButton = screen.getByRole('button', { name: /save \.ics/i });
    fireEvent.click(icsButton);

    const expectedFilename = 'psyc-101-midterm-exam.ics';
    expect(calendarService.generateAndDownloadIcsFile).toHaveBeenCalledWith([mockEvent], expectedFilename);
  });
});