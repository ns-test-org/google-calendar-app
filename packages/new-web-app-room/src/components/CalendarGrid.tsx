'use client';

import { CalendarEvent, categoryColors } from '@/types/calendar';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isSameMonth, 
  isSameDay, 
  isToday,
  startOfDay,
  endOfDay,
  startOfWeek as getStartOfWeek,
  addDays,
} from 'date-fns';

interface CalendarGridProps {
  currentDate: Date;
  view: 'month' | 'week' | 'day';
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export function CalendarGrid({
  currentDate,
  view,
  events,
  onDateClick,
  onEventClick,
}: CalendarGridProps) {
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventStart = startOfDay(event.start);
      const eventEnd = startOfDay(event.end);
      const targetDate = startOfDay(date);
      
      return targetDate >= eventStart && targetDate <= eventEnd;
    });
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="bg-white">
        {/* Week day headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays.map(day => (
            <div key={day} className="py-3 px-4 text-sm font-medium text-gray-500 text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {days.map(day => {
            const dayEvents = getEventsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`min-h-[120px] border-r border-b border-gray-200 p-2 cursor-pointer hover:bg-gray-50 ${
                  !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                }`}
                onClick={() => onDateClick(day)}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isCurrentDay ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className={`text-xs px-2 py-1 rounded text-white cursor-pointer hover:opacity-80 ${
                        categoryColors[event.category]
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 px-2">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = getStartOfWeek(currentDate);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="bg-white">
        {/* Week day headers */}
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="py-3 px-4"></div>
          {weekDays.map(day => (
            <div key={day.toISOString()} className="py-3 px-4 text-center">
              <div className="text-sm font-medium text-gray-900">
                {format(day, 'EEE')}
              </div>
              <div className={`text-lg font-semibold ${
                isToday(day) ? 'text-blue-600' : 'text-gray-900'
              }`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="grid grid-cols-8">
          {hours.map(hour => (
            <div key={hour} className="contents">
              <div className="py-2 px-4 text-xs text-gray-500 border-r border-gray-200">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
              {weekDays.map(day => {
                const dayEvents = getEventsForDate(day).filter(event => {
                  const eventHour = event.start.getHours();
                  return eventHour === hour;
                });

                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className="min-h-[60px] border-r border-b border-gray-200 p-1 cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      const clickedDate = new Date(day);
                      clickedDate.setHours(hour, 0, 0, 0);
                      onDateClick(clickedDate);
                    }}
                  >
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        className={`text-xs px-2 py-1 rounded text-white cursor-pointer hover:opacity-80 mb-1 ${
                          categoryColors[event.category]
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayEvents = getEventsForDate(currentDate);

    return (
      <div className="bg-white">
        <div className="border-b border-gray-200 py-4 px-6">
          <h3 className="text-lg font-medium text-gray-900">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </h3>
        </div>

        <div className="grid grid-cols-1">
          {hours.map(hour => {
            const hourEvents = dayEvents.filter(event => {
              const eventHour = event.start.getHours();
              return eventHour === hour;
            });

            return (
              <div key={hour} className="flex border-b border-gray-200">
                <div className="w-20 py-4 px-4 text-xs text-gray-500">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </div>
                <div
                  className="flex-1 min-h-[80px] p-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    const clickedDate = new Date(currentDate);
                    clickedDate.setHours(hour, 0, 0, 0);
                    onDateClick(clickedDate);
                  }}
                >
                  {hourEvents.map(event => (
                    <div
                      key={event.id}
                      className={`text-sm px-3 py-2 rounded text-white cursor-pointer hover:opacity-80 mb-2 ${
                        categoryColors[event.category]
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      <div className="font-medium">{event.title}</div>
                      {event.description && (
                        <div className="text-xs opacity-90 mt-1">{event.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-auto">
      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}
    </div>
  );
}
