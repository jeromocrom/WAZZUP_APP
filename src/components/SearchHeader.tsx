import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { EventType } from '@/types';

type QuickTab = { key: EventType | 'all'; label: string };

type Props = {
  topOffset?: number;
  placeholder?: string;
  onPressSearch?: ()=>void;
  onPressFilters?: ()=>void;
  onMeasuredHeight?: (h:number)=>void;
  quickTabs?: QuickTab[];
  activeType?: EventType | null;
  onChangeType?: (t: EventType | null)=>void;
};

const DEFAULT_TABS: QuickTab[] = [
  { key:'all', label:'Tous' },
  { key:'soiree_club', label:'Soirées' },
  { key:'concert', label:'Concerts' },
  { key:'dj_set', label:'DJ' },
  { key:'festival', label:'Festival' },
];

function SearchHeader({
  topOffset=0,
  placeholder='Recherche',
  onPressSearch,
  onPressFilters,
  onMeasuredHeight,
  quickTabs = DEFAULT_TABS,
  activeType = null,
  onChangeType
}: Props){
  const insets = useSafeAreaInsets();
  return (
    <View
      onLayout={e=> onMeasuredHeight?.(e.nativeEvent.layout.height)}
      style={[styles.wrap, { paddingTop: (topOffset || insets.top) + 4 }]}
    >
      {/* Barre de recherche + bouton Filtres */}
      <View style={styles.row}>
        <Pressable onPress={onPressSearch} style={styles.searchFake} accessibilityRole="button">
          <Text style={{ color:'#222', fontWeight:'700' }}>{placeholder}</Text>
        </Pressable>
        <Pressable onPress={onPressFilters} style={styles.filterBtn} accessibilityRole="button">
          <Text style={{ fontWeight:'900' }}>Filtres</Text>
        </Pressable>
      </View>

      {/* Filtres rapides inline (chips) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
        {quickTabs.map(tab => {
          const active = (tab.key === 'all' && activeType===null) || tab.key === activeType;
          return (
            <Pressable
              key={String(tab.key)}
              onPress={()=> onChangeType?.(tab.key==='all' ? null : tab.key as EventType)}
              style={[styles.chip, active && styles.chipActive]}
              accessibilityRole="button"
            >
              <Text style={[styles.chipTxt, active && styles.chipTxtActive]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:{
    position:'absolute', left:0, right:0, top:0,
    // Fond transparent demandé
    backgroundColor:'transparent',
    paddingHorizontal:12,
    zIndex: 100, elevation: 100,
  },
  row:{ flexDirection:'row', alignItems:'center', gap:8 },
  searchFake:{ flex:1, height:44, borderRadius:12, borderWidth:1.5, borderColor:'#000', backgroundColor:'#FFF', justifyContent:'center', paddingHorizontal:12 },
  filterBtn:{ height:44, paddingHorizontal:12, borderRadius:12, borderWidth:1.5, borderColor:'#000', alignItems:'center', justifyContent:'center', backgroundColor:'#FFD300' },
  tabsRow:{ gap:8, paddingTop:8 },
  chip:{ paddingHorizontal:12, paddingVertical:8, borderRadius:999, borderWidth:1.5, borderColor:'#000', backgroundColor:'#FFF' },
  chipActive:{ backgroundColor:'#FFD300' },
  chipTxt:{ fontWeight:'900', color:'#000' },
  chipTxtActive:{}
});

export default React.memo(SearchHeader);
