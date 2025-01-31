// Supprimons toute l'initialisation de Supabase et gardons uniquement le composable
export const useSupabase = () => {
  const { $supabase } = useNuxtApp()
  return $supabase
} 
