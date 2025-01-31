import { defineEventHandler } from "h3";
import { generateSeeds, generateNextCard } from "~/server/utils/seedGenerator";

export default defineEventHandler(async () => {
  const seeds = generateSeeds();
  const { publicSeed, serverSeed } = seeds;

  // Utiliser une valeur aléatoire comme valeur initiale
  const initialValue = Math.floor(Math.random() * 13) + 1;

  return {
    card: generateNextCard(publicSeed, serverSeed, initialValue),
    publicSeed,
    serverHash: serverSeed,
  };
});
