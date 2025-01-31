<template>
  <main class="min-h-screen">
    <!-- Hero Section -->
    <section class="bg-base-200 py-20">
      <div class="container mx-auto px-4">
        <div class="text-center animate-fade-in-up">
          <h1 class="text-5xl font-bold mb-6">Bienvenue sur votre site</h1>
          <p class="text-xl mb-8 text-base-content/80">
            Une description accrocheuse de votre projet ou entreprise
          </p>
          <button class="btn btn-primary btn-lg">En savoir plus</button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Nos Services</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="i in 3"
            :key="i"
            class="card bg-base-100 shadow-xl animate-fade-in"
          >
            <div class="card-body">
              <h3 class="card-title">Service {{ i }}</h3>
              <p>
                Description du service avec quelques détails pertinents pour vos
                visiteurs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-primary text-primary-content py-20">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-6">Prêt à commencer ?</h2>
        <p class="mb-8">
          Contactez-nous dès maintenant pour discuter de votre projet
        </p>
        <button class="btn btn-secondary btn-lg">Contactez-nous</button>
      </div>
    </section>
  </main>
</template>

<script setup>
// Vous pouvez ajouter ici la logique nécessaire
</script>
