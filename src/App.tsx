import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Using absolute path with alias
import Tabs from '@/navigation/Tabs';
import SearchModal from '@/screens/SearchModal';
import { navigationRef } from '@/navigation/rootNavigation';
import { GlobalModalProvider } from '@/context/GlobalModalContext';

const Stack = createNativeStackNavigator();

export default function App(){
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <GlobalModalProvider>
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Root" component={Tabs} />
              <Stack.Screen 
                name="SearchModal" 
                component={SearchModal}
                options={{ 
                  presentation: 'modal',
                  animation: 'slide_from_bottom'
                }} 
              />
            </Stack.Navigator>
          </NavigationContainer>
        </GlobalModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
