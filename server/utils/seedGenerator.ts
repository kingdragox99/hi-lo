import { createHash, randomBytes } from "crypto";
import { Card } from "../types/card";
import { SUITS } from "~/utils/constants";

interface Seeds {
  publicSeed: string;
  serverSeed: string;
  timestamp: number;
}

// Ajouter un sel supplémentaire qui change à chaque démarrage du serveur
const SERVER_SALT = randomBytes(32).toString("hex");

function generatePublicSeed(): string {
  // Générer 5 paires de nombres entre 01 et 39
  const pairs = Array.from({ length: 5 }, () => {
    const num1 = (Math.floor(Math.random() * 39) + 1)
      .toString()
      .padStart(2, "0");
    const num2 = (Math.floor(Math.random() * 39) + 1)
      .toString()
      .padStart(2, "0");
    return `${num1}${num2}`;
  });
  return pairs.join("-");
}

function generateServerSeed(): string {
  const randomBuffer = randomBytes(16);
  // Ajouter le sel au hash pour plus de sécurité
  return createHash("sha256")
    .update(randomBuffer)
    .update(SERVER_SALT)
    .digest("hex");
}

export function generateSeeds(): Seeds {
  const publicSeed = generatePublicSeed();
  const serverSeed = generateServerSeed();
  const timestamp = Date.now();

  return { publicSeed, serverSeed, timestamp };
}

export function generateNextCard(
  publicSeed: string,
  serverSeed: string,
  currentValue: number
): Card {
  // Combiner les seeds avec la valeur actuelle
  const combinedSeed = `${publicSeed}-${serverSeed}-${currentValue}`;
  const hash = createHash("sha256").update(combinedSeed).digest("hex");

  // Utiliser les premiers bytes du hash pour générer la carte
  const hashNumber = parseInt(hash.slice(0, 8), 16);

  return {
    value: (hashNumber % 13) + 1, // 1 = As, 2 = 2, ..., 12 = Q, 13 = K
    suit: SUITS[hashNumber % 4],
  };
}
