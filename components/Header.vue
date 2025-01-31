<template>
  <header class="bg-base-100 shadow-md">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <NuxtLink to="/" class="text-2xl font-bold">Logo</NuxtLink>

        <div class="flex items-center gap-6">
          <NuxtLink to="/" class="hover:text-primary transition-colors"
            >Accueil</NuxtLink
          >
          <NuxtLink to="/about" class="hover:text-primary transition-colors"
            >À propos</NuxtLink
          >
          <NuxtLink to="/contact" class="hover:text-primary transition-colors"
            >Contact</NuxtLink
          >
          <NuxtLink to="/hi-lo" class="hover:text-primary transition-colors"
            >Hi-Lo Game</NuxtLink
          >

          <button class="btn btn-ghost" @click="toggleTheme">
            <Icon name="heroicons:moon" v-if="theme === 'light'" />
            <Icon name="heroicons:sun" v-else />
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useUserStore } from "~/stores/user";

const theme = ref("light");
const userStore = useUserStore();

// Exemple d'utilisation du store
const handleSignOut = async () => {
  await userStore.signOut();
};

const toggleTheme = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme.value);
};
</script>
