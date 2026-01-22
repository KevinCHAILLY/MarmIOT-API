import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Sensor } from "./Sensor";

export enum EventType {
  BUTTON_PRESS = "button_press",
  CONNECTION = "connection",
  ERROR = "error",
}

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "enum",
    enum: EventType,
  })
  type!: EventType;

  @Column()
  data!: string;

  @ManyToOne(() => Sensor, (sensor) => sensor.id)
  sensor!: Sensor;

  @CreateDateColumn()
  createdAt!: Date;
}