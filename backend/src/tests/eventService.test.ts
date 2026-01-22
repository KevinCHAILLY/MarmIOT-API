import { EventService } from "../services/EventService";
import { getRepository } from "typeorm";
import { Event } from "../entities/Event";

// Mock the getRepository function
jest.mock("typeorm", () => ({
  getRepository: jest.fn(),
}));

describe("EventService", () => {
  let eventService: EventService;
  let mockRepository: any;

  beforeEach(() => {
    eventService = new EventService();
    mockRepository = {
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };
    (getRepository as jest.Mock).mockReturnValue(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllEvents", () => {
    it("should return all events with sensor relations", async () => {
      const mockEvents = [
        { id: 1, type: "button_press", data: "Button pressed", sensor: { id: 1, sensorId: "sensor1" } },
        { id: 2, type: "connection", data: "Connected", sensor: { id: 1, sensorId: "sensor1" } },
      ];
      mockRepository.find.mockResolvedValue(mockEvents);

      const events = await eventService.getAllEvents();

      expect(events).toEqual(mockEvents);
      expect(mockRepository.find).toHaveBeenCalledWith({ relations: ["sensor"] });
    });

    it("should handle errors", async () => {
      mockRepository.find.mockRejectedValue(new Error("Database error"));

      await expect(eventService.getAllEvents()).rejects.toThrow("Database error");
    });
  });

  describe("createEvent", () => {
    it("should create a new event", async () => {
      const eventData = { type: "button_press", data: "Button pressed", sensor: { id: 1 } };
      const createdEvent = { id: 1, ...eventData };
      mockRepository.create.mockReturnValue(createdEvent);
      mockRepository.save.mockResolvedValue(createdEvent);

      const event = await eventService.createEvent(eventData);

      expect(event).toEqual(createdEvent);
      expect(mockRepository.create).toHaveBeenCalledWith(eventData);
      expect(mockRepository.save).toHaveBeenCalledWith(createdEvent);
    });

    it("should handle errors", async () => {
      const eventData = { type: "button_press", data: "Button pressed", sensor: { id: 1 } };
      mockRepository.create.mockReturnValue(eventData);
      mockRepository.save.mockRejectedValue(new Error("Database error"));

      await expect(eventService.createEvent(eventData)).rejects.toThrow("Database error");
    });
  });

  describe("getEventById", () => {
    it("should return an event by ID with sensor relations", async () => {
      const eventId = 1;
      const mockEvent = { id: eventId, type: "button_press", data: "Button pressed", sensor: { id: 1, sensorId: "sensor1" } };
      mockRepository.findOne.mockResolvedValue(mockEvent);

      const event = await eventService.getEventById(eventId);

      expect(event).toEqual(mockEvent);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: eventId }, relations: ["sensor"] });
    });

    it("should return null if event not found", async () => {
      const eventId = 1;
      mockRepository.findOne.mockResolvedValue(null);

      const event = await eventService.getEventById(eventId);

      expect(event).toBeNull();
    });

    it("should handle errors", async () => {
      const eventId = 1;
      mockRepository.findOne.mockRejectedValue(new Error("Database error"));

      await expect(eventService.getEventById(eventId)).rejects.toThrow("Database error");
    });
  });

  describe("getEventsBySensorId", () => {
    it("should return events by sensor ID with sensor relations", async () => {
      const sensorId = 1;
      const mockEvents = [
        { id: 1, type: "button_press", data: "Button pressed", sensor: { id: sensorId, sensorId: "sensor1" } },
        { id: 2, type: "connection", data: "Connected", sensor: { id: sensorId, sensorId: "sensor1" } },
      ];
      mockRepository.find.mockResolvedValue(mockEvents);

      const events = await eventService.getEventsBySensorId(sensorId);

      expect(events).toEqual(mockEvents);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { sensor: { id: sensorId } },
        relations: ["sensor"],
      });
    });

    it("should handle errors", async () => {
      const sensorId = 1;
      mockRepository.find.mockRejectedValue(new Error("Database error"));

      await expect(eventService.getEventsBySensorId(sensorId)).rejects.toThrow("Database error");
    });
  });
});