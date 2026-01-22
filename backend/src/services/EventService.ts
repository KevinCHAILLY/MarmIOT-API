import { getRepository } from "typeorm";
import { Event } from "../entities/Event";

export class EventService {
  async getAllEvents(): Promise<Event[]> {
    return await getRepository(Event).find({ relations: ["sensor"] });
  }

  async createEvent(eventData: Partial<Event>): Promise<Event> {
    const event = getRepository(Event).create(eventData);
    return await getRepository(Event).save(event);
  }

  async getEventById(id: number): Promise<Event | null> {
    return await getRepository(Event).findOne({ where: { id }, relations: ["sensor"] });
  }

  async getEventsBySensorId(sensorId: number): Promise<Event[]> {
    return await getRepository(Event).find({
      where: { sensor: { id: sensorId } },
      relations: ["sensor"],
    });
  }
}