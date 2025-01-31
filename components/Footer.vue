<template>
  <footer class="bg-base-200">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-lg font-bold mb-4">À propos</h3>
          <p class="text-base-content/80">
            Une brève description de votre entreprise ou projet ici.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-bold mb-4">Liens rapides</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/" class="hover:text-primary transition-colors"
                >Accueil</NuxtLink
              >
            </li>
            <li>
              <NuxtLink to="/about" class="hover:text-primary transition-colors"
                >À propos</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/contact"
                class="hover:text-primary transition-colors"
                >Contact</NuxtLink
              >
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-bold mb-4">Contact</h3>
          <ul class="space-y-2">
            <li>Email: contact@example.com</li>
            <li>Téléphone: +33 1 23 45 67 89</li>
            <li>Adresse: Paris, France</li>
          </ul>
        </div>
      </div>

      <div class="border-t border-base-300 mt-8 pt-8 text-center">
        <p>
          &copy; {{ new Date().getFullYear() }} Votre Entreprise. Tous droits
          réservés.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup></script>
