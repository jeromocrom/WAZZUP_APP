import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import type { WazzupEvent, EventType } from '@/types';
import FavoriteStar from '@/components/FavoriteStar';
import { adaptEvent } from '@/utils/eventAdapter';
import { tokens } from '@/theme/tokens';

// Event type icon mapping with typography-friendly icons
function getEventTypeIcon(type: EventType | string | null): string {
  const iconMap: Record<string, string> = {
    soiree_club: '🏢',
    concert: '🎤',
    dj_set: '🎧',
    festival: '🎪',
    after: '🌙',
    expo_art: '🎨',
    standup: '🎭',
    show: '🎬',
    food_market: '🍽️',
    sport: '⚽',
    networking: '🤝',
    student: '🎓',
    photo_video: '📸'
  };
  return iconMap[type || ''] || '🎉';
}

function getEventTypeLabel(type: EventType | string | null): string {
  const labelMap: Record<string, string> = {
    soiree_club: 'SOIRÉE',
    concert: 'CONCERT',
    dj_set: 'DJ SET',
    festival: 'FESTIVAL',
    after: 'AFTER',
    expo_art: 'EXPO',
    standup: 'STAND-UP',
    show: 'SHOW',
    food_market: 'FOOD',
    sport: 'SPORT',
    networking: 'NETWORK',
    student: 'STUDENT',
    photo_video: 'PHOTO'
  };
  return labelMap[type || ''] || 'ÉVÉNEMENT';
}

interface EventCardProps {
  ev: WazzupEvent | any;
  onPress?: (ev: any) => void;
  onToggleFavorite?: (id: string, value: boolean) => void;
}

function EventCard({
  ev,
  onPress,
  onToggleFavorite
}: EventCardProps){
  const a = useMemo(()=> adaptEvent(ev), [ev]);
  const [fav, setFav] = useState<boolean>(!!a.isFavorite);
  const cover = useMemo(() => a.cover || (a.photos && a.photos[0]), [a.cover, a.photos]);

  const toggle = useCallback(() => {
    const nv = !fav;
    setFav(nv);
    onToggleFavorite?.(a.id, nv);
  }, [fav, onToggleFavorite, a.id]);

  const handlePress = useCallback(() => {
    onPress?.(ev);
  }, [onPress, ev]);

  const metaText = useMemo(() => {
    const venue = a.venue ? a.venue : '';
    const city = a.city ? (a.venue ? ' • ' : '') + a.city : '';
    return venue + city;
  }, [a.venue, a.city]);

  return (
    <Pressable onPress={handlePress} style={styles.card}>
      {cover ? (
        <Image source={{ uri: cover }} style={styles.img} resizeMode="cover" />
      ) : (
        <View style={[styles.img, styles.fallback]}>
          <Text style={styles.fallbackIcon}>{getEventTypeIcon(a.type || ev.type)}</Text>
          <Text style={styles.fallbackText}>{getEventTypeLabel(a.type || ev.type)}</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{a.title}</Text>
        <Text style={styles.meta} numberOfLines={1}>
          {metaText}
        </Text>
      </View>

      {/* Star en overlay en haut à droite */}
      <View style={styles.star}>
        <FavoriteStar active={fav} onToggle={toggle} />
      </View>
    </Pressable>
  );
}

export default React.memo(EventCard);

const styles = StyleSheet.create({
  card:{
    borderWidth: 2, borderColor:'#000', borderRadius: 16, backgroundColor:'#FFF', overflow:'hidden'
  },
  img:{ width:'100%', height:160 },
  info:{ paddingHorizontal:12, paddingVertical:10, gap:4 },
  title:{ fontWeight:'900' },
  meta:{ fontWeight:'700', color:'#333', fontSize:12 },
  star:{ position:'absolute', top:8, right:8 },
  fallback: {
    backgroundColor: tokens.color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  fallbackIcon: {
    fontSize: 32
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
    textAlign: 'center'
  }
});
