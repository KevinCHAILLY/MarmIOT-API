import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SensorList from "./SensorList";
import { getSensors } from "../api";

// Mock the API module
jest.mock("../api");

describe("SensorList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading state initially", () => {
    render(<SensorList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render sensors when data is loaded", async () => {
    const mockSensors = [
      { id: 1, sensorId: "sensor1", name: "Sensor 1", location: "Location 1", status: "active" },
      { id: 2, sensorId: "sensor2", name: "Sensor 2", location: "Location 2", status: "active" },
    ];
    (getSensors as jest.Mock).mockResolvedValue(mockSensors);

    render(<SensorList />);

    await waitFor(() => {
      expect(screen.getByText("Sensors")).toBeInTheDocument();
      expect(screen.getByText("Sensor 1 - Location 1 - active")).toBeInTheDocument();
      expect(screen.getByText("Sensor 2 - Location 2 - active")).toBeInTheDocument();
    });
  });

  it("should render error message when data fetching fails", async () => {
    (getSensors as jest.Mock).mockRejectedValue(new Error("Failed to fetch sensors"));

    render(<SensorList />);

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch sensors")).toBeInTheDocument();
    });
  });
});