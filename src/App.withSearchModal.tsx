import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from './screens/MapScreen';
import ExplorerScreenV2 from './screens/ExplorerScreenV2';
import FavoritesScreen from './screens/FavoritesScreen';
import ProfileScreen from './screens/ProfileScreen';
import SearchModal from './screens/SearchModal';
import { StatusBar } from 'expo-status-bar';
import { Image, Platform } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ routeName, focused }: { routeName: string; focused: boolean }) {
  const map = {
    'Carte': [require('../assets/icons/tab_map_default.png'), require('../assets/icons/tab_map_active.png')],
    'Explorer': [require('../assets/icons/tab_explore_default.png'), require('../assets/icons/tab_explore_active.png')],
    'Favoris': [require('../assets/icons/tab_favorites_default.png'), require('../assets/icons/tab_favorites_active.png')],
    'Profil': [require('../assets/icons/tab_profile_default.png'), require('../assets/icons/tab_profile_active.png')],
  } as const;
  const set = map[routeName as keyof typeof map];
  const src = focused ? set?.[1] : set?.[0];
  return <Image source={src} style={{ width: 24, height: 24 }} />;
}

function Tabs(){
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon routeName={route.name} focused={focused} />,
        tabBarLabelStyle: { fontWeight: '700' },
        tabBarStyle: {
          position: 'absolute',
          left: 12, right: 12,
          bottom: 12,
          height: Platform.OS === 'ios' ? 70 : 66,
          paddingBottom: Platform.OS === 'ios' ? 18 : 10,
          paddingTop: 8,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: '#000',
          backgroundColor: '#fff',
          elevation: 6,
          shadowColor: '#000',
          shadowOpacity: 0.12,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
        },
      })}
    >
      <Tab.Screen name="Carte" component={MapScreen} />
      <Tab.Screen name="Explorer" component={ExplorerScreenV2} />
      <Tab.Screen name="Favoris" component={FavoritesScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App(){
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown:false }}>
        <Stack.Screen name="Root" component={Tabs} />
        <Stack.Screen
          name="SearchModal"
          component={SearchModal}
          options={{ presentation: Platform.OS === 'ios' ? 'modal' : 'containedModal', animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
