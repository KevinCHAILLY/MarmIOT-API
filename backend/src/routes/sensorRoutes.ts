import { Router } from "express";
import { SensorController } from "../controllers/SensorController";

const router = Router();
const sensorController = new SensorController();

/**
 * @swagger
 * tags:
 *   name: Sensors
 *   description: Sensor management
 */

/**
 * @swagger
 * /api/sensors:
 *   get:
 *     summary: Get all sensors
 *     tags: [Sensors]
 *     responses:
 *       200:
 *         description: List of sensors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sensor'
 */
router.get("/", sensorController.getAllSensors);

/**
 * @swagger
 * /api/sensors:
 *   post:
 *     summary: Create a new sensor
 *     tags: [Sensors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sensor'
 *     responses:
 *       201:
 *         description: Sensor created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sensor'
 */
router.post("/", sensorController.createSensor);

/**
 * @swagger
 * /api/sensors/{id}:
 *   get:
 *     summary: Get a sensor by ID
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Sensor ID
 *     responses:
 *       200:
 *         description: Sensor details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sensor'
 */
router.get("/:id", sensorController.getSensorById);

/**
 * @swagger
 * /api/sensors/{id}:
 *   put:
 *     summary: Update a sensor
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Sensor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sensor'
 *     responses:
 *       200:
 *         description: Sensor updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sensor'
 */
router.put("/:id", sensorController.updateSensor);

/**
 * @swagger
 * /api/sensors/{id}:
 *   delete:
 *     summary: Delete a sensor
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Sensor ID
 *     responses:
 *       204:
 *         description: Sensor deleted
 */
router.delete("/:id", sensorController.deleteSensor);

export const sensorRoutes = router;