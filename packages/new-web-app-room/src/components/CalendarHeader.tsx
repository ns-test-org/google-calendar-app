'use client';

import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/24/outline';

interface CalendarHeaderProps {
  currentDate: Date;
  view: 'month' | 'week' | 'day';
  onViewChange: (view: 'month' | 'week' | 'day') => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onToday: () => void;
  onCreateEvent: () => void;
}

export function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onNavigate,
  onToday,
  onCreateEvent,
}: CalendarHeaderProps) {
  const formatTitle = () => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      year: 'numeric',
    };

    if (view === 'day') {
      return currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }

    return currentDate.toLocaleDateString('en-US', options);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
          
          <button
            onClick={onToday}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Today
          </button>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => onNavigate('prev')}
              className="p-1.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onNavigate('next')}
              className="p-1.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>

          <h2 className="text-xl font-medium text-gray-900 min-w-[200px]">
            {formatTitle()}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['month', 'week', 'day'] as const).map((viewType) => (
              <button
                key={viewType}
                onClick={() => onViewChange(viewType)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  view === viewType
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={onCreateEvent}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Event
          </button>
        </div>
      </div>
    </header>
  );
}
