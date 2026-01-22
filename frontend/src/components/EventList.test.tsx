import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import EventList from "./EventList";
import { getEvents } from "../api";

// Mock the API module
jest.mock("../api");

describe("EventList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading state initially", () => {
    render(<EventList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render events when data is loaded", async () => {
    const mockEvents = [
      { id: 1, type: "button_press", data: "Button pressed", createdAt: "2023-01-01T00:00:00.000Z" },
      { id: 2, type: "connection", data: "Connected", createdAt: "2023-01-01T00:01:00.000Z" },
    ];
    (getEvents as jest.Mock).mockResolvedValue(mockEvents);

    render(<EventList />);

    await waitFor(() => {
      expect(screen.getByText("Events")).toBeInTheDocument();
      expect(screen.getByText("button_press - Button pressed - 2023-01-01T00:00:00.000Z")).toBeInTheDocument();
      expect(screen.getByText("connection - Connected - 2023-01-01T00:01:00.000Z")).toBeInTheDocument();
    });
  });

  it("should render error message when data fetching fails", async () => {
    (getEvents as jest.Mock).mockRejectedValue(new Error("Failed to fetch events"));

    render(<EventList />);

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch events")).toBeInTheDocument();
    });
  });
});