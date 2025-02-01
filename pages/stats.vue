<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">{{ $t("stats.title") }}</h1>

    <div v-if="isLoading" class="text-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="stats.totalGames === 0" class="text-center py-8">
      <p>{{ $t("stats.noData") }}</p>
    </div>

    <div v-else>
      <!-- Vue d'ensemble -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="stat bg-base-200 p-4 rounded-lg">
          <div class="stat-title">{{ $t("stats.totalGames") }}</div>
          <div class="stat-value">{{ stats.totalGames }}</div>
        </div>
        <div class="stat bg-base-200 p-4 rounded-lg">
          <div class="stat-title">{{ $t("stats.winRate") }}</div>
          <div class="stat-value">{{ stats.winRate }}%</div>
        </div>
        <div class="stat bg-base-200 p-4 rounded-lg">
          <div class="stat-title">{{ $t("stats.totalBets") }}</div>
          <div class="stat-value">{{ formatMoney(stats.totalBets) }}€</div>
        </div>
        <div class="stat bg-base-200 p-4 rounded-lg">
          <div class="stat-title">{{ $t("stats.totalPayouts") }}</div>
          <div class="stat-value">{{ formatMoney(stats.totalPayouts) }}€</div>
        </div>
      </div>

      <!-- Graphiques -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <!-- Distribution des prédictions -->
        <div class="bg-base-200 p-4 rounded-lg">
          <h3 class="text-xl font-bold mb-4">
            {{ $t("stats.predictionDistribution") }}
          </h3>
          <div class="h-64">
            <Bar :data="predictionChartData" :options="chartOptions" />
          </div>
        </div>

        <!-- Distribution des gains/pertes -->
        <div class="bg-base-200 p-4 rounded-lg">
          <h3 class="text-xl font-bold mb-4">
            {{ $t("stats.payoutDistribution") }}
          </h3>
          <div class="h-64">
            <Line :data="payoutChartData" :options="chartOptions" />
          </div>
        </div>
      </div>

      <!-- Dernières parties -->
      <div class="bg-base-200 p-4 rounded-lg">
        <h3 class="text-xl font-bold mb-4">{{ $t("stats.recentGames") }}</h3>
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>{{ $t("stats.time") }}</th>
                <th>{{ $t("stats.initialCard") }}</th>
                <th>{{ $t("stats.prediction") }}</th>
                <th>{{ $t("stats.nextCard") }}</th>
                <th>{{ $t("stats.result") }}</th>
                <th>{{ $t("stats.betAmount") }}</th>
                <th>{{ $t("stats.multiplier") }}</th>
                <th>{{ $t("stats.payout") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="game in recentGames" :key="game.id">
                <td>{{ formatDate(game.created_at) }}</td>
                <td>{{ formatCard(game.initial_card) }}</td>
                <td>{{ $t(`game.controls.${game.prediction}`) }}</td>
                <td>{{ formatCard(game.next_card) }}</td>
                <td>
                  <span :class="game.won ? 'text-success' : 'text-error'">
                    {{ game.won ? "✓" : "✗" }}
                  </span>
                </td>
                <td>{{ formatMoney(game.bet_amount) }}€</td>
                <td>x{{ game.multiplier }}</td>
                <td>{{ formatMoney(game.payout) }}€</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "vue-chartjs";
import { useSupabase } from "~/utils/supabase";
import { useI18n } from "vue-i18n";
import { CARDS } from "~/utils/constants";

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const { t } = useI18n();
const supabase = useSupabase();

const stats = ref({
  totalGames: 0,
  winRate: 0,
  totalBets: 0,
  totalPayouts: 0,
});

const recentGames = ref([]);

const predictionChartData = ref({
  labels: [
    t("game.controls.higher"),
    t("game.controls.lower"),
    t("game.controls.equal"),
  ],
  datasets: [
    {
      label: t("stats.totalPredictions"),
      data: [0, 0, 0],
      backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
    },
  ],
});

const payoutChartData = ref({
  labels: [],
  datasets: [
    {
      label: t("stats.totalPayouts"),
      data: [],
      borderColor: "#36A2EB",
      fill: true,
      backgroundColor: "rgba(54, 162, 235, 0.1)",
      tension: 0.1,
    },
    {
      label: t("stats.totalBets"),
      data: [],
      borderColor: "#FF6384",
      fill: true,
      backgroundColor: "rgba(255, 99, 132, 0.1)",
      tension: 0.1,
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "top" as const,
    },
    title: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          if (context.dataset.label === t("stats.payoutHistory")) {
            return `${t("stats.payout")}: ${formatMoney(context.raw)}€`;
          }
          return `${context.dataset.label}: ${context.raw}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value: any) {
          return formatMoney(value) + "€";
        },
      },
    },
  },
};

const isLoading = ref(true);

function formatMoney(amount: number): string {
  return amount.toLocaleString("fr-FR", { minimumFractionDigits: 2 });
}

function formatDate(date: string): string {
  return new Date(date).toLocaleString();
}

function formatCard(card: any): string {
  return `${CARDS.values[card.value]}${card.suit}`;
}

async function fetchStats() {
  try {
    isLoading.value = true;
    // Statistiques globales
    const { data: statsData, error: statsError } = await supabase
      .from("game_stats")
      .select("won, bet_amount, payout")
      .order("created_at", { ascending: false });

    console.log("Stats Data:", statsData);
    if (statsError) throw statsError;

    stats.value = {
      totalGames: statsData.length,
      winRate: Math.round(
        (statsData.filter((g) => g.won).length / statsData.length) * 100
      ),
      totalBets: statsData.reduce((sum, game) => sum + game.bet_amount, 0),
      totalPayouts: statsData.reduce((sum, game) => sum + game.payout, 0),
    };

    // Parties récentes
    const { data: recentData, error: recentError } = await supabase
      .from("game_stats")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (recentError) throw recentError;
    recentGames.value = recentData;

    // Distribution des prédictions
    const { data: predData, error: predError } = await supabase
      .from("game_stats")
      .select("prediction, won")
      .order("created_at", { ascending: false });

    console.log("Prediction Data:", predData);
    if (predError) throw predError;
    const predCounts = {
      higher: 0,
      lower: 0,
      equal: 0,
    };
    predData.forEach((game) => {
      predCounts[game.prediction]++;
    });
    predictionChartData.value.datasets[0].data = [
      predCounts.higher,
      predCounts.lower,
      predCounts.equal,
    ];

    // Distribution des gains
    const { data: payoutData, error: payoutError } = await supabase
      .from("game_stats")
      .select("created_at, payout, bet_amount")
      .order("created_at", { ascending: true })
      .limit(10);

    console.log("Payout Data:", payoutData);
    if (payoutError) throw payoutError;

    // Calculer les gains et mises cumulés
    let cumulativePayout = 0;
    let cumulativeBets = 0;

    payoutChartData.value.labels = payoutData.map((p) =>
      formatDate(p.created_at)
    );

    // Mettre à jour les deux datasets
    payoutChartData.value.datasets = [
      {
        label: t("stats.totalPayouts"),
        data: payoutData.map((p) => {
          cumulativePayout += p.payout;
          return cumulativePayout;
        }),
        borderColor: "#36A2EB",
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.1)",
        tension: 0.1,
      },
      {
        label: t("stats.totalBets"),
        data: payoutData.map((p) => {
          cumulativeBets += p.bet_amount;
          return cumulativeBets;
        }),
        borderColor: "#FF6384",
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.1)",
        tension: 0.1,
      },
    ];
  } catch (error) {
    console.error("Error fetching stats:", error.message, error.details);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchStats();
});
</script>
