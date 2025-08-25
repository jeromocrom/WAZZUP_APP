import React, { useMemo, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import events from '@/events.json';
import { WazzupEvent, EventType } from '@/types';
import CategoryTabs from '@/components/CategoryTabs';
import EventCard from '@/components/EventCard';
import EventDetailsSheet from '@/components/EventDetailsSheet';

export default function ListScreen(){
  const [active, setActive] = useState<EventType | null>(null);
  const [openEvent, setOpenEvent] = useState<WazzupEvent | null>(null);
  const data = events as WazzupEvent[];
  const filtered = useMemo(()=> active? data.filter(d => d.type===active): data, [active]);

  const headerH = useHeaderHeight?.() ?? 0;
  const tabH = useBottomTabBarHeight?.() ?? 0;

  return (
    <View style={{ flex:1 }}>
      <CategoryTabs topOffset={headerH} active={active} onChange={setActive} />
      <FlatList
        contentContainerStyle={{ paddingTop: headerH + 120, paddingHorizontal:12, paddingBottom: 40 + tabH, gap:16 }}
        data={filtered}
        keyExtractor={i=>i.id}
        renderItem={({item}) => <EventCard ev={item} onPress={setOpenEvent} />}
      />
      <EventDetailsSheet visible={!!openEvent} event={openEvent} onClose={()=> setOpenEvent(null)} />
    </View>
  );
}