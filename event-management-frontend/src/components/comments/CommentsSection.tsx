import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { CommentItem } from './CommentItem';
import { eventApi } from '@/lib/axios';
import { Comment } from '@/types';
import { useAuthStore } from '@/stores/authStore';

interface CommentsSectionProps {
  eventId: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ eventId }) => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [newComment, setNewComment] = useState('');

  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: ['comments', eventId],
    queryFn: async () => {
      const response = await eventApi.get(`/events/${eventId}/comments`);
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (content: string) => {
      await eventApi.post(`/events/${eventId}/comments`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', eventId] });
      setNewComment('');
      toast.success('Comment added successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    createMutation.mutate(newComment);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Comments</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          rows={3}
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="mt-2 flex justify-end">
          <Button
            type="submit"
            isLoading={createMutation.isPending}
            disabled={!newComment.trim()}
          >
            Post Comment
          </Button>
        </div>
      </form>

      {isLoading ? (
        <div className="text-center">Loading comments...</div>
      ) : (
        <div className="space-y-4 divide-y divide-gray-200">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              eventId={eventId}
              isOwner={String(comment.userId) === String(user?.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};