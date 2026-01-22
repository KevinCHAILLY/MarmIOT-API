import { SensorService } from "../services/SensorService";
import { getRepository } from "typeorm";
import { Sensor } from "../entities/Sensor";

// Mock the getRepository function
jest.mock("typeorm", () => ({
  getRepository: jest.fn(),
}));

describe("SensorService", () => {
  let sensorService: SensorService;
  let mockRepository: any;

  beforeEach(() => {
    sensorService = new SensorService();
    mockRepository = {
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    (getRepository as jest.Mock).mockReturnValue(mockRepository);
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
      mockRepository.find.mockResolvedValue(mockSensors);

      const sensors = await sensorService.getAllSensors();

      expect(sensors).toEqual(mockSensors);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it("should handle errors", async () => {
      mockRepository.find.mockRejectedValue(new Error("Database error"));

      await expect(sensorService.getAllSensors()).rejects.toThrow("Database error");
    });
  });

  describe("createSensor", () => {
    it("should create a new sensor", async () => {
      const sensorData = { sensorId: "sensor1", name: "Sensor 1", location: "Location 1" };
      const createdSensor = { id: 1, ...sensorData, status: "active" };
      mockRepository.create.mockReturnValue(createdSensor);
      mockRepository.save.mockResolvedValue(createdSensor);

      const sensor = await sensorService.createSensor(sensorData);

      expect(sensor).toEqual(createdSensor);
      expect(mockRepository.create).toHaveBeenCalledWith(sensorData);
      expect(mockRepository.save).toHaveBeenCalledWith(createdSensor);
    });

    it("should handle errors", async () => {
      const sensorData = { sensorId: "sensor1", name: "Sensor 1", location: "Location 1" };
      mockRepository.create.mockReturnValue(sensorData);
      mockRepository.save.mockRejectedValue(new Error("Database error"));

      await expect(sensorService.createSensor(sensorData)).rejects.toThrow("Database error");
    });
  });

  describe("getSensorById", () => {
    it("should return a sensor by ID", async () => {
      const sensorId = 1;
      const mockSensor = { id: sensorId, sensorId: "sensor1", name: "Sensor 1", location: "Location 1", status: "active" };
      mockRepository.findOne.mockResolvedValue(mockSensor);

      const sensor = await sensorService.getSensorById(sensorId);

      expect(sensor).toEqual(mockSensor);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: sensorId } });
    });

    it("should return null if sensor not found", async () => {
      const sensorId = 1;
      mockRepository.findOne.mockResolvedValue(null);

      const sensor = await sensorService.getSensorById(sensorId);

      expect(sensor).toBeNull();
    });

    it("should handle errors", async () => {
      const sensorId = 1;
      mockRepository.findOne.mockRejectedValue(new Error("Database error"));

      await expect(sensorService.getSensorById(sensorId)).rejects.toThrow("Database error");
    });
  });

  describe("updateSensor", () => {
    it("should update a sensor", async () => {
      const sensorId = 1;
      const sensorData = { name: "Updated Sensor" };
      const updatedSensor = { id: sensorId, sensorId: "sensor1", name: "Updated Sensor", location: "Location 1", status: "active" };
      mockRepository.update.mockResolvedValue({});
      mockRepository.findOne.mockResolvedValue(updatedSensor);

      const sensor = await sensorService.updateSensor(sensorId, sensorData);

      expect(sensor).toEqual(updatedSensor);
      expect(mockRepository.update).toHaveBeenCalledWith(sensorId, sensorData);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: sensorId } });
    });

    it("should return null if sensor not found", async () => {
      const sensorId = 1;
      const sensorData = { name: "Updated Sensor" };
      mockRepository.update.mockResolvedValue({});
      mockRepository.findOne.mockResolvedValue(null);

      const sensor = await sensorService.updateSensor(sensorId, sensorData);

      expect(sensor).toBeNull();
    });

    it("should handle errors", async () => {
      const sensorId = 1;
      const sensorData = { name: "Updated Sensor" };
      mockRepository.update.mockRejectedValue(new Error("Database error"));

      await expect(sensorService.updateSensor(sensorId, sensorData)).rejects.toThrow("Database error");
    });
  });

  describe("deleteSensor", () => {
    it("should delete a sensor", async () => {
      const sensorId = 1;
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await sensorService.deleteSensor(sensorId);

      expect(result).toBe(true);
      expect(mockRepository.delete).toHaveBeenCalledWith(sensorId);
    });

    it("should return false if sensor not found", async () => {
      const sensorId = 1;
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await sensorService.deleteSensor(sensorId);

      expect(result).toBe(false);
    });

    it("should handle errors", async () => {
      const sensorId = 1;
      mockRepository.delete.mockRejectedValue(new Error("Database error"));

      await expect(sensorService.deleteSensor(sensorId)).rejects.toThrow("Database error");
    });
  });
});