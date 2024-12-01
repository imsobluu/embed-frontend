"use client"
import { get, push, ref, set } from "firebase/database"
import { useState, useEffect } from "react"
import { database } from "./firebase";

interface User {
  id?: string;
  data?: string;
}


export default function Home() {
  const [data, setData] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const usersRef = ref(database, "users");
    get(usersRef).then((snapshot) => {
      if (snapshot.exists()) {
        const usersArray = Object.entries(snapshot.val()).map(([id, userData]) => {
          if (typeof userData === 'object' && userData !== null) {
            return {
              id,
              ...userData,
            };
          } else {
            console.error(`Invalid user data for id: ${id}`, userData);
            return { id, data: "Invalid data" };
          }
        });
        setUsers(usersArray);
      } else {
        console.error("No data available");
      }
    }).catch((error) => {
      console.error("Error fetching data: ", error);
    });
  }, []);

  const handleAddData = () => {
    try {
      const usersRef = ref(database, "users");
      const newDataRef = push(usersRef);

      set(newDataRef, {
        data: data,
      });
      setData("");
      alert("Data added successfully");
    } catch (error) {
      console.error("Error adding data: ", error);
    }
  }
  return (
    <div className="flex min-h-screen flex-col items-center p-12">
      <h1 className="text-4xl font-bold text-center my-10">
        Add Data to Firebase Realtime Database
      </h1>
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Enter Data"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full border p-2"
        />
      </div>
      <button
        onClick={handleAddData}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        Add Data
      </button>
      <h1 className="text-4xl font-bold text-center my-10">
        Fetch Data from Firebase Realtime Database
      </h1>
      <div className="grid grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-2xl text-gray-900">
              {user.data}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}
