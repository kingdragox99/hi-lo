import { defineEventHandler } from "h3";
import { generateSeeds } from "~/server/utils/seedGenerator";

export default defineEventHandler(() => {
  const { publicSeed, timestamp } = generateSeeds();
  return {
    publicSeed,
    timestamp,
    expiresIn: 24 * 60 * 60 * 1000 - (Date.now() - timestamp),
  };
});
