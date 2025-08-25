import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { useGlobalModal } from '@/context/GlobalModalContext';
import type { EventType } from '@/types';

type Props = {
  topOffset?: number;
  active: EventType | null;
  onChange: (v: EventType | null) => void;
};

const ITEMS: { key: EventType | null; label: string }[] = [
  { key: null, label: 'Tous' },
  { key: 'party' as any, label: 'Soirées' },
  { key: 'concert' as any, label: 'Concerts' },
  { key: 'dj_set' as any, label: 'DJ' },
  { key: 'after' as any, label: 'After' },
  { key: 'food_market' as any, label: 'Food' },
  { key: 'expo_art' as any, label: 'Expo' },
];

export default function CategoryTabs({ topOffset=0, active, onChange }: Props){
  const { isModalOpen } = useGlobalModal();

  // Auto-hide when a global modal is open (keeps layout stable: we keep the top spacer)
  const top = (Platform.OS === 'ios' ? 64 : 56) + topOffset;

  if (isModalOpen) {
    return <View style={{ position:'absolute', left:0, right:0, top, height: 0 }} pointerEvents="none" />;
  }

  return (
    <View style={[styles.wrap, { top }]} pointerEvents="auto">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
        {ITEMS.map(it => {
          const activeChip = (active ?? null) === it.key;
          return (
            <Pressable key={String(it.key)} onPress={()=> onChange(it.key)} style={[styles.chip, activeChip && styles.chipActive]}>
              <Text style={[styles.txt, activeChip && styles.txtActive]}>{it.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:{ position:'absolute', left:0, right:0, zIndex: 12 },
  content:{ paddingHorizontal: 12, gap: 8 },
  chip:{ backgroundColor:'#FFF', borderWidth:1, borderColor:'#000', paddingHorizontal:12, paddingVertical:8, borderRadius:999 },
  chipActive:{ backgroundColor:'#FFD300' },
  txt:{ fontWeight:'800' },
  txtActive:{}
});