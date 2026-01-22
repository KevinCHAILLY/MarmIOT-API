import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getSensors = async () => {
  const response = await api.get("/sensors");
  return response.data;
};

export const createSensor = async (sensorData: any) => {
  const response = await api.post("/sensors", sensorData);
  return response.data;
};

export const getEvents = async () => {
  const response = await api.get("/events");
  return response.data;
};

export const createEvent = async (eventData: any) => {
  const response = await api.post("/events", eventData);
  return response.data;
};