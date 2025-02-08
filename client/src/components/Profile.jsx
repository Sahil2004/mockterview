import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ethers } from "ethers";
import { ABI } from "../ABIs/interview_tokens";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your contract address
const CONTRACT_ABI = ABI; // Paste your contract ABI here

const Profile = () => {
  const [user, setUser] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      // Auto-fill wallet address if available in Firebase (assuming it's stored in metadata)
      if (currentUser?.photoURL) {
        setWalletAddress(currentUser.photoURL);
      }
    });

    return () => unsubscribe();
  }, []);

  const getUserBalance = async () => {
    if (!walletAddress) {
      setError("Please enter a valid wallet address.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request MetaMask access
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const balance = await contract.balanceOf(walletAddress);
      setBalance(ethers.formatUnits(balance, 18));
    } catch (err) {
      console.error(err);
      setError("Error fetching balance. Ensure the wallet address is correct.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800">Profile Page</h1>

        {user ? (
          <>
            <p className="mt-4 text-gray-600">
              Logged in as: <span className="font-medium">{user.email}</span>
            </p>

            <div className="mt-6">
              <h2 className="text-lg font-semibold">Check Your Token Balance</h2>
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  placeholder="Enter Wallet Address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={getUserBalance}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Checking..." : "Check"}
                </button>
              </div>

              {error && <p className="text-red-500 mt-2">{error}</p>}

              {balance !== null && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50 text-center">
                  <h3 className="text-lg font-semibold">Your Balance:</h3>
                  <p className="text-2xl font-bold text-green-600">{balance} Tokens</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="mt-4 text-red-500">Not logged in</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
