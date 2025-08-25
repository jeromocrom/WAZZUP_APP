import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import type { WazzupEvent } from '@/types';
import FavoriteStar from '@/components/FavoriteStar';
import { adaptEvent } from '@/utils/eventAdapter';

export default function EventCard({
  ev,
  onPress,
  onToggleFavorite
}: {
  ev: WazzupEvent | any;
  onPress?: (ev: any)=>void;
  onToggleFavorite?: (id: string, value: boolean)=>void;
}){
  const a = useMemo(()=> adaptEvent(ev), [ev]);
  const [fav, setFav] = useState<boolean>(!!a.isFavorite);
  const cover = a.cover || (a.photos && a.photos[0]);

  function toggle(){
    const nv = !fav;
    setFav(nv);
    onToggleFavorite?.(a.id, nv);
  }

  return (
    <Pressable onPress={()=> onPress?.(ev)} style={styles.card}>
      {cover ? (
        <Image source={{ uri: cover }} style={styles.img} resizeMode="cover" />
      ) : (
        <View style={[styles.img, { alignItems:'center', justifyContent:'center' }]}><Text>🎉</Text></View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{a.title}</Text>
        <Text style={styles.meta} numberOfLines={1}>
          {a.venue ? a.venue : ''}{a.city ? (a.venue ? ' • ' : '') + a.city : ''}
        </Text>
      </View>

      {/* Star en overlay en haut à droite */}
      <View style={styles.star}>
        <FavoriteStar active={fav} onToggle={toggle} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card:{
    borderWidth: 2, borderColor:'#000', borderRadius: 16, backgroundColor:'#FFF', overflow:'hidden'
  },
  img:{ width:'100%', height:160 },
  info:{ paddingHorizontal:12, paddingVertical:10, gap:4 },
  title:{ fontWeight:'900' },
  meta:{ fontWeight:'700', color:'#333', fontSize:12 },
  star:{ position:'absolute', top:8, right:8 }
});
