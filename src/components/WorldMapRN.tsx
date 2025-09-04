import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import ClusteredMapView from 'react-native-map-clustering';
import { Marker, Region } from 'react-native-maps';
import type { WazzupEvent } from '@/types';

type Props = {
  events: WazzupEvent[];
  onMarkerPress?: (id: string) => void;
  headerOffset?: number;
};

function computeInitialRegion(events: WazzupEvent[]): Region {
  if (!events?.length) {
    return {
      latitude: 48.8566,
      longitude: 2.3522,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    };
  }
  const lats = events.map(e => e.lat);
  const lngs = events.map(e => e.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const lat = (minLat + maxLat) / 2;
  const lng = (minLng + maxLng) / 2;
  const latDelta = Math.max(0.05, (maxLat - minLat) * 1.5);
  const lngDelta = Math.max(0.05, (maxLng - minLng) * 1.5);
  return { latitude: lat, longitude: lng, latitudeDelta: latDelta, longitudeDelta: lngDelta };
}

export default function WorldMapRN({ events, onMarkerPress, headerOffset = 0 }: Props) {
  const region = useMemo(() => computeInitialRegion(events), [events]);

  return (
    <View style={{ flex: 1, paddingTop: headerOffset }}>
      <ClusteredMapView
        style={{ flex: 1 }}
        initialRegion={region}
        animationEnabled
        spiralEnabled
        clusterColor="#FFD300"
        clusterTextColor="#000"
        clusterTextSize={14}
      >
        {events.map(ev => (
          <Marker
            key={ev.id}
            coordinate={{ latitude: ev.lat, longitude: ev.lng }}
            onPress={() => onMarkerPress?.(ev.id)}
          >
            <View style={{
              backgroundColor: '#FFD300',
              borderColor: '#000', 
              borderWidth: 2, 
              borderRadius: 999,
              paddingHorizontal: 10, 
              paddingVertical: 6
            }}>
              <Text style={{ fontWeight: '900' }}>{ev.title}</Text>
            </View>
          </Marker>
        ))}
      </ClusteredMapView>
    </View>
  );
}