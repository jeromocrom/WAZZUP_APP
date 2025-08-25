import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Badge from '../../components/Badge';

export default function HomeProfileScreen({ navigation }: any){
  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.h1}>Mon profil</Text>

      <View style={styles.card}>
        <Text style={styles.h2}>Compte</Text>
        <Text style={styles.p}>Gère tes informations, préférences et sécurité.</Text>
        <View style={styles.row}>
          <Pressable style={styles.btn}><Text style={styles.btnTxt}>Modifier</Text></Pressable>
          <Pressable style={styles.btn}><Text style={styles.btnTxt}>Sécurité</Text></Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.h2}>Abonnements</Text>
        <View style={{ flexDirection:'row', gap:8, alignItems:'center' }}>
          <Badge label="Gratuit" />
          <Badge label="Premium" tone="premium" />
        </View>
        <Text style={[styles.p, { marginTop:6 }]}>Passe en Premium pour débloquer les profils Artiste (mise en avant, liens, etc.).</Text>
        <View style={styles.row}>
          <Pressable style={[styles.btn, styles.btnPrimary]} onPress={()=> navigation.navigate('UserProfile')}><Text style={styles.btnPrimaryTxt}>Voir un profil Premium</Text></Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.h2}>Organisation</Text>
        <Text style={styles.p}>Tu gères des évènements ? Crée ton profil Organisateur.</Text>
        <View style={styles.row}>
          <Pressable style={styles.btn}><Text style={styles.btnTxt}>Créer un profil</Text></Pressable>
          <Pressable style={styles.btn} onPress={()=> navigation.navigate('OrganizerProfile')}><Text style={styles.btnTxt}>Voir un exemple</Text></Pressable>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap:{ padding:12, gap:12, backgroundColor:'#FFF' },
  h1:{ fontWeight:'900', fontSize:22 },
  h2:{ fontWeight:'900', fontSize:16, marginBottom:6 },
  p:{ fontWeight:'700', color:'#222' },
  card:{ borderWidth:2, borderColor:'#000', borderRadius:16, backgroundColor:'#FFF', padding:12, gap:6 },
  row:{ flexDirection:'row', gap:8, marginTop:6 },
  btn:{ borderWidth:1.5, borderColor:'#000', borderRadius:12, paddingHorizontal:12, paddingVertical:10, backgroundColor:'#FFF' },
  btnTxt:{ fontWeight:'900' },
  btnPrimary:{ backgroundColor:'#FFD300', borderColor:'#000' },
  btnPrimaryTxt:{ fontWeight:'900', color:'#000' }
});
