import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGlobalModal } from '@/context/GlobalModalContext';

export default function SearchModal({ navigation }: any){
  const insets = useSafeAreaInsets();
  const { open, close } = useGlobalModal();
  const [q, setQ] = useState('');
  const [focused, setFocused] = useState(false);
  const recent = ['techno ce soir', 'concert <20€', 'after montpellier', 'dj set bruxelles'];

  useEffect(() => {
    open();
    return () => close();
  }, []);

  function onSubmit(){
    close();
    navigation.goBack();
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }]} pointerEvents="auto">
      <View style={[styles.row]}>
        <Pressable onPress={()=> { close(); navigation.goBack(); }} style={styles.close}><Text style={{ fontWeight:'900' }}>✕</Text></Pressable>

        {/* Wrapper avec halo quand focus */}
        <View style={[styles.inputWrap, focused && styles.inputWrapFocused]}>
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Recherche"
            placeholderTextColor="#666"
            autoFocus
            returnKeyType="search"
            onSubmitEditing={onSubmit}
            onFocus={()=> setFocused(true)}
            onBlur={()=> setFocused(false)}
            style={styles.input}
          />
        </View>
      </View>

      {/* Pas de CategoryTabs ici pour éviter tout chevauchement */}

      <View style={{ height: 16 }} />
      <Text style={styles.section}>Recherches récentes</Text>
      <FlatList
        data={recent}
        keyExtractor={(i)=>i}
        renderItem={({ item }) => (
          <Pressable onPress={()=> { setQ(item); onSubmit(); }} style={styles.recent}>
            <Text style={{ fontWeight:'700' }}>⌕</Text>
            <Text style={{ marginLeft:8 }}>{item}</Text>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root:{
    position:'absolute', left:0, right:0, top:0, bottom:0,
    backgroundColor:'#FFF', zIndex: 9999, elevation: 12,
    paddingHorizontal: 12
  },
  row:{ flexDirection:'row', alignItems:'center', gap:8 },
  close:{ width:38, height:38, borderRadius:12, borderWidth:1, borderColor:'#000', alignItems:'center', justifyContent:'center', backgroundColor:'#FFF' },

  // Halo jaune WAZZUP au focus
  inputWrap:{
    flex:1,
    borderRadius:12, borderWidth:1, borderColor:'#000',
    backgroundColor:'#FFF',
  },
  inputWrapFocused:{
    shadowColor:'#FFD300',
    shadowOpacity:0.8,
    shadowRadius:12,
    shadowOffset:{ width:0, height:0 },
    elevation:8,                  // Android
    borderColor:'#FFD300',
  },
  input:{
    height:44, borderRadius:12, paddingHorizontal:12, fontWeight:'700'
  },

  section:{ fontWeight:'900', fontSize:16, paddingHorizontal:0 },
  recent:{ flexDirection:'row', alignItems:'center', backgroundColor:'#FFF', borderRadius:12, borderWidth:1, borderColor:'#000', padding:12 }
});
