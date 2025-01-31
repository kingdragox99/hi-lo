<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <!-- Solde et Multiplicateur -->
      <div class="flex justify-between mb-8">
        <div class="text-2xl font-bold text-center">
          {{ $t("game.balance") }}: {{ wallet.balance }}€
        </div>
        <div
          class="text-2xl font-bold text-center text-primary"
          v-if="streak > 0"
        >
          {{ $t("game.multiplier") }}: x{{ currentMultiplier }}
        </div>
      </div>

      <!-- Carte actuelle -->
      <div class="card bg-base-200 p-8 mb-8 text-center">
        <h2 class="text-3xl font-bold mb-4">{{ $t("game.currentCard") }}</h2>
        <InitialCard :card="currentCard" class="mb-4" />
        <PublicSeed :public-seed="publicSeed" v-if="publicSeed" />
        <p class="text-lg mb-4">
          {{ $t("game.nextCardQuestion") }}
        </p>
      </div>

      <!-- Contrôles de mise -->
      <div class="flex flex-col gap-4 items-center mb-8">
        <div class="flex gap-4 justify-center" v-if="!isPlaying">
          <input
            v-model="bet"
            type="number"
            class="input input-bordered w-32"
            min="1"
            :max="wallet.balance"
            :disabled="streak > 0"
          />
          <button
            @click="startGame"
            class="btn btn-primary"
            :disabled="!canStartGame"
          >
            {{ $t("game.controls.start") }}
          </button>
        </div>

        <div v-else class="flex gap-4 justify-center">
          <button
            @click="placeBet('higher')"
            class="btn btn-primary"
            :disabled="!canBet"
          >
            {{ $t("game.controls.higher") }}
            <span class="text-xs block">
              {{ probabilities.higher?.probability }}% (x{{
                probabilities.higher?.multiplier
              }})
            </span>
          </button>
          <button
            @click="placeBet('equal')"
            class="btn btn-warning"
            :disabled="!canBet"
          >
            {{ $t("game.controls.equal") }}
            <span class="text-xs block">
              {{ probabilities.equal?.probability }}% (x{{
                probabilities.equal?.multiplier
              }})
            </span>
          </button>
          <button
            @click="placeBet('lower')"
            class="btn btn-secondary"
            :disabled="!canBet"
          >
            {{ $t("game.controls.lower") }}
            <span class="text-xs block">
              {{ probabilities.lower?.probability }}% (x{{
                probabilities.lower?.multiplier
              }})
            </span>
          </button>
          <button
            @click="collectWinnings"
            class="btn btn-success"
            v-if="streak > 0"
          >
            {{ $t("game.controls.collect") }} ({{ potentialWinnings }}€)
          </button>
        </div>
      </div>

      <!-- Provably Fair -->
      <ProvablyFair
        :last-result="lastResult"
        :public-seed="publicSeed"
        :server-hash="serverHash"
      />

      <!-- Historique -->
      <div class="text-center">
        <h3 class="text-xl font-bold mb-2">{{ $t("game.history") }}</h3>
        <div class="flex gap-2 justify-center flex-wrap">
          <div
            v-for="(result, index) in history"
            :key="index"
            class="badge"
            :class="[
              result.won ? 'badge-success' : 'badge-error',
              { 'text-red-500': isRedCard(result.card) },
            ]"
          >
            {{ formatCard(result.card) }}
            <span class="text-xs ml-1">
              ({{
                result.prediction === "higher"
                  ? "↑"
                  : result.prediction === "lower"
                  ? "↓"
                  : "="
              }})
            </span>
          </div>
        </div>
      </div>
    </div>
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useWalletStore } from "~/stores/wallet";
import { useToast } from "~/composables/useToast";
import { useI18n } from "vue-i18n";
import ProvablyFair from "~/components/ProvablyFair.vue";
import InitialCard from "~/components/InitialCard.vue";
import PublicSeed from "~/components/PublicSeed.vue";
import { CARDS } from "~/utils/constants";

interface Card {
  value: number;
  suit: string;
}

