export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: string;
  participants: string[];
  maxParticipants?: number;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  eventId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventInput {
  title: string;
  description: string;
  date: Date;
  location: string;
  maxParticipants?: number;
  category: string;
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  date?: Date;
  location?: string;
  maxParticipants?: number;
  category?: string;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}