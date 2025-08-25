import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import Badge from '../../components/Badge';
import events from '../../events.json';

export default function UserProfileScreen({ route, navigation }: any){
  const userId = route?.params?.id || 'artist_1';
  const myEvents = useMemo(()=> {
    const data: any[] = (events as any);
    return data.filter(ev => (ev.artists || []).some((a:any)=> (a.id||a.slug) === userId));
  }, [userId]);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 24, backgroundColor:'#FFF' }}>
      <View style={styles.header}>
        <Image source={{ uri: 'https://picsum.photos/200' }} style={styles.avatar} />
        <View style={{ flex:1 }}>
          <Text style={styles.name}>Artiste Premium</Text>
          <View style={{ flexDirection:'row', gap:6, marginTop:4 }}>
            <Badge label="PREMIUM" tone="premium" />
            <Badge label="Vérifié" tone="verified" />
          </View>
        </View>
        <Pressable style={styles.cta}><Text style={styles.ctaTxt}>Contacter</Text></Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.h2}>Bio</Text>
        <Text style={styles.p}>DJ & producteur. Deep house / Techno. Basé à Bruxelles.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.h2}>Évènements à venir</Text>
        {myEvents.map((ev:any)=> (
          <Pressable key={ev.id} style={styles.evRow} onPress={()=> navigation.navigate('Map') }>
            <Text style={styles.evTitle}>{ev.title || ev.name}</Text>
            <Text style={styles.evMeta}>{ev.city || ''}</Text>
          </Pressable>
        ))}
        {!myEvents.length && <Text style={styles.p}>Aucun évènement à venir.</Text>}
      </View>

      <View style={styles.card}>
        <Text style={styles.h2}>Liens</Text>
        <View style={{ flexDirection:'row', gap:8 }}>
          <Pressable style={styles.outBtn}><Text style={styles.btnTxt}>Instagram</Text></Pressable>
          <Pressable style={styles.outBtn}><Text style={styles.btnTxt}>Spotify</Text></Pressable>
          <Pressable style={styles.outBtn}><Text style={styles.btnTxt}>Site</Text></Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header:{ flexDirection:'row', alignItems:'center', gap:12, padding:12, backgroundColor:'#FFF' },
  avatar:{ width:64, height:64, borderRadius:999, borderWidth:1.5, borderColor:'#000', backgroundColor:'#FFD300' },
  name:{ fontWeight:'900', fontSize:18 },
  cta:{ borderWidth:1.5, borderColor:'#000', borderRadius:12, backgroundColor:'#FFF', paddingHorizontal:12, paddingVertical:8 },
  ctaTxt:{ fontWeight:'900' },
  card:{ borderWidth:2, borderColor:'#000', borderRadius:16, backgroundColor:'#FFF', padding:12, marginHorizontal:12, marginVertical:6, gap:6 },
  h2:{ fontWeight:'900', fontSize:16 },
  p:{ fontWeight:'700', color:'#222' },
  outBtn:{ borderWidth:1.5, borderColor:'#000', borderRadius:12, paddingHorizontal:12, paddingVertical:8, backgroundColor:'#FFF' },
  evRow:{ paddingVertical:8, borderTopWidth:1, borderColor:'#000', marginTop:6 },
  evTitle:{ fontWeight:'900' },
  evMeta:{ fontWeight:'700', color:'#333' }
});
