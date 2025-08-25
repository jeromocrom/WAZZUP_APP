# WAZZUP — MVP (Expo React Native)

Fonctionnalités incluses : carte interactive (React Native Maps) + pins par type et overlays d'état, liste filtrable, favoris (AsyncStorage), profil avec mode organisateur (placeholder).

## Lancer
```bash
npm install
npx expo install react-native-maps expo-location react-native-screens react-native-safe-area-context @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs @react-native-async-storage/async-storage
npm run start
```

## Fichiers clés
- `src/screens/MapScreen.tsx` — carte + markers
- `src/components/MarkerIcon.tsx` — composition pin + overlays
- `src/screens/ListScreen.tsx` — liste + filtres
- `src/screens/FavoritesScreen.tsx` — favoris
- `src/events.json` — données de démo
- `assets/markers/*`, `assets/overlays/*` — visuels

## Étapes suivantes
- Backend (Supabase/NestJS + Postgres), authentification, création d'évènements, Boost (Stripe), notifications ciblées.
