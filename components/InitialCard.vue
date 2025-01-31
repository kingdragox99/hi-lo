<template>
  <ClientOnly>
    <div class="text-6xl font-bold" :class="{ 'text-red-500': isRedCard }">
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
  suit: number;
  value: number;
}

const props = defineProps<{
  card: Card;
}>();

const cards = {
  suits: ["♠", "♥", "♦", "♣"],
  values: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
};

const isRedCard = computed(
  () => props.card.suit === 1 || props.card.suit === 2
);

function formatCard(card: Card): string {
  return `${cards.values[card.value]}${cards.suits[card.suit]}`;
}
</script>
