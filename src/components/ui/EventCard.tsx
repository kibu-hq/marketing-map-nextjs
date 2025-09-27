'use client';

import { Event } from '@/lib/types';
import ImageWithFallback from './image-with-fallback';
import { ArrowUpRight, Calendar, MapPin } from 'lucide-react';

interface EventCardProps {
  event: Event;
}

const formatDateRange = (startDate: string, endDate?: string) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };

  if (end && start.getTime() !== end.getTime()) {
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  }
  return start.toLocaleDateString('en-US', options);
};

const formatLocation = (city?: string, state?: string) => {
  if (city && state) {
    return `${city}, ${state}`;
  }
  if (city) {
    return city;
  }
  if (state) {
    return state;
  }
  return null;
};

export default function EventCard({ event }: EventCardProps) {
  const handleCardClick = () => {
    window.open(event.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex items-start gap-4 bg-orange-50/70 border border-orange-200/80 rounded-lg p-4 transition-all duration-200 shadow-lg shadow-orange-500/10 hover:bg-orange-100/70 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/20 cursor-pointer"
    >
      <div className="flex-shrink-0">
        <ImageWithFallback
          src={event.image_url}
          alt={event.name}
          width={60}
          height={60}
          className="rounded-lg"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-orange-600 font-medium mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDateRange(event.start_date, event.end_date)}</span>
        </div>
        {formatLocation(event.city, event.state) && (
          <div className="flex items-center gap-2 text-xs text-gray-600 font-medium mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{formatLocation(event.city, event.state)}</span>
          </div>
        )}
        <h4 className="font-semibold text-gray-800 mb-1 line-clamp-2">
          {event.name}
        </h4>
        <p className="text-sm text-gray-700 mb-3">{
          event.description
        }</p>
        <span className="text-sm text-orange-600 font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all duration-200">
          View Event
          <ArrowUpRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </div>
  );
}
