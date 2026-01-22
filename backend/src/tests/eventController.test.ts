import { EventController } from "../controllers/EventController";
import { EventService } from "../services/EventService";
import { Request, Response } from "express";

// Mock the EventService
jest.mock("../services/EventService");

describe("EventController", () => {
  let eventController: EventController;
  let mockEventService: any;
  let mockRequest: Partial<Request>;
  let mockResponse: any;

  beforeEach(() => {
    mockEventService = {
      getAllEvents: jest.fn(),
      createEvent: jest.fn(),
      getEventById: jest.fn(),
      getEventsBySensorId: jest.fn(),
    };
    (EventService as jest.Mock).mockImplementation(() => mockEventService);
    
    eventController = new EventController();
    
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllEvents", () => {
    it("should return all events", async () => {
      const mockEvents = [
        { id: 1, type: "button_press", data: "Button pressed", sensor: { id: 1, sensorId: "sensor1" } },
        { id: 2, type: "connection", data: "Connected", sensor: { id: 1, sensorId: "sensor1" } },
      ];
      mockEventService.getAllEvents.mockResolvedValue(mockEvents);

      await eventController.getAllEvents(mockRequest as Request, mockResponse);

      expect(mockEventService.getAllEvents).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockEvents);
    });

    it("should handle errors", async () => {
      mockEventService.getAllEvents.mockRejectedValue(new Error("Service error"));

      await eventController.getAllEvents(mockRequest as Request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Error fetching events" });
    });
  });

  describe("createEvent", () => {
    it("should create a new event", async () => {
      const eventData = { type: "button_press", data: "Button pressed", sensor: { id: 1 } };
      const createdEvent = { id: 1, ...eventData };
      mockEventService.createEvent.mockResolvedValue(createdEvent);
      mockRequest.body = eventData;

      await eventController.createEvent(mockRequest as Request, mockResponse);

      expect(mockEventService.createEvent).toHaveBeenCalledWith(eventData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdEvent);
    });

    it("should handle errors", async () => {
      const eventData = { type: "button_press", data: "Button pressed", sensor: { id: 1 } };
      mockEventService.createEvent.mockRejectedValue(new Error("Service error"));
      mockRequest.body = eventData;

      await eventController.createEvent(mockRequest as Request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Error creating event" });
    });
  });

  describe("getEventById", () => {
    it("should return an event by ID", async () => {
      const eventId = 1;
      const mockEvent = { id: eventId, type: "button_press", data: "Button pressed", sensor: { id: 1, sensorId: "sensor1" } };
      mockEventService.getEventById.mockResolvedValue(mockEvent);
      mockRequest.params = { id: eventId.toString() };

      await eventController.getEventById(mockRequest as Request, mockResponse);

      expect(mockEventService.getEventById).toHaveBeenCalledWith(eventId);
      expect(mockResponse.json).toHaveBeenCalledWith(mockEvent);
    });

    it("should return 404 if event not found", async () => {
      const eventId = 1;
      mockEventService.getEventById.mockResolvedValue(null);
      mockRequest.params = { id: eventId.toString() };

      await eventController.getEventById(mockRequest as Request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Event not found" });
    });

    it("should handle errors", async () => {
      const eventId = 1;
      mockEventService.getEventById.mockRejectedValue(new Error("Service error"));
      mockRequest.params = { id: eventId.toString() };

      await eventController.getEventById(mockRequest as Request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Error fetching event" });
    });
  });

  describe("getEventsBySensorId", () => {
    it("should return events by sensor ID", async () => {
      const sensorId = 1;
      const mockEvents = [
        { id: 1, type: "button_press", data: "Button pressed", sensor: { id: sensorId, sensorId: "sensor1" } },
        { id: 2, type: "connection", data: "Connected", sensor: { id: sensorId, sensorId: "sensor1" } },
      ];
      mockEventService.getEventsBySensorId.mockResolvedValue(mockEvents);
      mockRequest.params = { sensorId: sensorId.toString() };

      await eventController.getEventsBySensorId(mockRequest as Request, mockResponse);

      expect(mockEventService.getEventsBySensorId).toHaveBeenCalledWith(sensorId);
      expect(mockResponse.json).toHaveBeenCalledWith(mockEvents);
    });

    it("should handle errors", async () => {
      const sensorId = 1;
      mockEventService.getEventsBySensorId.mockRejectedValue(new Error("Service error"));
      mockRequest.params = { sensorId: sensorId.toString() };

      await eventController.getEventsBySensorId(mockRequest as Request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Error fetching events" });
    });
  });
});