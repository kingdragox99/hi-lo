<template>
  <div v-if="isVisible" class="toast toast-end z-50">
    <div
      class="alert shadow-lg"
      :class="{
        'bg-success text-white': type === 'success',
        'bg-error text-white': type === 'error',
        'bg-warning text-white': type === 'warning',
        'bg-info text-white': type === 'info',
      }"
    >
      <div class="flex items-center gap-2">
        <Icon :name="getIcon" class="w-5 h-5 text-white" />
        <span class="font-medium">{{ message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  type: "info",
  duration: 3000,
});

const isVisible = ref(false);

const getIcon = computed(() => {
  switch (props.type) {
    case "success":
      return "heroicons:check-circle";
    case "error":
      return "heroicons:x-circle";
    case "warning":
      return "heroicons:exclamation-triangle";
    default:
      return "heroicons:information-circle";
  }
});

onMounted(() => {
  isVisible.value = true;
  setTimeout(() => {
    isVisible.value = false;
  }, props.duration);
});
</script>

<style scoped>
.toast {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.alert {
  backdrop-filter: blur(8px);
}
</style>
