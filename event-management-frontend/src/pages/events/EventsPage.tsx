import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { EventCard } from '@/components/events/EventCard';
import { eventApi } from '@/lib/axios';
import { Event } from '@/types';

export const EventsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ['events', selectedStatus, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedStatus) params.append('status', selectedStatus);
      if (debouncedSearch) params.append('search', debouncedSearch);
      
      const response = await eventApi.get(`/events?${params.toString()}`);
      return response.data;
    },
  });

  const statuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];

  const filteredEvents = events?.filter((event) => {
    const matchesSearch = !debouncedSearch || 
      event.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      event.description.toLowerCase().includes(debouncedSearch.toLowerCase());

    const matchesStatus = !selectedStatus || event.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        <Button onClick={() => navigate('/events/create')}>Create Event</Button>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <SearchInput
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="rounded-md border border-gray-300 px-3 py-2"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : filteredEvents?.length === 0 ? (
        <div className="text-center text-gray-500">
          No events found matching your criteria
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents?.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}; 