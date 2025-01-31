import CryptoJS from "crypto-js";
import { SUITS } from "./constants";

export function verifyCard(
  publicSeed: string,
  serverSeed: string,
  currentValue: number
) {
  const combinedSeed = `${publicSeed}-${serverSeed}-${currentValue}`;
  const hash = CryptoJS.SHA256(combinedSeed).toString(CryptoJS.enc.Hex);
  const hashNumber = parseInt(hash.slice(0, 8), 16);

  return {
    value: (hashNumber % 13) + 1,
    suit: SUITS[hashNumber % 4],
  };
}
