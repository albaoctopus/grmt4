import { getContract } from "thirdweb";
import { polygon } from "thirdweb/chains";
import client from "../lib/client";

// 1. Configure the network
export const NETWORK = polygon;

// 2. Configure the addresses
export const MARKETPLACE_ADDRESS = "0x83c57ec0dF015eef8401fFb7CB7f66CfA8b6Ff55";
export const NFT_COLLECTION_ADDRESS = "0x11fD8b9800E80a76953A434C5979DCC2a75bc316";

// 3. Initialize the contracts
export const MARKETPLACE = getContract({
  address: MARKETPLACE_ADDRESS,
  client,
  chain: NETWORK // Explicitly pass the chain
});

export const NFT_COLLECTION = getContract({
  address: NFT_COLLECTION_ADDRESS,
  client,
  chain: NETWORK // Explicitly pass the chain
});

// 4. Set the scan URL
export const ETHERSCAN_URL = "https://polygonscan.com";