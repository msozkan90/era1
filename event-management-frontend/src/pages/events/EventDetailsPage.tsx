import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { eventApi } from '@/lib/axios';
import { Event } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { CommentsSection } from '@/components/comments/CommentsSection';

export const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const { data: event, isLoading } = useQuery<Event>({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await eventApi.get(`/events/${id}`);
      return response.data;
    },
  });

  const joinMutation = useMutation({
    mutationFn: async () => {
      await eventApi.post(`/events/${id}/join`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      toast.success('Successfully joined the event!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to join event');
    },
  });

  const leaveMutation = useMutation({
    mutationFn: async () => {
      await eventApi.post(`/events/${id}/leave`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      toast.success('Successfully left the event!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to leave event');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await eventApi.delete(`/events/${id}`);
    },
    onSuccess: () => {
      toast.success('Event deleted successfully!');
      navigate('/events');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete event');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      await eventApi.put(`/events/${id}/status`, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      toast.success('Event status updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update event status');
    },
  });

  const handleDeleteEvent = () => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (window.confirm('Are you sure you want to change the event status?')) {
      updateStatusMutation.mutate(e.target.value);
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!event) {
    return <div className="text-center">Event not found</div>;
  }
  const isOrganizer = String(event.organizer) === String(user?.id);
  const hasJoined = event.participants.includes(user?.id || '');
  const isFull = event.maxParticipants && event.participants.length >= event.maxParticipants;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            <div className="mt-2 flex items-center space-x-4">
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                event.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
              <span className="text-gray-500">
                {format(new Date(event.date), 'PPP p')}
              </span>
            </div>
          </div>
          {!isOrganizer && event.status === 'upcoming' && (
            hasJoined ? (
              <Button
                variant="outline"
                onClick={() => leaveMutation.mutate()}
                isLoading={leaveMutation.isPending}
              >
                Leave Event
              </Button>
            ) : (
              <Button
                onClick={() => joinMutation.mutate()}
                disabled={isFull || joinMutation.isPending}
                isLoading={joinMutation.isPending}
              >
                {isFull ? 'Event Full' : 'Join Event'}
              </Button>
            )
          )}
        </div>

        <div className="prose max-w-none">
          <p>{event.description}</p>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <p className="mt-1 text-sm text-gray-900">{event.location}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Category</h3>
              <p className="mt-1 text-sm text-gray-900">{event.category}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Participants</h3>
              <p className="mt-1 text-sm text-gray-900">
                {event.participants.length}
                {event.maxParticipants && ` / ${event.maxParticipants}`}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Organizer</h3>
              <p className="mt-1 text-sm text-gray-900">
                {isOrganizer ? 'You' : 'Another user'} {/* We should fetch user details */}
              </p>
            </div>
          </div>
        </div>

        {isOrganizer && (
          <div className="mt-6 flex justify-end space-x-4">
            <select
              className="rounded-md border border-gray-300 px-3 py-2"
              value={event.status}
              onChange={handleStatusChange}
              disabled={updateStatusMutation.isPending}
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button
              variant="outline"
              onClick={() => navigate(`/events/${id}/edit`)}
            >
              Edit Event
            </Button>
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700"
              onClick={handleDeleteEvent}
              isLoading={deleteMutation.isPending}
            >
              Delete Event
            </Button>
          </div>
        )}
      </div>

      <div className="mt-8 bg-white shadow-sm rounded-lg p-6">
        <CommentsSection eventId={id!} />
      </div>
    </div>
  );
};