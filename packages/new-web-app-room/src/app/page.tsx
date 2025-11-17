'use client';

import { useState, useEffect } from 'react';
import { CalendarHeader } from '@/components/CalendarHeader';
import { CalendarGrid } from '@/components/CalendarGrid';
import { EventModal } from '@/components/EventModal';
import { CalendarEvent } from '@/types/calendar';

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Load events from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendar-events');
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(parsedEvents);
    }
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events));
  }, [events]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(null);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    if (selectedEvent) {
      // Update existing event
      setEvents(events.map(event => 
        event.id === selectedEvent.id 
          ? { ...eventData, id: selectedEvent.id }
          : event
      ));
    } else {
      // Create new event
      const newEvent: CalendarEvent = {
        ...eventData,
        id: Date.now().toString(),
      };
      setEvents([...events, newEvent]);
    }
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="min-h-screen bg-white">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onNavigate={navigateDate}
        onToday={goToToday}
        onCreateEvent={() => {
          setSelectedDate(new Date());
          setSelectedEvent(null);
          setIsModalOpen(true);
        }}
      />
      
      <CalendarGrid
        currentDate={currentDate}
        view={view}
        events={events}
        onDateClick={handleDateClick}
        onEventClick={handleEventClick}
      />

      {isModalOpen && (
        <EventModal
          event={selectedEvent}
          selectedDate={selectedDate}
          onSave={handleSaveEvent}
          onDelete={selectedEvent ? () => handleDeleteEvent(selectedEvent.id) : undefined}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
}

