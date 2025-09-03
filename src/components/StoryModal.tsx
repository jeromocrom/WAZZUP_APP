import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Animated, ImageBackground } from 'react-native';
import type { WazzupEvent } from '@/types';
import { tokens } from '@/theme/tokens';
import { adaptEvent } from '@/utils/eventAdapter';

export default function StoryModal({ visible, data, index=0, onClose }:{ visible:boolean; data: WazzupEvent[]; index?: number; onClose: ()=>void }){
  const [i, setI] = useState(index);
  const [storyIndex, setStoryIndex] = useState(0);
  const bar = useRef(new Animated.Value(0)).current;

  useEffect(() => { 
    if (visible) {
      setI(index);
      setStoryIndex(0);
    }
  }, [visible, index]);

  const ev = data[i] ?? data[0];
  const adaptedEvent = ev ? adaptEvent(ev) : null;
  const stories = adaptedEvent?.stories || [];
  const currentStory = stories[storyIndex];

  useEffect(() => {
    if (!visible || !currentStory) return;
    bar.setValue(0);
    const anim = Animated.timing(bar, { toValue: 1, duration: 4000, useNativeDriver: false });
    anim.start(({ finished }) => { 
      if (finished) {
        if (storyIndex < stories.length - 1) {
          setStoryIndex(storyIndex + 1);
        } else {
          next();
        }
      }
    });
    return () => anim.stop();
  }, [i, storyIndex, visible, currentStory]);

  function next(){
    if (i < data.length-1) {
      setI(i+1);
      setStoryIndex(0);
    } else {
      onClose();
    }
  }
  function prev(){
    if (storyIndex > 0) {
      setStoryIndex(storyIndex - 1);
    } else if (i > 0) {
      setI(i-1);
      const prevEvent = data[i-1];
      const prevAdapted = adaptEvent(prevEvent);
      setStoryIndex(Math.max(0, (prevAdapted?.stories || []).length - 1));
    }
  }

  const width = bar.interpolate({ inputRange:[0,1], outputRange:['0%','100%'] });

  if (!visible || !ev || !currentStory) return null;

  return (
    <Modal visible={visible} transparent onRequestClose={onClose} animationType="fade" statusBarTranslucent>
      <ImageBackground 
        source={{ uri: currentStory }} 
        style={styles.backdrop}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        
        {/* Progress bars for multiple stories */}
        <View style={styles.progressContainer}>
          {stories.map((_, idx) => (
            <View key={idx} style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill, 
                  { 
                    width: idx === storyIndex ? width : idx < storyIndex ? '100%' : '0%'
                  }
                ]} 
              />
            </View>
          ))}
        </View>
        
        <Pressable style={styles.left} onPress={prev} />
        <Pressable style={styles.right} onPress={next} />
        
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>{ev.title}</Text>
          <Text style={styles.sub}>{ev.venue} • {ev.city}</Text>
          <Text style={styles.story}>📍 Histoire {storyIndex + 1} / {stories.length}</Text>
          <View style={{ height: 16 }} />
          <Pressable style={styles.cta} onPress={onClose}>
            <Text style={styles.ctaText}>Découvrir l'événement</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1 },
  overlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.4)' 
  },
  progressContainer: { 
    position: 'absolute', 
    top: 48, 
    left: 16, 
    right: 16, 
    flexDirection: 'row', 
    gap: 4 
  },
  progressBar: { 
    flex: 1, 
    height: 3, 
    backgroundColor: 'rgba(255,255,255,0.3)', 
    borderRadius: 999 
  },
  progressFill: { 
    height: '100%', 
    backgroundColor: tokens.color.primary, 
    borderRadius: 999 
  },
  left: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '40%' },
  right: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '60%' },
  content: { 
    position: 'absolute', 
    bottom: 60, 
    left: 16, 
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.95)', 
    borderRadius: 20, 
    padding: 20, 
    borderWidth: 2, 
    borderColor: 'rgba(255,255,255,0.8)' 
  },
  title: { fontWeight: '900', fontSize: 22, color: '#000' },
  sub: { color: '#666', marginTop: 4, fontSize: 14 },
  story: { 
    color: '#888', 
    fontSize: 12, 
    fontWeight: '600', 
    marginTop: 8 
  },
  cta: { 
    backgroundColor: tokens.color.primary, 
    paddingVertical: 12, 
    borderRadius: 16, 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#000'
  },
  ctaText: { 
    fontWeight: '900', 
    fontSize: 16, 
    color: '#000' 
  }
});