import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FavoritesScreen(){
  return (
    <View style={styles.wrap}>
      <Text style={styles.txt}>Favoris (placeholder)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:{ flex:1, alignItems:'center', justifyContent:'center' },
  txt:{ fontWeight:'900' }
});
