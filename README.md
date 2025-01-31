# Template Nuxt 3 avec Supabase et Pinia

Un template Nuxt 3 préconfiguré avec Supabase pour la base de données et l'authentification, et Pinia pour la gestion d'état.

## Prérequis

- Node.js (version 16 ou supérieure)
- Docker (pour Supabase en local)
- Supabase CLI

## Installation

1. Cloner le projet :

```bash
git clone [url-du-repo]
cd [nom-du-projet]
```

2. Installer les dépendances :

```bash
yarn install
```

3. Installer Supabase CLI globalement :

```bash
npm install -g supabase-cli
```

4. Configurer l'environnement :

- Copier le fichier `.env.example` vers `.env`

```bash
cp .env.example .env
```

- Remplir les variables d'environnement dans `.env` avec vos valeurs

## Configuration de Supabase en local

1. Démarrer les services Supabase :

```bash
supabase start
```

2. Après le démarrage, Supabase affichera les informations de configuration dans le terminal. Copiez ces valeurs dans votre fichier `.env` :

```env
# URL de l'API Supabase local
NUXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321

# Clé anon affichée dans le terminal après 'supabase start'
NUXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_affichée_dans_le_terminal
```

⚠️ Notes importantes :

- L'URL doit être exactement `http://127.0.0.1:54321`
- La clé anon doit être copiée exactement comme affichée dans le terminal
- Assurez-vous qu'il n'y a pas d'espaces avant ou après les valeurs
- Redémarrez le serveur de développement après avoir modifié le fichier `.env`

Pour vérifier que Supabase fonctionne :

1. Ouvrez le Studio Supabase sur `http://127.0.0.1:54323`
2. Vérifiez que vous pouvez accéder au dashboard
3. Testez l'authentification dans votre application

## Développement

Lancer le serveur de développement :

```bash
yarn dev
```

L'application sera disponible sur `http://localhost:3000`

## Structure du projet

- `/components` : Composants Vue réutilisables
- `/stores` : Stores Pinia pour la gestion d'état
- `/utils` : Utilitaires, dont la configuration Supabase
- `/pages` : Routes de l'application
- `/supabase` : Configuration Supabase

## Fonctionnalités incluses

- 🔐 Authentification avec Supabase
- 📦 Gestion d'état avec Pinia
- 🎨 UI avec Tailwind CSS
- 🌓 Thème clair/sombre
- 🔍 SEO optimisé
- 📊 Analytics Google (configurable)

## Production

Construire l'application pour la production :

```bash
yarn build
```

Prévisualiser la version de production :

```bash
yarn preview
```

## Commandes utiles Supabase

```bash
# Démarrer Supabase
supabase start

# Arrêter Supabase
supabase stop

# Réinitialiser la base de données
supabase db reset

# Voir les logs
supabase logs
```

## Documentation utile

- [Documentation Nuxt 3](https://nuxt.com/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Pinia](https://pinia.vuejs.org/)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)

## Licence

MIT
