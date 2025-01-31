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
            {{ $t("provablyFair.cardFormula") }}
          </div>
          <div class="font-mono text-sm break-all">
            hash({{ lastResult.seed }}) + {{ lastResult.previousValue }} % 13 =
            {{ lastResult.nextValue }} ({{
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

const toast = useToast();
const { t } = useI18n();

const props = defineProps<{
  lastResult?: {
    seed: string;
    previousValue: number;
    nextValue: number;
    nextSuit: number;
  };
}>();

const showDetails = ref(false);

const cards = {
  suits: ["♠", "♥", "♦", "♣"],
  values: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
};

function formatCard(card: { value: number; suit: number }): string {
  return `${cards.values[card.value]}${cards.suits[card.suit]}`;
}

function calculateHash(seed: string): number {
  return Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function verifyResult() {
  if (!props.lastResult) return;

  const hash = calculateHash(props.lastResult.seed);
  const calculatedValue = (hash + props.lastResult.previousValue) % 13;
  const calculatedSuit = Math.floor(
    (hash * props.lastResult.previousValue) % 4
  );

  if (
    calculatedValue === props.lastResult.nextValue &&
    calculatedSuit === props.lastResult.nextSuit
  ) {
    toast.success(t("provablyFair.verificationSuccess"));
  } else {
    toast.error(t("provablyFair.verificationFailed"));
  }
}

function copyFormula() {
  if (!props.lastResult) return;

  const formula = `function generateNextCard(seed, currentValue) {
    const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
      value: (hash + currentValue) % 13,
      suit: Math.floor((hash * currentValue) % 4)
    };
  }

  // Example:
  const seed = "${props.lastResult.seed}";
  const currentValue = ${props.lastResult.previousValue};
  const nextCard = generateNextCard(seed, currentValue); // Should be ${formatCard(
    {
      value: props.lastResult.nextValue,
      suit: props.lastResult.nextSuit,
    }
  )}`;

  navigator.clipboard.writeText(formula);
  toast.success(t("provablyFair.formulaCopied"));
}
</script>
