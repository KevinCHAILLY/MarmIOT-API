import axios from "axios";
import { api, getSensors, createSensor, getEvents, createEvent } from "./api";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("api", () => {
    it("should create an axios instance with correct base URL", () => {
      expect(api.defaults.baseURL).toBe("http://localhost:3000/api");
      expect(api.defaults.headers["Content-Type"]).toBe("application/json");
    });
  });

  describe("getSensors", () => {
    it("should make a GET request to /sensors", async () => {
      const mockData = [{ id: 1, sensorId: "sensor1", name: "Sensor 1" }];
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const data = await getSensors();

      expect(mockedAxios.get).toHaveBeenCalledWith("/sensors");
      expect(data).toEqual(mockData);
    });

    it("should handle errors", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Network error"));

      await expect(getSensors()).rejects.toThrow("Network error");
    });
  });

  describe("createSensor", () => {
    it("should make a POST request to /sensors", async () => {
      const sensorData = { sensorId: "sensor1", name: "Sensor 1" };
      const mockData = { id: 1, ...sensorData };
      mockedAxios.post.mockResolvedValue({ data: mockData });

      const data = await createSensor(sensorData);

      expect(mockedAxios.post).toHaveBeenCalledWith("/sensors", sensorData);
      expect(data).toEqual(mockData);
    });

    it("should handle errors", async () => {
      const sensorData = { sensorId: "sensor1", name: "Sensor 1" };
      mockedAxios.post.mockRejectedValue(new Error("Network error"));

      await expect(createSensor(sensorData)).rejects.toThrow("Network error");
    });
  });

  describe("getEvents", () => {
    it("should make a GET request to /events", async () => {
      const mockData = [{ id: 1, type: "button_press", data: "Button pressed" }];
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const data = await getEvents();

      expect(mockedAxios.get).toHaveBeenCalledWith("/events");
      expect(data).toEqual(mockData);
    });

    it("should handle errors", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Network error"));

      await expect(getEvents()).rejects.toThrow("Network error");
    });
  });

  describe("createEvent", () => {
    it("should make a POST request to /events", async () => {
      const eventData = { type: "button_press", data: "Button pressed" };
      const mockData = { id: 1, ...eventData };
      mockedAxios.post.mockResolvedValue({ data: mockData });

      const data = await createEvent(eventData);

      expect(mockedAxios.post).toHaveBeenCalledWith("/events", eventData);
      expect(data).toEqual(mockData);
    });

    it("should handle errors", async () => {
      const eventData = { type: "button_press", data: "Button pressed" };
      mockedAxios.post.mockRejectedValue(new Error("Network error"));

      await expect(createEvent(eventData)).rejects.toThrow("Network error");
    });
  });
});