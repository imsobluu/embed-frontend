import * as admin from 'firebase-admin';
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



// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId,
    clientEmail,
    privateKey,
  }),
  databaseURL: `http://127.0.0.1:9000?ns=embed-firebase-default-rtdb`,
});

const db = admin.database();

// Define a function to generate random values for sensor data
const generateRandomSensorValues = () => ({
  ldrValue: Math.floor(Math.random() * 1024), // Random value between 0 and 1023
  micValue: Math.floor(Math.random() * 100),  // Random value between 0 and 99
  mq2AnalogValue: Math.floor(Math.random() * 1024), // Random value between 0 and 1023
  mq2DigitalValue: Math.random() > 0.5 ? 1 : 0, // Random binary value (0 or 1)
  t447Value: Math.floor(Math.random() * 50), // Random value between 0 and 49
  temperature: parseFloat((Math.random() * 40).toFixed(2)), // Random temperature value between 0 and 40°C
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
