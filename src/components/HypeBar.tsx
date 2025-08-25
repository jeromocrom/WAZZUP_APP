import React from 'react';
import { View, StyleSheet } from 'react-native';
import { tokens } from '@/theme/tokens';

export default function HypeBar({ value=0 }:{ value?: number }){
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View style={styles.wrap}>
      <View style={[styles.fill, { width: `${pct*100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:{ height:6, backgroundColor:'#EFEFEF', borderRadius:999, overflow:'hidden' },
  fill:{ height:'100%', backgroundColor: tokens.color.primary }
});