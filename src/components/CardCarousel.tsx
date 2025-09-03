import React, { useMemo, useRef, useCallback } from 'react';
import { View, Text, FlatList, Pressable, Image, StyleSheet, Dimensions, ListRenderItem } from 'react-native';
import type { WazzupEvent } from '@/types';

const { width: SCREEN_W } = Dimensions.get('window');

type Props = {
  data: WazzupEvent[];
  selectedId?: string | null;
  onFocus?: (id: string) => void;
  onPress?: (ev: WazzupEvent) => void;
  bottomOffset?: number;
  compact?: boolean;
};

function CardCarousel({ data, selectedId, onFocus, onPress, bottomOffset = 24, compact = false }: Props) {
  const CARD_W = useMemo(() => compact ? Math.min(240, SCREEN_W * 0.6) : Math.min(300, SCREEN_W * 0.75), [compact]);
  const CARD_H = useMemo(() => compact ? 140 : 180, [compact]);

  const renderItem: ListRenderItem<WazzupEvent> = useCallback(({ item }) => {
    const cover = (item as any).cover || (item as any).photo || (item as any).photos?.[0];
    return (
      <Pressable onPress={() => onPress?.(item)} style={[styles.card, { width: CARD_W, height: CARD_H }]}>
        {cover ? (
          <Image source={{ uri: cover }} style={styles.img} resizeMode="cover" />
        ) : (
          <View style={[styles.img, { alignItems:'center', justifyContent:'center' }]}><Text>🎉</Text></View>
        )}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.meta} numberOfLines={1}>{(item as any).venue ?? ''} {(item as any).city ? '• '+(item as any).city : ''}</Text>
        </View>
      </Pressable>
    );
  }, [CARD_W, CARD_H, onPress]);

  const keyExtractor = useCallback((item: WazzupEvent) => item.id, []);

  return (
    <View style={[styles.wrap, { bottom: bottomOffset }]} pointerEvents="box-none">
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, gap: 12 }}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
      />
    </View>
  );
}

export default React.memo(CardCarousel);

const styles = StyleSheet.create({
  wrap:{
    position:'absolute', left:0, right:0,
  },
  card:{
    borderWidth: 2, borderColor:'#000', borderRadius: 16, backgroundColor:'#FFF', overflow:'hidden'
  },
  img:{ width:'100%', height:'65%' },
  info:{ flex:1, paddingHorizontal:10, paddingVertical:6, gap:2 },
  title:{ fontWeight:'900' },
  meta:{ fontWeight:'700', color:'#333', fontSize:12 }
});
