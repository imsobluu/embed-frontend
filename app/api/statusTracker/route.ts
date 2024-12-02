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

let databaseURL;

if (process.env.NODE_ENV == 'development') {
  databaseURL = `http://127.0.0.1:9000?ns=embed-firebase-default-rtdb`;
} else {
  databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
}

if (getApps().length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    databaseURL,
  });
} else {
  // If the app is already initialized, you can use it
  console.log("Firebase app already initialized");
}

const db = admin.database();
const lastUpdateRef = db.ref('lastUpdateTimestamp');
const statusRef = db.ref('databaseStatus')

const updateDatabaseStatus = (status: 'online' | 'offline') => {
    statusRef.set(status, (error) => {
      if (error) {
        console.error('Failed to update database status:', error);
      } else {
        console.log('Database status updated to:', status);
      }
    });
};

const trackDatabaseUpdates = () => {
    const dataRef = db.ref('sensorData'); // Example: Listening to the 'sensorData' node
    
    dataRef.on('child_added', (snapshot) => {
      console.log('Data added:', snapshot.val());
      updateLastUpdateTimestamp();
    });
  
    dataRef.on('child_changed', (snapshot) => {
      console.log('Data changed:', snapshot.val());
      updateLastUpdateTimestamp();
    });
  
    dataRef.on('child_removed', (snapshot) => {
      console.log('Data removed:', snapshot.val());
      updateLastUpdateTimestamp();
    });
};

const updateLastUpdateTimestamp = () => {
    const currentTime = Date.now();
    lastUpdateRef.set(currentTime, (error) => {
      if (error) {
        console.error('Failed to update last update timestamp:', error);
      } else {
        console.log('Last update timestamp updated:', currentTime);
      }
    });
};

const checkDatabaseStatus = () => {
    lastUpdateRef.once('value', (snapshot) => {
      const lastUpdateTime = snapshot.val();
      const currentTime = Date.now();
      const timeDifference = currentTime - lastUpdateTime;
  
      // If the time difference is less than 1 minute (60,000 milliseconds), set as 'online'
      if (timeDifference < 60000) {
        updateDatabaseStatus('online');
      } else {
        updateDatabaseStatus('offline');
      }
    });
};

setInterval(checkDatabaseStatus, 60000);

trackDatabaseUpdates();