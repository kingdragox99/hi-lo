<template>
  <main class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="container mx-auto px-4">
      <div class="text-center max-w-2xl mx-auto">
        <h1 class="text-5xl font-bold mb-6">Hi-Lo Game</h1>
        <p class="text-xl mb-8 text-base-content/80">
          Prédisez si la prochaine carte sera plus haute, plus basse ou égale.
          Plus vous enchaînez les bonnes prédictions, plus vos gains augmentent
          !
        </p>
        <NuxtLink to="/hi-lo" class="btn btn-primary btn-lg">
          Jouer maintenant
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup>
// La logique sera ajoutée si nécessaire
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
