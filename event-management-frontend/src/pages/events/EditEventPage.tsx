import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { eventApi } from '@/lib/axios';
import { Event } from '@/types';

const editEventSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  date: Yup.date()
    .min(new Date(), 'Date cannot be in the past')
    .required('Date is required'),
  location: Yup.string().required('Location is required'),
  category: Yup.string().required('Category is required'),
  maxParticipants: Yup.number()
    .min(1, 'Must allow at least 1 participant')
    .nullable(),
});

export const EditEventPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: event, isLoading } = useQuery<Event>({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await eventApi.get(`/events/${id}`);
      return response.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: Partial<Event>) => {
      await eventApi.put(`/events/${id}`, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      toast.success('Event updated successfully!');
      navigate(`/events/${id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update event');
    },
  });

  const formik = useFormik({
    initialValues: {
      title: event?.title || '',
      description: event?.description || '',
      date: event ? new Date(event.date).toISOString().slice(0, 16) : '',
      location: event?.location || '',
      category: event?.category || '',
      maxParticipants: event?.maxParticipants?.toString() || '',
    },
    validationSchema: editEventSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      updateMutation.mutate({
        ...values,
        maxParticipants: values.maxParticipants ? Number(values.maxParticipants) : undefined,
      });
    },
  });

  const categories = ['Sports', 'Music', 'Technology', 'Art', 'Food', 'Other'];

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!event) {
    return <div className="text-center">Event not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Event</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <Input
            id="title"
            name="title"
            type="text"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title ? formik.errors.title : undefined}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
              formik.touched.description && formik.errors.description
                ? 'border-red-500'
                : ''
            }`}
            value={formik.values.description}
            onChange={formik.handleChange}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date and Time
          </label>
          <Input
            id="date"
            name="date"
            type="datetime-local"
            value={formik.values.date}
            onChange={formik.handleChange}
            error={formik.touched.date ? formik.errors.date : undefined}
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <Input
            id="location"
            name="location"
            type="text"
            value={formik.values.location}
            onChange={formik.handleChange}
            error={formik.touched.location ? formik.errors.location : undefined}
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
              formik.touched.category && formik.errors.category ? 'border-red-500' : ''
            }`}
            value={formik.values.category}
            onChange={formik.handleChange}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {formik.touched.category && formik.errors.category && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.category}</p>
          )}
        </div>

        <div>
          <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700">
            Maximum Participants (Optional)
          </label>
          <Input
            id="maxParticipants"
            name="maxParticipants"
            type="number"
            value={formik.values.maxParticipants}
            onChange={formik.handleChange}
            error={formik.touched.maxParticipants ? formik.errors.maxParticipants : undefined}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/events/${id}`)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={updateMutation.isPending}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}; 