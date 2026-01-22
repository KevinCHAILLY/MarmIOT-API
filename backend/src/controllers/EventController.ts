import { Request, Response } from "express";
import { EventService } from "../services/EventService";

export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  async getAllEvents(req: Request, res: Response): Promise<void> {
    try {
      const events = await this.eventService.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Error fetching events" });
    }
  }

  async createEvent(req: Request, res: Response): Promise<void> {
    try {
      const event = await this.eventService.createEvent(req.body);
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ message: "Error creating event" });
    }
  }

  async getEventById(req: Request, res: Response): Promise<void> {
    try {
      const event = await this.eventService.getEventById(Number(req.params.id));
      if (event) {
        res.json(event);
      } else {
        res.status(404).json({ message: "Event not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching event" });
    }
  }

  async getEventsBySensorId(req: Request, res: Response): Promise<void> {
    try {
      const events = await this.eventService.getEventsBySensorId(Number(req.params.sensorId));
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Error fetching events" });
    }
  }
}