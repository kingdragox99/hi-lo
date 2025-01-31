import { defineStore } from "pinia";

export const useWalletStore = defineStore("wallet", {
  state: () => ({
    balance: 1000, // Montant initial
  }),

  actions: {
    addMoney(amount: number) {
      this.balance += amount;
    },
    removeMoney(amount: number) {
      if (this.balance >= amount) {
        this.balance -= amount;
        return true;
      }
      return false;
    },
  },
});
