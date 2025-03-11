# Mockterview - AI-Powered Mock Interview Platform 🚀  

Mockterview is an AI-driven mock interview platform that simulates Google-style technical interviews, offering real-time AI feedback, blockchain-backed credential verification, and crypto-based rewards.  

## **Table of Contents**
- [Overview](#overview)
- [Features](#features)
- [Technical Architecture](#technical-architecture)
- [Blockchain Integration](#blockchain-integration)
- [Tech Stack](#tech-stack)
- [Market Potential](#market-potential)
- [Future Scope](#future-scope)
- [Contributors](#contributors)

## Overview  
Job seekers struggle with mock interviews due to:  
- Limited access to experienced interviewers  
- Generic, non-personalized feedback  
- Lack of AI-driven insights on communication, coding approach, and problem-solving  

Mockterview solves this by offering:  
- AI-powered role-specific mock interviews  
- Real-time AI feedback on tone, speech clarity, and technical responses  
- Crypto token (Dolph) rewards for performance-based incentives  
- Decentralized credential verification for tamper-proof interview records  

## Features  
1. AI-Powered Mock Interviews  
   - AI-generated role-specific questions from Firebase based on difficulty level (Easy/Medium/Hard)  
   - AI voice assistant guides users before, during, and after the interview  
   - Live coding environment to solve problems  

2. AI-Driven Personalized Feedback  
   - AI analyzes speech tone, response clarity, confidence, and technical accuracy  
   - AI chatbot asks follow-up questions based on the user's response and code  
   - Detailed performance score and personalized feedback report  

3. Blockchain-Powered Credential Verification  
   - Immutable interview records stored on blockchain  
   - Verifiable reports that users can share with potential employers  

4. Crypto-Based Rewards System  
   - Earn Dolph tokens based on interview performance  
   - Redeem tokens for premium features, resume reviews, or cash rewards  

## Technical Architecture  
Step-by-Step Interview Process  

1. Interview starts  
   - AI fetches a randomized problem from Firebase based on difficulty  
   - User gets five minutes to analyze the problem  

2. AI Voice Assistant Engages  
   - User shares initial thoughts and AI analyzes clarity and logic  
   - If the user has doubts, voice-based AI assistant provides hints  

3. Live Coding and AI Q&A  
   - User writes and submits the solution in the coding editor  
   - AI chatbot generates five custom follow-up questions based on the user’s response  

4. Real-Time Evaluation  
   - AI evaluates code quality, efficiency, and correctness  
   - AI assesses spoken responses, confidence, and problem-solving skills  

5. Performance Report and Token Rewards  
   - AI generates a detailed feedback report with an overall rating (0-10)  
   - Based on performance, users earn Dolph crypto tokens  

## Blockchain Integration  
1. Decentralized Credential Verification  
   - Purpose: Store interview performance as verifiable credentials on blockchain  
   - Users get tamper-proof proof of performance  
   - Employers can instantly verify interview scores  

2. Smart Contract-Based Rewards System  
   - Purpose: Reward users with Dolph tokens for interview performance  
   - Users earn tokens for completing interviews, improving scores, or mentoring others  
   - Tokens can be used for premium features, AI coaching, or exchanged for cash  
   - Ethereum and Polygon smart contracts ensure secure, automated transactions  

## Tech Stack  
| Component | Technology Used |  
|-----------|----------------|  
| Frontend | React, Next.js, TailwindCSS |  
| Backend | Node.js, Express.js, Firebase Functions |  
| Database | Firebase Firestore, PostgreSQL |  
| AI Models | OpenAI GPT-4, Whisper API (Voice Processing) |  
| Speech Analysis | AssemblyAI, Google Cloud Speech-to-Text |  
| Blockchain | Solidity (Ethereum/Polygon), Hardhat, Foundry |  
| Crypto Rewards | ERC-20 Token Smart Contracts (Dolph Token) |  
| Cloud and Deployment | AWS Lambda, Firebase Hosting, Vercel |  

## Market Potential  
- The global online education market is projected to hit 1 trillion dollars by 2032  
- Target Audience:  
  - Students and graduates who need structured mock interviews for placements  
  - Tech professionals preparing for FAANG and top-tier interviews  
  - Companies and recruiters who need AI-powered assessments for candidate screening  
- Competitor platforms: LeetCode, InterviewBit, Pramp  
- Mockterview’s edge: AI, crypto incentives, and blockchain credentialing  

## Future Scope  
Phase 1: Expand AI Capabilities  
- More AI-generated question sets  
- AI gesture and body language analysis  

Phase 2: Decentralized Marketplace  
- Experienced professionals can sell interview questions and coding challenges  
- Smart contracts handle transparent payments for services  

Phase 3: Secure Web3 Identity System  
- Blockchain-based user identity verification for fraud prevention  
- Reputation tokens for verified skill assessments  

## Contributors
👨‍💻 **Team Cactus Jack**
- **Sahil Garg** (Team Leader) – Blockchain, Git, AI Integration, Full-Stack Development - [GitHub](https://github.com/sahil2004)
- **Rohan** – Artificial Intelligence & Frontend Development - [Github](https://github.com/rohansinghtakhi)
- **Jayant Sharma** – Frontend Development and Speech Recognition - [Github](https://github.com/Jayant-0101)
- **Aditya Krishan** – Full-Stack Development - [Github](https://github.com/adityaKrishan651)

📢 **Want to contribute?** PRs welcome! Submit issues & feature requests.  

---

## Getting Started
### 1. Clone the Repository
```sh
git clone https://github.com/Sahil2004/mockterview.git
cd mockterview
```
### 2. Install Dependencies
```sh
npm install
```
### 3. Start the Development Server
```sh
npm run dev
```
### 4. Deploy Smart Contracts (For Blockchain Features)
```sh
npx hardhat compile  
npx hardhat deploy --network polygon  
```
