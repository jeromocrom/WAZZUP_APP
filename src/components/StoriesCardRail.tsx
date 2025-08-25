import React, { useRef } from 'react';
import { View, Text, FlatList, Pressable, Image, StyleSheet, LayoutChangeEvent } from 'react-native';

type StoryItem = { id: string; title: string; cover?: string; by?: string };

export default function StoriesCardRail({
  stories,
  onOpenStory,
  onMeasuredHeight
}: {
  stories: StoryItem[];
  onOpenStory?: (index:number)=>void;
  onMeasuredHeight?: (h:number)=>void;
}){
  const onLayout = (e: LayoutChangeEvent) => {
    onMeasuredHeight?.(e.nativeEvent.layout.height);
  };

  return (
    <View style={styles.wrap} onLayout={onLayout} pointerEvents="box-none">
      <View style={styles.cardShell}>
        <FlatList
          horizontal
          data={stories}
          keyExtractor={(i)=> i.id}
          renderItem={({ item, index }) => (
            <Pressable onPress={()=> onOpenStory?.(index)} style={styles.card}>
              {item.cover ? (
                <Image source={{ uri: item.cover }} style={styles.img} resizeMode="cover" />
              ) : (
                <View style={[styles.img, { alignItems:'center', justifyContent:'center' }]}><Text>🎬</Text></View>
              )}
              <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>{item.title || 'Story'}</Text>
                {!!item.by && <Text style={styles.by} numberOfLines={1}>{item.by}</Text>}
              </View>
            </Pressable>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, gap: 10 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:{ paddingHorizontal: 12 },
  cardShell:{
    borderWidth: 2, borderColor:'#000', borderRadius: 16, backgroundColor:'#FFF',
    paddingVertical: 10
  },
  card:{
    width: 160, height: 140, borderRadius: 14, borderWidth: 1.5, borderColor:'#000', overflow:'hidden', backgroundColor:'#FFF'
  },
  img:{ width:'100%', height:'65%' },
  info:{ flex:1, paddingHorizontal:8, paddingVertical:6 },
  title:{ fontWeight:'900' },
  by:{ fontWeight:'700', color:'#333', fontSize:12 }
});
