import { SensorController } from "../controllers/SensorController";
import { SensorService } from "../services/SensorService";
import { Request, Response } from "express";

// Mock the SensorService
jest.mock("../services/SensorService");

describe("SensorController", () => {
  let sensorController: SensorController;
  let mockSensorService: any;
  let mockRequest: Partial<Request>;
  let mockResponse: any;

  beforeEach(() => {
    mockSensorService = {
      getAllSensors: jest.fn(),
      createSensor: jest.fn(),
      getSensorById: jest.fn(),
      updateSensor: jest.fn(),
      deleteSensor: jest.fn(),
    };
    (SensorService as jest.Mock).mockImplementation(() => mockSensorService);
    
    sensorController = new SensorController();
    
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

  describe("getAllSensors", () => {
    it("should return all sensors", async () => {
      const mockSensors = [
        { id: 1, sensorId: "sensor1", name: "Sensor 1", location: "Location 1", status: "active" },
        { id: 2, sensorId: "sensor2", name: "Sensor 2", location: "Location 2", status: "active" },
      ];
      mockSensorService.getAllSensors.mockResolvedValue(mockSensors);

      await sensorController.getAllSensors(mockRequest as Request, mockResponse);

      expect(mockSensorService.getAllSensors).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockSensors);
    });

    it("should handle errors", async () => {
      mockSensorService.getAllSensors.mockRejectedValue(new Error("Service error"));

      await sensorController.getAllSensors(mockRequest as Request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Error fetching sensors" });
    });
  });

  describe("createSensor", () => {
    it("should create a new sensor", async () => {
      const sensorData = { sensorId: "sensor1", name: "Sensor 1", location: "Location 1" };
      const createdSensor = { id: 1, ...sensorData, status: "active" };
      mockSensorService.createSensor.mockResolvedValue(createdSensor);
      mockRequest.body = sensorData;

      await sensorController.createSensor(mockRequest as Request, mockResponse);

      expect(mockSensorService.createSensor).toHaveBeenCalledWith(sensorData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdSensor);
    });

    it("should handle errors", async () => {
      const sensorData = { sensorId: "sensor1", name: "Sensor 1", location: "Location 1" };
      mockSensorService.createSensor.mockRejectedValue(new Error("Service error"));
      mockRequest.body = sensorData;

      await sensorController.createSensor(mockRequest as Request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Error creating sensor" });
    });
  });

  describe("getSensorById", () => {
    it("should return a sensor by ID", async () => {
      const sensorId = 1;
      const mockSensor = { id: sensorId, sensorId: "sensor1", name: "Sensor 1", location: "Location 1", status: "active" };
      mockSensorService.getSensorById.mockResolvedValue(mockSensor);
      mockRequest.params = { id: sensorId.toString() };

      await sensorController.getSensorById(mockRequest as Request, mockResponse);

      expect(mockSensorService.getSensorById).toHaveBeenCalledWith(sensorId);
      expect(mockResponse.json).toHaveBeenCalledWith(mockSensor);
    });

    it("should return 404 if sensor not found", async () => {
      const sensorId = 1;
      mockSensorService.getSensorById.mockResolvedValue(null);
      mockRequest.params = { id: sensorId.toString() };

      await sensorController.getSensorById(mockRequest as Request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Sensor not found" });
    });

    it("should handle errors", async () => {
      const sensorId = 1;
      mockSensorService.getSensorById.mockRejectedValue(new Error("Service error"));
      mockRequest.params = { id: sensorId.toString() };

      await sensorController.getSensorById(mockRequest as Request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Error fetching sensor" });
    });
  });

  describe("updateSensor", () => {
    it("should update a sensor", async () => {
      const sensorId = 1;
      const sensorData = { name: "Updated Sensor" };
      const updatedSensor = { id: sensorId, sensorId: "sensor1", name: "Updated Sensor", location: "Location 1", status: "active" };
      mockSensorService.updateSensor.mockResolvedValue(updatedSensor);
      mockRequest.params = { id: sensorId.toString() };
      mockRequest.body = sensorData;

      await sensorController.updateSensor(mockRequest as Request, mockResponse);

      expect(mockSensorService.updateSensor).toHaveBeenCalledWith(sensorId, sensorData);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedSensor);
    });

    it("should return 404 if sensor not found", async () => {
      const sensorId = 1;
      const sensorData = { name: "Updated Sensor" };
      mockSensorService.updateSensor.mockResolvedValue(null);
      mockRequest.params = { id: sensorId.toString() };
      mockRequest.body = sensorData;

      await sensorController.updateSensor(mockRequest as Request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Sensor not found" });
    });

    it("should handle errors", async () => {
      const sensorId = 1;
      const sensorData = { name: "Updated Sensor" };
      mockSensorService.updateSensor.mockRejectedValue(new Error("Service error"));
      mockRequest.params = { id: sensorId.toString() };
      mockRequest.body = sensorData;

      await sensorController.updateSensor(mockRequest as Request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Error updating sensor" });
    });
  });

  describe("deleteSensor", () => {
    it("should delete a sensor", async () => {
      const sensorId = 1;
      mockSensorService.deleteSensor.mockResolvedValue(true);
      mockRequest.params = { id: sensorId.toString() };

      await sensorController.deleteSensor(mockRequest as Request, mockResponse);

      expect(mockSensorService.deleteSensor).toHaveBeenCalledWith(sensorId);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it("should return 404 if sensor not found", async () => {
      const sensorId = 1;
      mockSensorService.deleteSensor.mockResolvedValue(false);
      mockRequest.params = { id: sensorId.toString() };

      await sensorController.deleteSensor(mockRequest as Request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Sensor not found" });
    });

    it("should handle errors", async () => {
      const sensorId = 1;
      mockSensorService.deleteSensor.mockRejectedValue(new Error("Service error"));
      mockRequest.params = { id: sensorId.toString() };

      await sensorController.deleteSensor(mockRequest as Request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Error deleting sensor" });
    });
  });
});