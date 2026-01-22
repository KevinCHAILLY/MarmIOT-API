import React, { useEffect, useState } from "react";
import { getSensors } from "../api";

interface Sensor {
  id: number;
  sensorId: string;
  name: string;
  location: string;
  status: string;
}

const SensorList: React.FC = () => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const data = await getSensors();
        setSensors(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch sensors");
        setLoading(false);
      }
    };

    fetchSensors();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Sensors</h2>
      <ul>
        {sensors.map((sensor) => (
          <li key={sensor.id}>
            {sensor.name} - {sensor.location} - {sensor.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SensorList;