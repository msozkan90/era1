export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  participants: string[];
  maxParticipants?: number | undefined;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface Comment {
  _id: string;
  eventId: string;
  userId: string;
  content: string;
  createdAt: string;
}