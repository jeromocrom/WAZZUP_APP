import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/** Petit hint "Glisse pour actions" qui s'affiche une seule fois */
export default function SwipeHint({ onDone }:{ onDone: ()=>void }){
  const [visible, setVisible] = useState(false);

  useEffect(()=>{
    (async ()=>{
      try{
        const v = await AsyncStorage.getItem('wzp:hint:swipe:v1');
        if (!v){ setVisible(true); }
        else onDone();
      }catch{ onDone(); }
    })();
  }, []);

  if (!visible) return null;

  return (
    <Pressable onPress={async ()=>{ setVisible(false); await AsyncStorage.setItem('wzp:hint:swipe:v1', '1'); onDone(); }} style={styles.hint}>
      <Text style={styles.txt}>↔︎ Glisse une carte pour voir les actions</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hint:{
    position:'absolute', bottom:8, left:8, right:8,
    backgroundColor:'rgba(0,0,0,0.65)',
    borderRadius:12, padding:10
  },
  txt:{ color:'#FFF', fontWeight:'900', textAlign:'center' }
});