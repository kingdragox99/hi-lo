<template>
  <div class="bg-base-200 p-4 rounded-lg">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-bold">{{ $t("provablyFair.title") }}</h3>
      <button class="btn btn-ghost btn-sm" @click="showDetails = !showDetails">
        <Icon
          :name="
            showDetails ? 'heroicons:chevron-up' : 'heroicons:chevron-down'
          "
        />
      </button>
    </div>

    <div v-if="showDetails" class="space-y-4 animate-fade-in">
      <div v-if="lastResult" class="space-y-4">
        <div class="grid gap-2">
          <div class="text-sm opacity-70">
            {{ $t("provablyFair.lastSeed") }}
          </div>
          <div class="font-mono text-sm break-all">{{ lastResult.seed }}</div>
        </div>

        <div class="grid gap-2">
          <div class="text-sm opacity-70">
            {{ $t("provablyFair.publicSeed") }}
          </div>
          <div class="font-mono text-sm break-all">{{ publicSeed }}</div>
        </div>

        <div class="grid gap-2">
          <div class="text-sm opacity-70">
            {{ $t("provablyFair.cardFormula") }}
          </div>
          <div class="font-mono text-sm break-all">
            SHA256({{ publicSeed }}-{{ serverHash }}-{{
              lastResult.previousValue
            }}) % 13 + 1 = {{ lastResult.nextValue }} ({{
              formatCard({
                value: lastResult.nextValue,
                suit: lastResult.nextSuit,
              })
            }})
          </div>
        </div>

        <div class="text-sm opacity-70">
          {{ $t("provablyFair.explanation") }}
        </div>

        <div class="flex gap-2">
          <button class="btn btn-sm" @click="verifyResult">
            {{ $t("provablyFair.verify") }}
          </button>
          <button class="btn btn-sm" @click="copyFormula">
            {{ $t("provablyFair.copyFormula") }}
          </button>
        </div>
      </div>
      <div v-else class="text-sm opacity-70">
        {{ $t("provablyFair.noLastHand") }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "~/composables/useToast";
import { useI18n } from "vue-i18n";
import CryptoJS from "crypto-js";
import { verifyCard } from "~/utils/cardVerification";

const toast = useToast();
const { t } = useI18n();

const props = defineProps<{
  lastResult?: {
    seed: string;
    previousValue: number;
    nextValue: number;
    nextSuit: string;
  };
  publicSeed: string;
  serverHash: string;
}>();

const showDetails = ref(false);

const cards = {
  values: [
    "",
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ],
};

const SUITS = ["♠", "♥", "♦", "♣"] as const;

function formatCard(card: { value: number; suit: string }): string {
  return `${cards.values[card.value]}${card.suit}`;
}

function verifyNextCard(
  publicSeed: string,
  serverSeed: string,
  currentValue: number
) {
  return verifyCard(publicSeed, serverSeed, currentValue);
}

function verifyResult() {
  if (!props.lastResult) return;

  console.log("Verification inputs:", {
    publicSeed: props.publicSeed,
    serverHash: props.serverHash,
    previousValue: props.lastResult.previousValue,
    combinedSeed: `${props.publicSeed}-${props.serverHash}-${props.lastResult.previousValue}`,
  });

  const calculatedCard = verifyNextCard(
    props.publicSeed,
    props.serverHash,
    props.lastResult.previousValue
  );

  console.log("Verification results:", {
    calculated: calculatedCard,
    expected: {
      value: props.lastResult.nextValue,
      suit: props.lastResult.nextSuit,
    },
    hash: CryptoJS.SHA256(
      `${props.publicSeed}-${props.serverHash}-${props.lastResult.previousValue}`
    ).toString(CryptoJS.enc.Hex),
  });

  if (
    calculatedCard.value === props.lastResult.nextValue &&
    calculatedCard.suit === props.lastResult.nextSuit
  ) {
    toast.success(t("provablyFair.verificationSuccess"));
  } else {
    toast.error(t("provablyFair.verificationFailed"));
  }
}

function copyFormula() {
  if (!props.lastResult) return;

  const formula = `
  const SUITS = ["♠", "♥", "♦", "♣"];

  function generateNextCard(publicSeed, serverSeed, currentValue) {
    const combinedSeed = \`\${publicSeed}-\${serverSeed}-\${currentValue}\`;
    const hash = CryptoJS.SHA256(combinedSeed).toString(CryptoJS.enc.Hex);
    const hashNumber = parseInt(hash.slice(0, 8), 16);

    return {
      value: (hashNumber % 13) + 1,
      suit: SUITS[hashNumber % 4]
    };
  }

  // Example:
  const publicSeed = "${props.publicSeed}";
  const serverSeed = "${props.serverHash}";
  const currentValue = ${props.lastResult.previousValue};
  const nextCard = generateNextCard(publicSeed, serverSeed, currentValue); // Should be ${formatCard(
    {
      value: props.lastResult.nextValue,
      suit: props.lastResult.nextSuit,
    }
  )}`;

  navigator.clipboard.writeText(formula);
  toast.success(t("provablyFair.formulaCopied"));
}
</script>
