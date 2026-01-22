import request from "supertest";
import { app } from "../index";

describe("Sensor API", () => {
  it("should create a new sensor", async () => {
    const response = await request(app)
      .post("/api/sensors")
      .send({
        sensorId: "sensor1",
        name: "Test Sensor",
        location: "Test Location",
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should get all sensors", async () => {
    const response = await request(app).get("/api/sensors");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it("should get a sensor by ID", async () => {
    const createResponse = await request(app)
      .post("/api/sensors")
      .send({
        sensorId: "sensor2",
        name: "Test Sensor 2",
        location: "Test Location 2",
      });

    const sensorId = createResponse.body.id;

    const response = await request(app).get(`/api/sensors/${sensorId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(sensorId);
  });

  it("should update a sensor", async () => {
    const createResponse = await request(app)
      .post("/api/sensors")
      .send({
        sensorId: "sensor3",
        name: "Test Sensor 3",
        location: "Test Location 3",
      });

    const sensorId = createResponse.body.id;

    const response = await request(app)
      .put(`/api/sensors/${sensorId}`)
      .send({
        name: "Updated Sensor",
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Updated Sensor");
  });

  it("should delete a sensor", async () => {
    const createResponse = await request(app)
      .post("/api/sensors")
      .send({
        sensorId: "sensor4",
        name: "Test Sensor 4",
        location: "Test Location 4",
      });

    const sensorId = createResponse.body.id;

    const response = await request(app).delete(`/api/sensors/${sensorId}`);
    expect(response.status).toBe(204);
  });
});