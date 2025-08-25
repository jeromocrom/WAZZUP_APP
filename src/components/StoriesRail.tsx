import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { tokens } from '@/theme/tokens';
import type { WazzupEvent } from '@/types';

export default function StoriesRail({ data, onOpen }:{ data: WazzupEvent[]; onOpen: (index:number)=>void }){
  if (!data?.length) return null;
  return (
    <View style={styles.wrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal:12, gap:12 }}>
        {data.map((ev, i) => (
          <Pressable key={ev.id} onPress={()=> onOpen(i)} style={styles.bubble}>
            <Text style={styles.txt} numberOfLines={2}>{ev.title}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const size = 68;
const styles = StyleSheet.create({
  wrap:{ position:'absolute', top:124, left:0, right:0, zIndex:12 },
  bubble:{
    width: size, height: size, borderRadius: 18, backgroundColor: tokens.color.primary,
    borderWidth: 2, borderColor: '#000', padding:6, justifyContent:'center'
  },
  txt:{ fontWeight:'900', fontSize:10, textAlign:'center' }
});