<template>
  <div class="fixed bottom-4 right-4 z-50 space-y-2">
    <Toast
      v-for="toast in toasts"
      :key="toast.id"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
    />
  </div>
</template>

<script setup lang="ts">
import { useToast } from "~/composables/useToast";

const { toasts } = useToast();
</script>
