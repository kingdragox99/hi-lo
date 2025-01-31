<template>
  <ClientOnly>
    <div
      v-if="card"
      class="text-6xl font-bold"
      :class="{ 'text-red-500': isRedCard }"
    >
      {{ formatCard(card) }}
    </div>
    <template #fallback>
      <div class="text-6xl font-bold">A♠</div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Card {
  value: number;
  suit: string;
}

const props = defineProps<{
  card?: Card;
}>();

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

const isRedCard = computed(() =>
  props.card ? props.card.suit === "♥" || props.card.suit === "♦" : false
);

function formatCard(card: Card): string {
  if (card.value < 1 || card.value > 13) {
    console.error("Invalid card value:", card.value);
    return "?";
  }
  return `${cards.values[card.value]}${card.suit}`;
}
</script>
