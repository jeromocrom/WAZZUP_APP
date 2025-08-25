import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeProfileScreen from '../screens/Profile/HomeProfileScreen';
import UserProfileScreen from '../screens/Profile/UserProfileScreen';
import OrganizerProfileScreen from '../screens/Profile/OrganizerProfileScreen';

export type ProfileStackParams = {
  ProfileHome: undefined;
  UserProfile: { id?: string } | undefined;
  OrganizerProfile: { id?: string } | undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParams>();

export default function ProfileStack(){
  return (
    <Stack.Navigator
      initialRouteName="ProfileHome"
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#FFF' },
        headerTitleStyle: { fontWeight: '900' },
        contentStyle: { backgroundColor:'#FFF' }
      }}
    >
      <Stack.Screen name="ProfileHome" component={HomeProfileScreen} options={{ title:'Profil' }} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ title:'Artiste (Premium)' }} />
      <Stack.Screen name="OrganizerProfile" component={OrganizerProfileScreen} options={{ title:'Organisateur' }} />
    </Stack.Navigator>
  );
}
