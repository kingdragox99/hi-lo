import { defineEventHandler } from "h3";
import { generateSeeds, generateNextCard } from "~/server/utils/seedGenerator";

interface CardState {
  suit: string;
  value: number;
  seed: string;
  streak: number;
}

interface Card {
  suit: string;
  value: number;
}

interface RequestBody {
  card: {
    suit: string;
    value: number;
    streak?: number;
  };
}

function calculateMultiplier(probability: number, streak: number): number {
  // Facteur de base qui augmente avec le streak
  const streakFactor = 1 + streak * 0.125; // Réduit à 12.5% par streak (moitié de 0.25)

  // Multiplicateur de base inversement proportionnel à la probabilité
  const baseMultiplier = 1 + (1 - probability) * 0.5; // Réduit de moitié (0.5 au lieu de 1)

  // Multiplicateur final qui combine les deux facteurs
  const finalMultiplier = baseMultiplier * streakFactor;

  // Assurer un multiplicateur minimum de 1.01 au lieu de 1.1
  return Math.max(1.01, parseFloat(finalMultiplier.toFixed(2)));
}

function calculateProbabilities(card: CardState) {
  const seeds = generateSeeds();
  const { publicSeed, serverSeed } = seeds;

  // Sauvegarder le serverSeed pour la vérification
  const nextServerHash = serverSeed;

  // Valeurs des cartes : 1 = As, 2 = 2, ..., 12 = Q, 13 = K
  const totalCards = 13;
  const currentValue = card.value;
  const streak = card.streak || 0;

  const higherCards = totalCards - currentValue;
  const lowerCards = currentValue - 1;
  const equalCards = 1;

  const total = totalCards;

  // Calculer les probabilités en pourcentage (0-100)
  const higherProb = Math.round((higherCards / total) * 100);
  const lowerProb = Math.round((lowerCards / total) * 100);
  const equalProb = Math.round((equalCards / total) * 100);

  const nextCard = generateNextCard(publicSeed, serverSeed, currentValue);

  return {
    higher: {
      probability: higherProb,
      multiplier: calculateMultiplier(higherProb / 100, streak),
    },
    lower: {
      probability: lowerProb,
      multiplier: calculateMultiplier(lowerProb / 100, streak),
    },
    equal: {
      probability: equalProb,
      multiplier: calculateMultiplier(equalProb / 100, streak) * 1.125,
    },
    nextCard,
    publicSeed,
    serverHash: nextServerHash, // Utiliser la nouvelle valeur
  };
}

export default defineEventHandler(async (event) => {
  const body = await readBody<RequestBody>(event);
  const { card } = body;

  if (
    !card ||
    typeof card.value !== "number" ||
    typeof card.suit !== "string" ||
    card.value < 1 ||
    card.value > 13 ||
    !["♠", "♥", "♦", "♣"].includes(card.suit)
  ) {
    throw createError({
      statusCode: 400,
      message: "Invalid card data: missing or invalid properties",
    });
  }

  return calculateProbabilities(card);
});
