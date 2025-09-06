import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tokens } from '@/theme/tokens';

interface FloatingAddButtonProps {
  onPress: () => void;
}

export default function FloatingAddButton({ onPress }: FloatingAddButtonProps) {
  const insets = useSafeAreaInsets();
  
  // Position above tab bar with safe area consideration
  const bottomOffset = Math.max(16, insets.bottom + 70); // 70 accounts for tab bar height
  
  return (
    <View style={[styles.container, { bottom: bottomOffset }]}>
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
        onPress={onPress}
      >
        <Text style={styles.plusIcon}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
    elevation: 1000, // Android elevation
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: tokens.color.primary,
    borderWidth: 2,
    borderColor: tokens.color.black,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
  plusIcon: {
    fontSize: 24,
    fontWeight: '900',
    color: tokens.color.black,
    lineHeight: 24,
  },
});