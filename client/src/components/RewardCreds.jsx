import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ABI } from "../ABIs/interview_creds"; // Ensure correct ABI

const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Deployed Hardhat contract address

const MintNFT = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState("0");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        const accounts = await provider.listAccounts(); // Get Hardhat accounts
        if (accounts.length === 0) throw new Error("No accounts found");

        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, ABI, signer);

        setProvider(provider);
        setSigner(signer);
        setContract(contract);
        setFeedback(localStorage.getItem("feedback") || "");
        setRating(localStorage.getItem("score") || "0");

        // Set the current date in YYYY-MM-DD format
        setInterviewDate(new Date().toISOString().split("T")[0]);
      } catch (error) {
        console.error("Error loading blockchain data:", error);
        setMessage("Failed to connect to Hardhat network.");
      }
    };

    loadBlockchainData();
  }, []);

  const mintNFT = async () => {
    if (!contract) {
      setMessage("Contract not loaded.");
      return;
    }

    if (!recipient || !candidateName) {
      setMessage("Recipient and Candidate Name are required.");
      return;
    }

    if (!ethers.isAddress(recipient)) {
      setMessage("Invalid Ethereum address.");
      return;
    }

    try {
      setLoading(true);

      const parsedRating = parseInt(rating, 10) || 0;

      const tx = await contract.mintCredential(
        recipient,
        candidateName,
        interviewDate,
        feedback,
        parsedRating
      );
      await tx.wait();
      setMessage(`✅ NFT successfully minted for ${recipient}!`);
    } catch (error) {
      console.error("❌ Minting error:", error);
      setMessage("⚠️ Transaction failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center w-96">
        <h1 className="text-2xl font-semibold text-gray-800">
          Mint Interview Credential NFT
        </h1>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="mt-4 w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Candidate Name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          className="mt-2 w-full p-2 border rounded"
        />
        <input
          type="date"
          value={interviewDate}
          readOnly
          className="mt-2 w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
        />
        <textarea
          placeholder="Feedback"
          value={feedback}
          readOnly
          className="mt-2 w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
        />
        <input
          type="number"
          placeholder="Rating (0-10)"
          value={rating}
          readOnly
          className="mt-2 w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
        />
        <button
          onClick={mintNFT}
          disabled={loading}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Minting..." : "Mint NFT"}
        </button>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
};

export default MintNFT;
