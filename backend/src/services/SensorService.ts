import { getRepository } from "typeorm";
import { Sensor } from "../entities/Sensor";

export class SensorService {
  async getAllSensors(): Promise<Sensor[]> {
    return await getRepository(Sensor).find();
  }

  async createSensor(sensorData: Partial<Sensor>): Promise<Sensor> {
    const sensor = getRepository(Sensor).create(sensorData);
    return await getRepository(Sensor).save(sensor);
  }

  async getSensorById(id: number): Promise<Sensor | null> {
    return await getRepository(Sensor).findOne({ where: { id } });
  }

  async updateSensor(id: number, sensorData: Partial<Sensor>): Promise<Sensor | null> {
    await getRepository(Sensor).update(id, sensorData);
    return await getRepository(Sensor).findOne({ where: { id } });
  }

  async deleteSensor(id: number): Promise<boolean> {
    const result = await getRepository(Sensor).delete(id);
    return result.affected !== 0;
  }
}