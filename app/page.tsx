"use client"
import { onValue, ref } from "firebase/database"
import { useState, useEffect } from "react"
import { database } from "./firebase";
import Lightbulb from "@/components/Lightbulb";
import Microphone from "@/components/Microphone";
import Thermostat from "@/components/Thermostat";

interface SensorValues {
  ldrValue: number;
  micValue: number;
  temperature: number;
}

export default function Home() {
  const [data, setData] = useState<SensorValues | null>(null);
  const [firebaseStatus, setFirebaseStatus] = useState<string>("offline");

  useEffect(() => {
    const sensorValueRef = ref(database, "sensorData");
    const statusRef = ref(database, "databaseStatus");

    const unsubscribeStatus = onValue(statusRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log("Firebase status snapshot: ", snapshot.val());
        setFirebaseStatus(snapshot.val());
      } else {
        console.error("Database status not available");
      }
    }, (error) => {
      console.error("Error fetching status: ", error);
    });

    const unsubscribe = onValue(sensorValueRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
      } else {
        console.error("No data available");
      }
    }, (error) => {
      console.error("Error fetching data: ", error);
    });

    return () => {
      unsubscribe();
      unsubscribeStatus();
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center p-12">
      <h1 className="text-4xl font-bold text-center">
        Fetch Data from Firebase Realtime Database
      </h1>
      <div className={`text-xl font-bold my-10 ${firebaseStatus === "online" ? "text-green-500" : "text-red-500"}`}>
        Project Status : {firebaseStatus ? firebaseStatus : "offline"}
      </div>
      {data ? (
        <div className="grid grid-cols-3 gap-11">
          <>
            <div className="bg-black p-4 rounded-2xl flex flex-col justify-center items-center">
              <Lightbulb 
                brightness={data.ldrValue}
              />
              <h2 className="text-2xl text-gray-100">LDR Value</h2>
              <h2 className="text-2xl text-gray-100">{data.ldrValue}</h2>
            </div>
            <div className="bg-black p-4 rounded-2xl flex flex-col justify-center items-center">
              <Microphone
                loudness={data.micValue}
              />
              <h2 className="text-2xl text-gray-100">Mic Value</h2>
              <h2 className="text-2xl text-gray-100">{data.micValue}</h2>
            </div>
            <div className="bg-black p-4 rounded-2xl flex flex-col justify-center items-center">
              <Thermostat
                temperature={data.temperature}
              />
              <h2 className="text-2xl text-gray-100">Temperature</h2>
              <h2 className="text-2xl text-gray-100">{data.temperature}</h2>
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
