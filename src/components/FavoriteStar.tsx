import React, { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface FavoriteStarProps {
  active: boolean;
  onToggle?: () => void;
  size?: number;
}

function FavoriteStar({
  active,
  onToggle,
  size = 20
}: FavoriteStarProps) {
  const handleToggle = useCallback(() => {
    onToggle?.();
  }, [onToggle]);

  return (
    <Pressable onPress={handleToggle} hitSlop={10} style={[styles.wrap, active && styles.activeWrap]}>
      <Feather name="star" size={size} color="#000" />
    </Pressable>
  );
}

export default React.memo(FavoriteStar);

const styles = StyleSheet.create({
  wrap:{
    width:34, height:34, borderRadius:12, borderWidth:1.5, borderColor:'#000',
    alignItems:'center', justifyContent:'center', backgroundColor:'#FFF'
  },
  activeWrap:{
    backgroundColor:'#FFD300'
  }
});