interface GameHistory {
  card: Card;
  previousCard: Card;
  prediction: string;
  won: boolean;
  multiplier: number;
}

interface Probabilities {
  higher?: {
    probability: number;
    multiplier: number;
  };
  lower?: {
    probability: number;
    multiplier: number;
  };
  equal?: {
    probability: number;
    multiplier: number;
  };
  nextCard?: Card;
  serverHash: string;
  publicSeed: string;
}

const toast = useToast();
const wallet = useWalletStore();
const { t } = useI18n();
const bet = ref(10);
const currentCard = ref<Card>({ value: 1, suit: "♠" });
const history = ref<GameHistory[]>([]);
const isPlaying = ref(false);
const streak = ref(0);
const probabilities = ref<Probabilities>({});
const currentSeed = ref("");
const lastResult = ref(null);
const isInitialized = ref(false);
const publicSeed = ref("");
const serverHash = ref("");

// Calculer la probabilité de gagner pour la prédiction actuelle
function calculateWinProbability(card: Card, prediction: string): number {
  const totalCards = 13; // A à K
  let favorableOutcomes = 0;

  if (prediction === "higher") {
    // Compte combien de cartes sont plus hautes
    favorableOutcomes = totalCards - (card.value + 1);
  } else {
    // Compte combien de cartes sont plus basses
    favorableOutcomes = card.value;
  }

  return favorableOutcomes / totalCards;
}

// Calculer le multiplicateur basé sur la probabilité
function calculateMultiplier(probability: number) {
  // Formule : plus la probabilité est faible, plus le multiplicateur est élevé
  // Base : 1 + (1 - probabilité) * facteur
  const baseMult = 1 + (1 - probability) * 2;
  return parseFloat(baseMult.toFixed(2));
}

// Multiplicateur qui augmente avec chaque bonne réponse, pondéré par la probabilité
const currentMultiplier = computed(() => {
  if (streak.value === 0) return 1;

  let totalMultiplier = 1;
  // Parcourir l'historique pour calculer le multiplicateur cumulé
  history.value.slice(0, streak.value).forEach((result) => {
    const probability = calculateWinProbability(
      result.previousCard,
      result.prediction
    );
    const stepMultiplier = calculateMultiplier(probability);
    totalMultiplier *= stepMultiplier;
  });

  return parseFloat(totalMultiplier.toFixed(2));
});

// Gains potentiels basés sur la mise initiale et le multiplicateur
const potentialWinnings = computed(() => {
  return Math.floor(bet.value * currentMultiplier.value);
});

const canStartGame = computed(() => {
  return !isPlaying.value && bet.value > 0 && bet.value <= wallet.balance;
});

const canBet = computed(() => {
  return isPlaying.value && !waitingForNext.value;
});

function generateRandomCard(): Card {
  const suit = Math.floor(Math.random() * 4);
  const value = Math.floor(Math.random() * 13);
  return { suit: CARDS.suits[suit], value };
}

function getCardValue(card: Card): number {
  return card.value;
}

function formatCard(card: Card): string {
  if (card.value < 1 || card.value > 13) {
    console.error("Invalid card value:", card.value);
    return "?";
  }
  return `${CARDS.values[card.value]}${card.suit}`;
}

function isRedCard(card: Card): boolean {
  return card.suit === "♥" || card.suit === "♦"; // ♥ ou ♦
}

function generateSeed() {
  return Math.random().toString(36).substring(7);
}

async function updateProbabilities() {
  try {
    const response = await $fetch("/api/game/calculate", {
      method: "POST",
      body: {
        card: {
          ...currentCard.value,
          seed: currentSeed.value,
          streak: streak.value,
        },
      },
    });
    probabilities.value = response;
  } catch (error) {
    console.error("Error calculating probabilities:", error);
  }
}

