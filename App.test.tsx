// Fix: Import Jest globals to resolve TypeScript errors.
import { describe, it, expect, jest } from '@jest/globals';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import * as canvasService from './services/canvasService';
import { CanvasEvent } from './types';

// Mock the entire canvasService module
jest.mock('./services/canvasService');

const mockCanvasService = canvasService as jest.Mocked<typeof canvasService>;

const mockEvents: CanvasEvent[] = [
  {
    id: '1',
    title: 'Event on Day 1',
    start: new Date('2024-01-01T10:00:00'),
    end: new Date('2024-01-01T11:00:00'),
    course: 'COURSE 101',
    description: 'Description 1',
    location: 'Location 1',
  },
  {
    id: '2',
    title: 'Event on Day 2',
    start: new Date('2024-01-02T14:00:00'),
    end: new Date('2024-01-02T15:00:00'),
    course: 'COURSE 102',
    description: 'Description 2',
    location: 'Location 2',
    isNew: true,
    addedAt: new Date(),
  },
];

describe('App', () => {
  it('shows a loading spinner initially', () => {
    mockCanvasService.getCalendarEvents.mockResolvedValue(new Promise(() => {})); // Never resolves
    render(<App />);
    expect(screen.getByText('Loading your Canvas calendar...')).toBeInTheDocument();
  });

  it('fetches, groups, and displays events successfully', async () => {
    mockCanvasService.getCalendarEvents.mockResolvedValue(mockEvents);
    render(<App />);

    // Wait for the loading spinner to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading your Canvas calendar...')).not.toBeInTheDocument();
    });

    // Check for date headers
    expect(screen.getByText('Monday, January 1, 2024')).toBeInTheDocument();
    expect(screen.getByText('Tuesday, January 2, 2024')).toBeInTheDocument();

    // Check for event titles
    expect(screen.getByText('Event on Day 1')).toBeInTheDocument();
    expect(screen.getByText('Event on Day 2')).toBeInTheDocument();

    // Check that the new event notification bell would have the new event
    // The bell itself handles the count, but we check if the header gets the new event
    const notificationBell = screen.getByLabelText('View notifications. 1 new items.');
    expect(notificationBell).toBeInTheDocument();
  });

  it('displays an error message when fetching fails', async () => {
    mockCanvasService.getCalendarEvents.mockRejectedValue(new Error('API Error'));
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load calendar events/)).toBeInTheDocument();
    });
  });

  it('displays a message when there are no events', async () => {
    mockCanvasService.getCalendarEvents.mockResolvedValue([]);
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('No upcoming events found in your calendar.')).toBeInTheDocument();
    });
  });
});