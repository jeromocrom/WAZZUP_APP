import React, { useMemo, useState, useCallback } from 'react';
import { View, FlatList, ListRenderItem } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import events from '@/events.json';
import { WazzupEvent, EventType } from '@/types';
import CategoryTabs from '@/components/CategoryTabs';
import EventCard from '@/components/EventCard';
import EventDetailsSheet from '@/components/EventDetailsSheet';

// Optimize item height for better FlatList performance
const ITEM_HEIGHT = 200; // Approximate height of EventCard including gap

export default function ListScreen(){
  const [active, setActive] = useState<EventType | null>(null);
  const [openEvent, setOpenEvent] = useState<WazzupEvent | null>(null);
  const data = events as WazzupEvent[];
  const filtered = useMemo(()=> active? data.filter(d => d.type===active): data, [active]);

  const headerH = useHeaderHeight?.() ?? 0;
  const tabH = useBottomTabBarHeight?.() ?? 0;

  const handleEventPress = useCallback((event: WazzupEvent) => {
    setOpenEvent(event);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setOpenEvent(null);
  }, []);

  const renderItem: ListRenderItem<WazzupEvent> = useCallback(({ item }) => (
    <EventCard ev={item} onPress={handleEventPress} />
  ), [handleEventPress]);

  const keyExtractor = useCallback((item: WazzupEvent) => item.id, []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  const contentContainerStyle = useMemo(() => ({
    paddingTop: headerH + 120,
    paddingHorizontal: 12,
    paddingBottom: 40 + tabH,
    gap: 16
  }), [headerH, tabH]);

  return (
    <View style={{ flex:1 }}>
      <CategoryTabs topOffset={headerH} active={active} onChange={setActive} />
      <FlatList
        contentContainerStyle={contentContainerStyle}
        data={filtered}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
      />
      <EventDetailsSheet visible={!!openEvent} event={openEvent} onClose={handleCloseSheet} />
    </View>
  );
}