<template>
  <header class="bg-base-200 shadow-lg">
    <div class="container mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <NuxtLink to="/" class="text-2xl font-bold text-primary"
          >Hi-Lo Game</NuxtLink
        >

        <div class="flex items-center gap-6">
          <nav class="flex gap-6">
            <NuxtLink
              to="/hi-lo"
              class="hover:text-primary transition-colors"
              active-class="text-primary"
            >
              {{ $t("nav.play") }}
            </NuxtLink>
            <NuxtLink
              to="/leaderboard"
              class="hover:text-primary transition-colors"
              active-class="text-primary"
            >
              {{ $t("nav.leaderboard") }}
            </NuxtLink>
            <NuxtLink
              to="/how-to-play"
              class="hover:text-primary transition-colors"
              active-class="text-primary"
            >
              {{ $t("nav.howToPlay") }}
            </NuxtLink>
            <NuxtLink
              to="/stats"
              class="hover:text-primary transition-colors"
              active-class="text-primary"
            >
              {{ $t("nav.stats") }}
            </NuxtLink>
          </nav>

          <!-- Sélecteur de langue -->
          <select
            v-model="locale"
            class="select select-sm select-bordered"
            @change="switchLanguage"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>

          <!-- Bouton de thème -->
          <ClientOnly>
            <button class="btn btn-ghost btn-sm" @click="toggleTheme">
              <Icon
                :name="theme === 'light' ? 'heroicons:moon' : 'heroicons:sun'"
                class="w-5 h-5"
              />
            </button>
          </ClientOnly>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const theme = ref("light");

onMounted(() => {
  // Accéder au localStorage uniquement côté client
  const savedTheme = process.client ? localStorage.getItem("theme") : "light";
  theme.value = savedTheme || "light";
  document.documentElement.setAttribute("data-theme", theme.value);
});

function toggleTheme() {
  theme.value = theme.value === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme.value);
  if (process.client) {
    localStorage.setItem("theme", theme.value);
  }
}

function switchLanguage(event) {
  locale.value = event.target.value;
}
</script>
