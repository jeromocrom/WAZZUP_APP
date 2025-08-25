import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HypePill({ score, compact=false }:{ score: number; compact?: boolean; }){
  const lvl = score > 200 ? 'very' : score > 120 ? 'high' : score > 60 ? 'mid' : 'low';
  return (
    <View style={[styles.pill, styles[lvl]]}>
      <Text style={styles.txt}>🔥 {score}</Text>
      {!compact && <Text style={styles.sub}>Engouement</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  pill:{
    flexDirection:'row', alignItems:'center', gap:8,
    paddingHorizontal:10, paddingVertical:6, borderRadius:999,
    borderWidth:1, borderColor:'#000', backgroundColor:'#FFF'
  },
  txt:{ fontWeight:'900' },
  sub:{ fontWeight:'800', color:'#333' },
  low:{ backgroundColor:'#FFFFFF' },
  mid:{ backgroundColor:'#FFF3B0' },
  high:{ backgroundColor:'#FFD300' },
  very:{ backgroundColor:'#FFB300' },
});
