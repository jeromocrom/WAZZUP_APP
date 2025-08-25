import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { MarkerState, EventType } from '@/types';

const markerSources: Record<EventType, any> = {
  soiree_club: require('../../assets/markers/marker_soiree_club.png'),
  concert: require('../../assets/markers/marker_concert.png'),
  dj_set: require('../../assets/markers/marker_dj_set.png'),
  festival: require('../../assets/markers/marker_festival.png'),
  after: require('../../assets/markers/marker_after.png'),
  expo_art: require('../../assets/markers/marker_expo_art.png'),
  standup: require('../../assets/markers/marker_standup.png'),
  show: require('../../assets/markers/marker_show.png'),
  food_market: require('../../assets/markers/marker_food_market.png'),
  sport: require('../../assets/markers/marker_sport.png'),
  networking: require('../../assets/markers/marker_networking.png'),
  student: require('../../assets/markers/marker_student.png'),
  photo_video: require('../../assets/markers/marker_photo_video.png'),
};

const overlaySources: Record<MarkerState, any> = {
  live: require('../../assets/overlays/overlay_live.png'),
  trending: require('../../assets/overlays/overlay_trending.png'),
  verified: require('../../assets/overlays/overlay_verified.png'),
  premium: require('../../assets/overlays/overlay_premium.png'),
};

export default function MarkerIcon({ type, states = [] as MarkerState[] }:{type: EventType; states?: MarkerState[]}){
  return (
    <View style={styles.box}>
      <Image source={markerSources[type]} style={styles.base} />
      {states.map(s => <Image key={s} source={overlaySources[s]} style={styles.overlay} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  box:{ width: 32, height: 40 },
  base:{ position:'absolute', width: 32, height: 40, resizeMode:'contain' },
  overlay:{ position:'absolute', width: 32, height: 40, resizeMode:'contain' }
});