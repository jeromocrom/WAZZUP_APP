import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HypePillProps {
  score: number;
  compact?: boolean;
}

function HypePill({ score, compact = false }: HypePillProps) {
  const lvl = useMemo(() => {
    if (score > 200) return 'very';
    if (score > 120) return 'high';
    if (score > 60) return 'mid';
    return 'low';
  }, [score]);

  return (
    <View style={[styles.pill, styles[lvl]]}>
      <Text style={styles.txt}>🔥 {score}</Text>
      {!compact && <Text style={styles.sub}>Engouement</Text>}
    </View>
  );
}

export default React.memo(HypePill);

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
