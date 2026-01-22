import request from "supertest";
import { app } from "../index";

describe("Event API", () => {
  it("should create a new event", async () => {
    const sensorResponse = await request(app)
      .post("/api/sensors")
      .send({
        sensorId: "sensor5",
        name: "Test Sensor 5",
        location: "Test Location 5",
      });

    const sensorId = sensorResponse.body.id;

    const response = await request(app)
      .post("/api/events")
      .send({
        type: "button_press",
        data: "Button pressed",
        sensor: { id: sensorId },
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should get all events", async () => {
    const response = await request(app).get("/api/events");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it("should get an event by ID", async () => {
    const sensorResponse = await request(app)
      .post("/api/sensors")
      .send({
        sensorId: "sensor6",
        name: "Test Sensor 6",
        location: "Test Location 6",
      });

    const sensorId = sensorResponse.body.id;

    const createResponse = await request(app)
      .post("/api/events")
      .send({
        type: "connection",
        data: "Connected",
        sensor: { id: sensorId },
      });

    const eventId = createResponse.body.id;

    const response = await request(app).get(`/api/events/${eventId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(eventId);
  });

  it("should get events by sensor ID", async () => {
    const sensorResponse = await request(app)
      .post("/api/sensors")
      .send({
        sensorId: "sensor7",
        name: "Test Sensor 7",
        location: "Test Location 7",
      });

    const sensorId = sensorResponse.body.id;

    await request(app)
      .post("/api/events")
      .send({
        type: "button_press",
        data: "Button pressed",
        sensor: { id: sensorId },
      });

    const response = await request(app).get(`/api/events/sensor/${sensorId}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });
});