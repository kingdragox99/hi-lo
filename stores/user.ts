import { defineStore } from 'pinia'
import { useSupabase } from '~/utils/supabase'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    loading: false,
  }),

  actions: {
    async fetchUser() {
      const supabase = useSupabase()
      try {
        this.loading = true
        const { data: { user } } = await supabase.auth.getUser()
        this.user = user
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error)
        this.user = null
      } finally {
        this.loading = false
      }
    },

    async signOut() {
      const supabase = useSupabase()
      try {
        await supabase.auth.signOut()
        this.user = null
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error)
      }
    }
  }
}) 
