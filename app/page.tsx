"use client"
import { DatabaseReference, onValue, ref, set } from "firebase/database"
import axios from "axios";
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
  const [text, setText] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);


  const handleSendSensorDataMultipleTimes = () => {
    const sensorData = {
      ldrValue: 3000,
      micValue: 3000,
      temperature: 60,
    };

    const dbRef = ref(database, "sensorData");


    const sendInterval = 1000; // Send data every 1 second
    const totalDuration = 10000; // Total duration: 5 seconds

    const intervalId = setInterval(() => {
      set(dbRef, sensorData)
        .then(() => {
          console.log("Sensor data sent successfully!");
        })
        .catch((error) => {
          console.error("Error sending sensor data:", error);
        });
    }, sendInterval);

    // Stop sending after 5 seconds
    setTimeout(() => {
      clearInterval(intervalId);
      console.log("Stopped sending data after 5 seconds");
    }, totalDuration);
  };


  useEffect(() => {
    // console.log(String(text).trim().toLowerCase());
    // if ((text as string).trim() === "Alert on.") {
    //   handleSendSensorDataMultipleTimes();
    // }
    if (text == 'Alert on.') {
      console.log("Sending sensor data multiple times...");
      console.log(text)
      handleSendSensorDataMultipleTimes();
    }
  }, [text]);



  function handleOnSpeech() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onresult = async function (event) {
      setIsActive(false);
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      const response = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ language: 'en', text: transcript }),
      }).then((res) => res.json());
      console.log(String(response.text).trim().toLowerCase());
      setText(response.text);
      setIsActive(true);
    }
    recognition.start();
  }

  useEffect(() => {
    const sensorValueRef = ref(database, "sensorData");
    const statusRef = ref(database, "databaseStatus");
    let timeoutId: NodeJS.Timeout;

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
      let newData;
      if (snapshot.exists()) {
        setData(snapshot.val());
        setFirebaseStatus("Project is online");
        newData = snapshot.val();
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
          setFirebaseStatus("Project is offline");
        }, 60000); // 1 minute
      } else {
        console.error("No data available");
      }
      submitSheetHandler(newData);
    }, (error) => {
      console.error("Error fetching data: ", error);
    });

    return () => {
      unsubscribe();
      unsubscribeStatus();
    }
  }, []);

  const submitSheetHandler = async (sensorData: SensorValues) => {
    const sheetData = {
      "ldrValue": sensorData.ldrValue,
      "micValue": sensorData.micValue,
      "temperature": sensorData.temperature,
      "timestamp": new Date().toISOString()
    };

    try {
      const result = await axios.post('https://api.sheetbest.com/sheets/cf833c1f-87a6-4186-92c3-0830c3dbe5a5', sheetData);
      console.log("Data sent to Google Sheets:", result.data);
    } catch (error) {
      console.error("Error sending data to Google Sheets:", error);
    }
  }
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
            <div className="bg-black p-4 rounded-2xl flex flex-col justify-center items-center" onClick={handleOnSpeech}>

              <h2 className="text-2xl text-gray-100">Text:</h2>
              <h2 className="text-2xl text-gray-100">{isActive ? 'say something' : text}</h2>
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
function push(dbRef: DatabaseReference) {
  throw new Error("Function not implemented.");
}

