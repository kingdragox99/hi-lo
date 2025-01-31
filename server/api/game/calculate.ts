import { defineEventHandler } from "h3";

interface CardState {
  suit: number;
  value: number;
  seed: string;
  streak: number;
}

interface Card {
  suit: number;
  value: number;
}

function generateNextCard(seed: string, currentValue: number): Card {
  // Utiliser le seed pour générer à la fois la valeur et la couleur
  const hash = Array.from(seed).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );

  return {
    value: (hash + currentValue) % 13,
    suit: Math.floor((hash * currentValue) % 4), // Utiliser le hash pour la couleur aussi
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
  const totalCards = 13;
  const currentValue = card.value;
  const streak = card.streak || 0;

  const higherCards = totalCards - (currentValue + 1);
  const lowerCards = currentValue;
  const equalCards = 1;

  const total = totalCards;

  // Calculer les probabilités en pourcentage (0-100)
  const higherProb = Math.round((higherCards / total) * 100);
  const lowerProb = Math.round((lowerCards / total) * 100);
  const equalProb = Math.round((equalCards / total) * 100);

  const nextCard = generateNextCard(card.seed, currentValue);

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
    nextCard, // Retourne maintenant un objet avec suit et value
  };
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { card } = body;

  if (!card || typeof card.value !== "number" || !card.seed) {
    throw createError({
      statusCode: 400,
      message: "Invalid card data",
    });
  }

  return calculateProbabilities(card);
});
