import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ABI } from "../ABIs/interview_creds"; // Ensure you have the correct ABI

const contractAddress = "0xYourContractAddress"; // Replace with deployed contract address

const MintNFT = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      provider.send("eth_requestAccounts", []).then(() => {
        provider.getSigner().then((signer) => {
          setProvider(provider);
          setSigner(signer);
          setContract(new ethers.Contract(contractAddress, ABI, signer));
        });
      });
    } else {
      setMessage("Please install MetaMask.");
    }

    // Set the current date
    const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    setInterviewDate(currentDate);

    // Load feedback and rating from localStorage
    const storedFeedback = localStorage.getItem("feedback") || "";
    const storedRating = localStorage.getItem("score") || "";
    
    setFeedback(storedFeedback);
    setRating(storedRating);
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

    try {
      setLoading(true);
      const tx = await contract.mintCredential(
        recipient,
        candidateName,
        interviewDate,
        feedback,
        parseInt(rating)
      );
      await tx.wait();
      setMessage(`NFT successfully minted for ${recipient}!`);
    } catch (error) {
      console.error("Minting error:", error);
      setMessage("Transaction failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center w-96">
        <h1 className="text-2xl font-semibold text-gray-800">Mint Interview Credential NFT</h1>
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
          disabled
          className="mt-2 w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
        />
        <textarea
          placeholder="Feedback"
          value={feedback}
          disabled
          className="mt-2 w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
        />
        <input
          type="number"
          placeholder="Rating (0-10)"
          value={rating}
          disabled
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
