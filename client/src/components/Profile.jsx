import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-semibold text-gray-800">Profile Page</h1>
        {user ? (
          <p className="mt-4 text-gray-600">
            Logged in as: <span className="font-medium">{user.email}</span>
          </p>
        ) : (
          <p className="mt-4 text-red-500">Not logged in</p>
        )}
      </div>
    </div>
  );
};

export default Profile;