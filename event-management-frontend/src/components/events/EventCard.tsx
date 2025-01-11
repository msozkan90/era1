import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Event } from '@/types';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            event.status === 'upcoming' ? 'bg-green-100 text-green-800' :
            event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
            event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
            'bg-red-100 text-red-800'
          }`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
          <span className="text-sm text-gray-500">
            {format(new Date(event.date), 'MMM d, yyyy')}
          </span>
        </div>
        <Link to={`/events/${event._id}`} className="mt-3 block">
          <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
          <p className="mt-2 text-gray-500 line-clamp-2">{event.description}</p>
        </Link>
        <div className="mt-4">
          <div className="flex items-center text-sm text-gray-500">
            <svg
              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {event.location}
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <svg
              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            {event.participants.length} participants
            {event.maxParticipants && ` / ${event.maxParticipants} max`}
          </div>
        </div>
      </div>
    </div>
  );
};