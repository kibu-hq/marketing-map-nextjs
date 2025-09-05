'use client';

import { Event } from '@/lib/types';
import ImageWithFallback from './image-with-fallback';
import { ArrowUpRight } from 'lucide-react';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const handleCardClick = () => {
    window.open(event.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex items-center gap-4 bg-white/70 border border-black/6 rounded-xl p-4 transition-all duration-200 hover:bg-white/90 hover:border-blue-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
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
        <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {event.name}
        </h4>
        <p className="text-sm text-gray-600 mb-2 line-clamp-3">{
          event.description
        }</p>
        <span className="text-sm text-blue-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
          View Event
          <ArrowUpRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </div>
  );
}
