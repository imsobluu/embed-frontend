import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined;

if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing Firebase configuration environment variables");
  console.error("projectId:", projectId);
  console.error("clientEmail:", clientEmail);
  console.error("privateKey:", privateKey);
  throw new Error("Missing Firebase configuration environment variables");
}

if (getApps().length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    databaseURL: `http://127.0.0.1:9000?ns=embed-firebase-default-rtdb`,
  });
} else {
  // If the app is already initialized, you can use it
  console.log("Firebase app already initialized");
}

const db = admin.database();

// Define a function to generate random values for sensor data
const generateRandomSensorValues = () => ({
  ldrValue: Math.floor(Math.random() * 1001),
  micValue: Math.floor(Math.random() * 101),  
  temperature: Math.floor(Math.random() * (150 - (-55) + 1)) + (-55),
});

// Function to update the sensor data in Firebase RTDB
const updateSensorData = () => {
  const randomValues = generateRandomSensorValues();
  const sensorDataRef = db.ref('sensorData'); // Reference to the 'sensorData' node

  sensorDataRef.set(randomValues)
    .then(() => {
      console.log('Updated sensor values:', randomValues);
    })
    .catch((error) => {
      console.error('Error updating sensor values:', error);
    });
};

// Update sensor data every second
setInterval(updateSensorData, 1000);