async function startGame() {
  if (!canStartGame.value) return;

  if (!wallet.removeMoney(bet.value)) {
    toast.error(t("game.messages.insufficientBalance"));
    return;
  }

  currentSeed.value = generateSeed();
  isPlaying.value = true;
  streak.value = 0;
  history.value = [];

  try {
    // Obtenir la première carte du serveur
    const {
      card,
      publicSeed: seed,
      serverHash: hash,
    } = await $fetch("/api/game/initial-card");
    currentCard.value = card;
    publicSeed.value = seed;
    serverHash.value = hash;

    // Calculer les probabilités pour la première carte
    const response = await $fetch("/api/game/calculate", {
      method: "POST",
      body: {
        card: {
          ...currentCard.value,
          seed: currentSeed.value,
          streak: streak.value,
        },
      },
    });
    probabilities.value = response;
  } catch (error) {
    toast.error(t("game.messages.errorInitialCard"));
    return;
  }
  lastResult.value = null;
}

function collectWinnings() {
  const winnings = potentialWinnings.value;
  wallet.addMoney(winnings);
  toast.success(t("game.messages.collected", { amount: winnings }));

  // Réinitialiser le jeu
  isPlaying.value = false;
  streak.value = 0;
  history.value = [];
}

const waitingForNext = ref(false);

async function placeBet(prediction: "higher" | "lower" | "equal") {
  if (!canBet.value) return;

  waitingForNext.value = true;
  const oldCard = { ...currentCard.value };

  if (!probabilities.value.nextCard) {
    toast.error(t("game.messages.errorNextCard"));
    waitingForNext.value = false;
    return;
  }

  // Utiliser la carte prédéterminée du serveur
  const newCard = probabilities.value.nextCard;
  if (!isValidCard(newCard)) {
    console.error("Invalid next card:", newCard);
    toast.error(t("game.messages.errorNextCard"));
    waitingForNext.value = false;
    return;
  }

  currentCard.value = newCard; // Mettre à jour la carte immédiatement

  // Vérifier si gagné
  const won =
    (prediction === "higher" && newCard.value > oldCard.value) ||
    (prediction === "lower" && newCard.value < oldCard.value) ||
    (prediction === "equal" && newCard.value === oldCard.value);

  // Sauvegarder les informations pour le provably fair dans tous les cas
  lastResult.value = {
    seed: currentSeed.value,
    previousValue: oldCard.value,
    nextValue: newCard.value,
    nextSuit: newCard.suit,
  };

  // S'assurer que le serverHash est mis à jour avec la nouvelle valeur
  serverHash.value = probabilities.value.serverHash;
  publicSeed.value = probabilities.value.publicSeed;

  // Mettre à jour l'historique
  history.value.unshift({
    card: newCard,
    previousCard: oldCard,
    prediction,
    won,
    multiplier: probabilities.value[prediction].multiplier,
  });

  if (won) {
    streak.value++;
    const winMultiplier = probabilities.value[prediction].multiplier;
    toast.success(
      t("game.messages.goodPrediction", {
        probability: probabilities.value[prediction].probability,
        multiplier: winMultiplier,
      })
    );
    currentSeed.value = generateSeed(); // Nouveau seed pour la prochaine carte
    await updateProbabilities();
  } else {
    endGame(false);
  }

  waitingForNext.value = false;
}

function endGame(withWinnings = true) {
  if (withWinnings && streak.value > 0) {
    const winnings = potentialWinnings.value;
    wallet.addMoney(winnings);
    toast.success(t("game.messages.gameOver", { amount: winnings }));
  } else {
    toast.error(t("game.messages.gameLost", { amount: bet.value }));
  }

  isPlaying.value = false;
  streak.value = 0;
  waitingForNext.value = false;
}

function isValidCard(card: Card): boolean {
  return (
    card &&
    typeof card.value === "number" &&
    card.value >= 1 &&
    card.value <= 13 &&
    typeof card.suit === "string" &&
    ["♠", "♥", "♦", "♣"].includes(card.suit)
  );
}

// Récupérer les seeds au chargement
onMounted(async () => {
  try {
    const { publicSeed: seed, timestamp } = await $fetch("/api/game/seeds");
    publicSeed.value = seed;
  } catch (error) {
    console.error("Error fetching seeds:", error);
  }
});
</script>

<style scoped>
.card {
  min-height: 300px;
}
</style>
