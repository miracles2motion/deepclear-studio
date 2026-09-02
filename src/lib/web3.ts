import { ethers } from "ethers";
import { ExtractedEntity } from "@/types";

export function generateClearanceMerkleHash(
  productionTitle: string,
  entities: ExtractedEntity[],
  timestamp: string
): string {
  const combinedPayload = JSON.stringify({
    title: productionTitle,
    entities: entities.map((e) => ({
      id: e.id,
      text: e.rawText,
      defused: e.defusedText,
      status: e.status,
    })),
    timestamp,
  });

  return ethers.keccak256(ethers.toUtf8Bytes(combinedPayload));
}

export async function mintClearancePassportTestnet(
  merkleHash: string,
  productionTitle: string
): Promise<{ txHash: string; explorerUrl: string; blockNumber: number }> {
  // Simulate immediate deterministic EVM testnet receipt for zero-cost demo reliability
  const mockTxHash = `0x${ethers.keccak256(ethers.toUtf8Bytes(merkleHash + Date.now())).slice(2, 66)}`;
  const explorerUrl = `https://sepolia.basescan.org/tx/${mockTxHash}`;

  return {
    txHash: mockTxHash,
    explorerUrl,
    blockNumber: 19842104 + Math.floor(Math.random() * 100),
  };
}
