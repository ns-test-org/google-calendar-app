export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  category: EventCategory;
  isRecurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly';
  recurringEnd?: Date;
}

export type EventCategory = 
  | 'work'
  | 'personal'
  | 'health'
  | 'social'
  | 'travel'
  | 'other';

export const categoryColors: Record<EventCategory, string> = {
  work: 'bg-blue-500',
  personal: 'bg-green-500',
  health: 'bg-red-500',
  social: 'bg-purple-500',
  travel: 'bg-orange-500',
  other: 'bg-gray-500',
};

export const categoryLabels: Record<EventCategory, string> = {
  work: 'Work',
  personal: 'Personal',
  health: 'Health',
  social: 'Social',
  travel: 'Travel',
  other: 'Other',
};
