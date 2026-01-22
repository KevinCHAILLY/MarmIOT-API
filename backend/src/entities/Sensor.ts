import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum SensorStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ERROR = "error",
}

@Entity()
export class Sensor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  sensorId!: string;

  @Column()
  name!: string;

  @Column()
  location!: string;

  @Column({
    type: "enum",
    enum: SensorStatus,
    default: SensorStatus.ACTIVE,
  })
  status!: SensorStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}