import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen(){
  return (
    <View style={styles.wrap}>
      <Text style={styles.txt}>Profil (placeholder)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:{ flex:1, alignItems:'center', justifyContent:'center' },
  txt:{ fontWeight:'900' }
});
