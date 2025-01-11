import { Request, Response } from 'express';
import { Event } from '../models/event.model';
import { CreateEventInput, UpdateEventInput } from '../types';
import { AuthRequest } from '../middleware/auth';

export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const eventData: CreateEventInput = req.body;
    const userId = req.user?.userId;

    const event = new Event({
      ...eventData,
      organizer: userId,
      participants: [userId]
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Error creating event' });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const { category, status } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
    if (status) filter.status = status;

    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Error fetching event' });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    const eventData: UpdateEventInput = req.body;
    const userId = req.user?.userId;

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (String(event.organizer) !== String(userId)) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      eventData,
      { new: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Error updating event' });
  }
};

export const joinEvent = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.participants.includes(userId!)) {
      return res.status(400).json({ message: 'Already joined this event' });
    }

    if (event.maxParticipants && event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' });
    }

    event.participants.push(userId!);
    await event.save();

    res.json(event);
  } catch (error) {
    console.error('Join event error:', error);
    res.status(500).json({ message: 'Error joining event' });
  }
};

export const updateEventStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { status } = req.body;

    const validStatuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (String(event.organizer) !== String(userId)) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    event.status = status;
    await event.save();

    res.json(event);
  } catch (error) {
    console.error('Update event status error:', error);
    res.status(500).json({ message: 'Error updating event status' });
  }
};