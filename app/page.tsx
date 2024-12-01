"use client"
import { onValue, ref } from "firebase/database"
import { useState, useEffect } from "react"
import { database } from "./firebase";

interface SensorValues {
  ldrValue: number;
  micValue: number;
  mq2AnalogValue: number;
  mq2DigitalValue: number;
  t447Value: number;
  temperature: number;
}

export default function Home() {
  const [data, setData] = useState<SensorValues | null>(null);

  useEffect(() => {
    const sensorValueRef = ref(database, "sensorData");

    const unsubscribe = onValue(sensorValueRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
      } else {
        console.error("No data available");
      }
    }, (error) => {
      console.error("Error fetching data: ", error);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center p-12">
      <h1 className="text-4xl font-bold text-center my-10">
        Fetch Data from Firebase Realtime Database
      </h1>
      {data ? (
        <div className="grid grid-cols-3 gap-4">
          <>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-2xl text-gray-900">LDR Value: {data.ldrValue}</h2>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-2xl text-gray-900">Mic Value: {data.micValue}</h2>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-2xl text-gray-900">MQ2 Analog Value: {data.mq2AnalogValue}</h2>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-2xl text-gray-900">MQ2 Digital Value: {data.mq2DigitalValue}</h2>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-2xl text-gray-900">T447 Value: {data.t447Value}</h2>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-2xl text-gray-900">Temperature: {data.temperature}</h2>
            </div>
          </>
        </div>
      ) : (
        <p className="text-2xl font-bold text-center my-10">
          Loading data...
        </p>
      )}
    </div>
  );
}
