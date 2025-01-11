import React, { useState } from 'react';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { eventApi } from '@/lib/axios';
import { Comment } from '@/types';

interface CommentItemProps {
  comment: Comment;
  eventId: string;
  isOwner: boolean;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  eventId,
  isOwner,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async () => {
      await eventApi.put(`/events/${eventId}/comments/${comment._id}`, {
        content: editedContent,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', eventId] });
      setIsEditing(false);
      toast.success('Comment updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update comment');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await eventApi.delete(`/events/${eventId}/comments/${comment._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', eventId] });
      toast.success('Comment deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    },
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedContent.trim()) {
      updateMutation.mutate();
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="py-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium text-gray-900">User {comment.userId}</div>
          <div className="text-sm text-gray-500">
            {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
          </div>
        </div>
        {isOwner && !isEditing && (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
      
      {isEditing ? (
        <form onSubmit={handleUpdate} className="mt-2">
          <textarea
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            rows={3}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <div className="mt-2 flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={updateMutation.isPending}
            >
              Save
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-1 text-gray-700">{comment.content}</div>
      )}
    </div>
  );
}; 