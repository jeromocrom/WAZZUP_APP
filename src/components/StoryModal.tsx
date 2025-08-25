import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import type { WazzupEvent } from '@/types';
import { tokens } from '@/theme/tokens';

export default function StoryModal({ visible, data, index=0, onClose }:{ visible:boolean; data: WazzupEvent[]; index?: number; onClose: ()=>void }){
  const [i, setI] = useState(index);
  const bar = useRef(new Animated.Value(0)).current;

  useEffect(() => { if (visible) setI(index); }, [visible, index]);

  useEffect(() => {
    if (!visible) return;
    bar.setValue(0);
    const anim = Animated.timing(bar, { toValue: 1, duration: 3000, useNativeDriver: false });
    anim.start(({ finished }) => { if (finished) next(); });
    return () => anim.stop();
  }, [i, visible]);

  function next(){
    if (i < data.length-1) setI(i+1);
    else onClose();
  }
  function prev(){
    if (i > 0) setI(i-1);
  }

  const width = bar.interpolate({ inputRange:[0,1], outputRange:['0%','100%'] });
  const ev = data[i] ?? data[0];

  if (!visible || !ev) return null;

  return (
    <Modal visible={visible} transparent onRequestClose={onClose} animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.progress}><Animated.View style={[styles.fill, { width }]} /></View>
        <Pressable style={styles.left} onPress={prev} />
        <Pressable style={styles.right} onPress={next} />
        <View style={styles.card}>
          <Text style={styles.title} numberOfLines={2}>{ev.title}</Text>
          <Text style={styles.sub}>{ev.venue} • {ev.city}</Text>
          <View style={{ height: 8 }} />
          <Pressable style={styles.cta}><Text style={{ fontWeight:'900' }}>Découvrir</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop:{ flex:1, backgroundColor:'#000000EE', justifyContent:'center', padding:16 },
  progress:{ position:'absolute', top:48, left:16, right:16, height:4, backgroundColor:'#999', borderRadius:999 },
  fill:{ height:'100%', backgroundColor: tokens.color.primary, borderRadius:999 },
  left:{ position:'absolute', left:0, top:0, bottom:0, width:'40%' },
  right:{ position:'absolute', right:0, top:0, bottom:0, width:'60%' },
  card:{ backgroundColor:'#FFF', borderRadius:20, padding:16, borderWidth:2, borderColor:'#000' },
  title:{ fontWeight:'900', fontSize:20 },
  sub:{ color:'#555', marginTop:2 },
  cta:{ backgroundColor: tokens.color.primary, paddingVertical:10, borderRadius:12, alignItems:'center', borderWidth:1, borderColor:'#000', marginTop:8 }
});