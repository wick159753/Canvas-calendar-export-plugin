import React, { useState, useEffect } from 'react';
import { CanvasEvent } from './types';
import { getCalendarEvents } from './services/canvasService';
import Header from './components/Header';
import CalendarEventComponent from './components/CalendarEvent';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [events, setEvents] = useState<CanvasEvent[]>([]);
  const [newEvents, setNewEvents] = useState<CanvasEvent[]>([]);
  const [groupedEvents, setGroupedEvents] = useState<Map<string, CanvasEvent[]>>(new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const fetchedEvents = await getCalendarEvents();
        
        // Filter for new events (e.g., added in the last 24 hours)
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        const newAssignmentEvents = fetchedEvents.filter(
          event => event.isNew && event.addedAt && event.addedAt > twentyFourHoursAgo
        );
        setNewEvents(newAssignmentEvents);

        // Sort events chronologically
        const sortedEvents = fetchedEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
        setEvents(sortedEvents);

        // Group events by date
        const groups = new Map<string, CanvasEvent[]>();
        sortedEvents.forEach(event => {
          const dateKey = event.start.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          if (!groups.has(dateKey)) {
            groups.set(dateKey, []);
          }
          groups.get(dateKey)!.push(event);
        });
        setGroupedEvents(groups);

      } catch (err) {
        setError('Failed to load calendar events. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center pt-24">
          <LoadingSpinner />
          <p className="mt-4 text-slate-600">Loading your Canvas calendar...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center pt-24">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      );
    }

    if (events.length === 0) {
      return (
        <div className="text-center pt-24">
          <p className="text-slate-600">No upcoming events found in your calendar.</p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {Array.from(groupedEvents.entries()).map(([date, eventsOnDate]) => (
          <div key={date}>
            <h2 className="text-lg font-semibold text-slate-800 pb-2 mb-4 border-b border-slate-200 sticky top-0 bg-slate-50/90 backdrop-blur-sm z-10 py-3">
              {date}
            </h2>
            <div className="space-y-4">
              {eventsOnDate.map(event => (
                <CalendarEventComponent key={event.id} event={event} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header events={events} newEvents={newEvents} loading={loading} />
        <div className="mt-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;