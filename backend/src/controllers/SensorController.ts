import { Request, Response } from "express";
import { SensorService } from "../services/SensorService";

export class SensorController {
  private sensorService: SensorService;

  constructor() {
    this.sensorService = new SensorService();
  }

  async getAllSensors(req: Request, res: Response): Promise<void> {
    try {
      const sensors = await this.sensorService.getAllSensors();
      res.json(sensors);
    } catch (error) {
      res.status(500).json({ message: "Error fetching sensors" });
    }
  }

  async createSensor(req: Request, res: Response): Promise<void> {
    try {
      const sensor = await this.sensorService.createSensor(req.body);
      res.status(201).json(sensor);
    } catch (error) {
      res.status(500).json({ message: "Error creating sensor" });
    }
  }

  async getSensorById(req: Request, res: Response): Promise<void> {
    try {
      const sensor = await this.sensorService.getSensorById(Number(req.params.id));
      if (sensor) {
        res.json(sensor);
      } else {
        res.status(404).json({ message: "Sensor not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching sensor" });
    }
  }

  async updateSensor(req: Request, res: Response): Promise<void> {
    try {
      const sensor = await this.sensorService.updateSensor(Number(req.params.id), req.body);
      if (sensor) {
        res.json(sensor);
      } else {
        res.status(404).json({ message: "Sensor not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating sensor" });
    }
  }

  async deleteSensor(req: Request, res: Response): Promise<void> {
    try {
      const success = await this.sensorService.deleteSensor(Number(req.params.id));
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Sensor not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error deleting sensor" });
    }
  }
}