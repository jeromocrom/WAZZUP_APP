import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Badge({ label, tone='default' }:{ label:string; tone?:'default'|'premium'|'verified'|'live'|'trending' }){
  const style = [styles.badge];
  if (tone==='premium') style.push(styles.premium);
  if (tone==='verified') style.push(styles.verified);
  if (tone==='live') style.push(styles.live);
  if (tone==='trending') style.push(styles.trending);
  return (
    <View style={style}>
      <Text style={styles.txt}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge:{
    borderWidth:1.5, borderColor:'#000', borderRadius:999,
    paddingHorizontal:10, paddingVertical:4, backgroundColor:'#FFF'
  },
  txt:{ fontWeight:'900', color:'#000', fontSize:12 },
  premium:{ backgroundColor:'#FFD300' },
  verified:{ backgroundColor:'#E6FFEA' },
  live:{ backgroundColor:'#FFE6E6' },
  trending:{ backgroundColor:'#E6F3FF' }
});
