import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ethers } from "ethers";
import { ABI } from "../ABIs/interview_tokens";

const contractAddress = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788"; // Replace with your contract address
const fundingWalletPrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"; // Hardhat Account #1

const RewardUser = () => {
  const [user, setUser] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [recipientBalance, setRecipientBalance] = useState("0");

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    setAmount(parseInt(localStorage.getItem("score"))/10 ?? 0);
  }, []);

  // Check recipient balance
  const checkRecipientBalance = async () => {
    if (!ethers.isAddress(userAddress)) return;
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const contract = new ethers.Contract(contractAddress, ABI, provider);
    const balance = await contract.balanceOf(userAddress);
    setRecipientBalance(ethers.formatUnits(balance, 18));
  };

  const rewardUser = async () => {
    if (!user) {
      setMessage("You must be logged in to reward users.");
      return;
    }
    if (!ethers.isAddress(userAddress)) {
      setMessage("Invalid Ethereum address.");
      return;
    }

    try {
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const fundingWallet = new ethers.Wallet(fundingWalletPrivateKey, provider);
      const contract = new ethers.Contract(contractAddress, ABI, fundingWallet);

      // Check funding wallet balance before transfer
      const fundingBalance = await contract.balanceOf(fundingWallet.address);
      console.log("Funding Wallet Balance:", ethers.formatUnits(fundingBalance, 18));

      // Execute transfer
      const tx = await contract.rewardUser(
        userAddress,
        ethers.parseUnits(amount, 18)
      );
      await tx.wait();

      // Update recipient balance in UI
      await checkRecipientBalance();
      setMessage(`Successfully rewarded ${amount} IVT tokens to ${userAddress}.`);
    } catch (error) {
      console.error("Error rewarding tokens:", error);
      setMessage("Transaction failed. Check console for details.");
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
              onBlur={checkRecipientBalance} // Check balance on blur
              className="mt-4 w-full p-2 border rounded"
            />
            <p className="text-sm mt-1">
              Balance: {recipientBalance} IVT
            </p>
            <input
              type="number"
              placeholder="Amount (IVT)"
              readOnly
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2 w-full p-2 border rounded"
            />
            <button
              onClick={rewardUser}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              Reward
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