import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { tokens } from '@/theme/tokens';

type Props = { count: number };

export default function ClusterMarker({ count }: Props){
  return (
    <View style={styles.wrap} pointerEvents="none">
      <View style={styles.bubble}>
        <Text style={styles.text}>{count}</Text>
      </View>
    </View>
  );
}

const size = 44;
const styles = StyleSheet.create({
  wrap:{ alignItems:'center', justifyContent:'center' },
  bubble:{
    width: size, height: size, borderRadius: size/2,
    backgroundColor: tokens.color.primary, borderWidth:2, borderColor:'#000',
    alignItems:'center', justifyContent:'center',
    ...Platform.select({
      ios: { shadowColor:'#000', shadowOpacity:0.18, shadowRadius:6, shadowOffset:{width:0,height:3} },
      android: { elevation:4 }
    })
  },
  text:{ fontWeight:'900', color:'#000' }
});