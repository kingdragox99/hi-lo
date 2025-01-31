<template>
  <div class="text-sm opacity-70">
    <div class="font-semibold mb-1">{{ $t("provablyFair.publicSeed") }}</div>
    <div class="font-mono break-all">{{ publicSeed }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  publicSeed: string;
}>();
</script>
