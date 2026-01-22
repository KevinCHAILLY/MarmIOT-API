import React from "react";
import SensorList from "./components/SensorList";
import EventList from "./components/EventList";

const App: React.FC = () => {
  return (
    <div>
      <h1>MarmIOT Dashboard</h1>
      <SensorList />
      <EventList />
    </div>
  );
};

export default App;