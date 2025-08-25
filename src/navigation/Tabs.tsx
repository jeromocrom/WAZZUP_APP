import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MapScreen from '../screens/MapScreen';
import ExplorerScreenV2 from '../screens/ExplorerScreenV2';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileStack from '../navigation/ProfileStack'; // ✅ pile profils

const Tab = createBottomTabNavigator();

function Icon({ name, focused }:{ name: keyof typeof Feather.glyphMap; focused:boolean }){
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Feather name={name} size={18} color="#000" />
    </View>
  );
}

export default function Tabs(){
  const insets = useSafeAreaInsets();
  const padB = Math.max(10, insets.bottom);
  const height = 58 + padB;
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#000',
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height,
          paddingBottom: padB,
          paddingTop: 8,
          borderTopWidth: 2,
          borderColor: '#000',
          backgroundColor: '#FFF',
        },
        tabBarLabelStyle: {
          fontWeight: '900'
        }
      }}
    >
      <Tab.Screen name="Map" component={MapScreen} options={{ tabBarLabel:'Carte', tabBarIcon:({focused})=> <Icon name="map" focused={focused} /> }} />
      <Tab.Screen name="Explore" component={ExplorerScreenV2} options={{ tabBarLabel:'Explorer', tabBarIcon:({focused})=> <Icon name="compass" focused={focused} /> }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ tabBarLabel:'Favoris', tabBarIcon:({focused})=> <Icon name="star" focused={focused} /> }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ tabBarLabel:'Profil', tabBarIcon:({focused})=> <Icon name="user" focused={focused} /> }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrap:{
    width:30, height:30, borderRadius:12, borderWidth:1.5, borderColor:'#000',
    alignItems:'center', justifyContent:'center', backgroundColor:'#FFF'
  },
  iconWrapActive:{ backgroundColor:'#FFD300' }
});
