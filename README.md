# Rock-Paper-Scissors (RPS) with Offchain EAS Attestations

RPS is a decentralized implementation of the classic Rock-Paper-Scissors game, utilizing EAS offchain attestations to ensure a secure and trustless gameplay experience. This project aims to demonstrate how offchain attestations can be used in decentralized applications to enhance transparency and integrity.

## How It Works

The RPS game operates through a series of steps, each leveraging offchain attestations to ensure the integrity of the game:

1. **User Registration**: Players can sign up using their own wallet or an embedded wallet with Privy. The chosen wallet is used to sign offchain attestations.

2. **Starting a Challenge**: A player initiates a challenge by attesting to the recipient address they wish to compete against. Optionally, stakes can be added to the game. An offchain attestation is generated and stored on the server.

3. **Attesting to a Move**: Players attest to their chosen move (Rock, Paper, or Scissors) by signing a message. This generates a public offchain attestation that commits to their move without revealing it. The attestation includes a hash of the move and a salt, along with an encrypted version for backup and cross-device play.

4. **Revealing a Move**: Once both players have committed, they reveal their moves by submitting the original move and salt to the server. The game's outcome can then be verified by matching the choices and salts with the hashes in their attestations.

5. **RPS Attests to Winners**: The game result, along with all relevant attestations, salts, and choices, is attested by RPS in a game summary. This summary also indicates if a player was timed out by the server.

6. **ELO Ratings Are Updated**: Based on the game's outcome, the players' ELO ratings are adjusted, affecting their leaderboard standings.

7. **Relative Game Graphs**: As players engage in more games, a social graph is created showing their interactions and the connections among their opponents.

## Note

Although a server is used to store game states in this implementation, all game data is public on the server and 100% verifiable. The use of offchain attestations makes it so that a game's outcome can be verified interactively by any third-party or smart contract logic in any situation where each player would benefit from proving victory in a match. This can be done without placing any trust in the server.

## Getting Started

To run the RPS project locally:

Ensure that you have Node.js and npm installed before proceeding.

1. Install typescript and ts-node if not done already:
   ```bash
   npm install -g ts-node typescript
   ```

2. [Clone the backend repo](https://github.com/ethereum-attestation-service/eas-rps-backend) and follow setup instructions to get the attestation storage server running locally.

3. Clone the frontend repo:
   ```bash
   git clone https://github.com/ethereum-attestation-service/eas-rps-frontend.git
   ```
4. Install dependencies:
   ```bash
   cd eas-rps-frontend
   npm i
   ```
5. Copy the .env.example file using the command below. Set up your .env file with your Alchemy API key (for resolving ENS names).
   ```bash
   cp .env.example .env
   ```
6. Start the Development Server
   ```bash
   npm run start
   ```
   
