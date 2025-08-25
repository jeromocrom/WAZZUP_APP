import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';

type Story = {
  id: string;
  title?: string;
  cover?: string;   // image URL
  by?: string;      // organisateur / club
};

type Props = {
  stories: Story[];
  onOpenStory?: (index: number, list: Story[]) => void;
};

export default function StoriesDeck({ stories, onOpenStory }: Props){
  const data = (stories && stories.length ? stories : DEMO).slice(0, 12);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 12 }}
      >
        {data.map((s, i) => (
          <Pressable key={s.id || String(i)} onPress={()=> onOpenStory?.(i, data)} style={styles.card}>
            <Image source={{ uri: s.cover || FALLBACK }} style={styles.cover} />
            <View style={styles.meta}>
              <Text style={styles.cardTitle} numberOfLines={1}>{s.title || 'Story'}</Text>
              {!!s.by && <Text style={styles.cardBy} numberOfLines={1}>{s.by}</Text>}
              <Text style={styles.cardCta}>Regarder ▶︎</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.separator} />
    </View>
  );
}

const FALLBACK = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop';

const DEMO: Story[] = [
  { id:'st1', title:'AFTER @ Hangar', by:'Wazzup', cover: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop' },
  { id:'st2', title:'Open Air', by:'Groove', cover: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=1200&auto=format&fit=crop' },
  { id:'st3', title:'Live Set', by:'Club 21', cover: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81a?q=80&w=1200&auto=format&fit=crop' },
  { id:'st4', title:'Techno Night', by:'Warehouse', cover: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop' },
];

const styles = StyleSheet.create({
  container:{
    backgroundColor:'rgba(255,255,255,0.98)',
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1, borderColor:'#000',
    shadowColor:'#000',
    shadowOpacity:0.15,
    shadowRadius:14,
    shadowOffset:{ width:0, height:6 },
    elevation:10,
  },
  title:{ fontWeight:'900', fontSize:16, paddingHorizontal:12, marginBottom:8 },
  card:{
    width: 240, height: 120, borderRadius: 16,
    overflow:'hidden', borderWidth:2, borderColor:'#000', backgroundColor:'#fff'
  },
  cover:{ position:'absolute', left:0, top:0, right:0, bottom:0 },
  meta:{
    position:'absolute', left:0, right:0, bottom:0,
    padding:10, backgroundColor:'rgba(0,0,0,0.25)'
  },
  cardTitle:{ fontWeight:'900', color:'#fff' },
  cardBy:{ fontWeight:'700', color:'#fff', opacity:0.9 },
  cardCta:{ fontWeight:'900', color:'#000', backgroundColor:'#FFD300', paddingHorizontal:10, paddingVertical:4, alignSelf:'flex-start', borderRadius:999, borderWidth:1, borderColor:'#000', marginTop:6 },
  separator:{ height:1, backgroundColor:'#000', opacity:0.12, marginTop:10 }
});
