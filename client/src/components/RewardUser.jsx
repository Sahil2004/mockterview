import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ethers } from "ethers";
import { ABI } from "../ABIs/interview_tokens";

const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"; // Replace with actual contract address

const RewardUser = () => {
  const [user, setUser] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Authenticate user via Firebase
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []); // Request user accounts
        const signer = await provider.getSigner();
        setProvider(provider);
        setSigner(signer);
        setContract(new ethers.Contract(contractAddress, ABI, signer));
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to reward a user
  const rewardUser = async () => {
    if (!user) {
      setMessage("You must be logged in to reward users.");
      return;
    }
    if (!ethers.isAddress(userAddress)) {
      setMessage("Invalid Ethereum address.");
      return;
    }
    if (!contract) {
      setMessage("Contract not loaded. Connect your wallet.");
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.rewardUser(userAddress, ethers.parseUnits(amount, 18));
      await tx.wait();
      setMessage(`Successfully rewarded ${amount} ITK tokens to ${userAddress}.`);
    } catch (error) {
      console.error("Error rewarding tokens:", error);
      setMessage("Transaction failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center w-96">
        <h1 className="text-2xl font-semibold text-gray-800">Reward User</h1>
        {user ? (
          <>
            <p className="mt-2 text-gray-600">
              Logged in as: <span className="font-medium">{user.email}</span>
            </p>
            <input
              type="text"
              placeholder="Recipient Address"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              className="mt-4 w-full p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Amount (ITK)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2 w-full p-2 border rounded"
            />
            <button
              onClick={rewardUser}
              disabled={loading}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              {loading ? "Processing..." : "Reward"}
            </button>
            {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
          </>
        ) : (
          <p className="mt-4 text-red-500">Not logged in</p>
        )}
      </div>
    </div>
  );
};

export default RewardUser;
