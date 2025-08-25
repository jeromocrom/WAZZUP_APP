import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useOverlayOffsets } from '@/utils/overlay';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import events from '@/events.json';
import type { WazzupEvent, EventType } from '@/types';
import SearchHeader from '@/components/SearchHeader';
import EventDetailsSheet from '@/components/EventDetailsSheet';
import FilterSheet, { Filters } from '@/components/FilterSheet';
import CardCarousel from '@/components/CardCarousel';
import StoryModal from '@/components/StoryModal';
import WorldMapWeb from '@/components/WorldMapWeb';
import { navigateToSearchModal } from '@/navigation/searchNav';

export default function MapScreen({ navigation }: any){
  const { top } = useOverlayOffsets();
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState<EventType | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<WazzupEvent | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({ priceMax: 50, distanceKm: null, when: 'any' });
  const [showFilters, setShowFilters] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);

  const [headerH, setHeaderH] = useState(0);

  const all = events as WazzupEvent[];
  const data = useMemo(()=> {
    let base = active? all.filter(d => d.type===active): all;
    if (typeof filters.priceMax === 'number') base = base.filter(d => (d.priceFrom ?? 0) <= filters.priceMax!);
    return base;
  }, [all, active, filters]);

  // Place le carousel plus BAS (près du bord), tout en évitant le bouton Home
  const carouselBottom = Math.max(8, insets.bottom + 8);

  return (
    <View style={{ flex:1 }}>
      <SearchHeader
        topOffset={top}
        placeholder="Recherche"
        activeType={active}
        onChangeType={setActive}
        onPressSearch={()=> navigateToSearchModal(navigation)}
        onPressFilters={()=> setShowFilters(true)}
        onMeasuredHeight={setHeaderH}
      />

      <WorldMapWeb
        events={data}
        headerOffset={top + headerH}
        onMarkerPress={(id)=> {
          const ev = data.find(e => e.id === id) || all.find(e => e.id === id);
          if (ev) setSelectedEvent(ev);
        }}
      />

      <CardCarousel
        data={data}
        selectedId={selectedId}
        onFocus={(id)=> setSelectedId(id)}
        onPress={(ev)=> setSelectedEvent(ev)}
        bottomOffset={carouselBottom}
        compact
      />

      <EventDetailsSheet
        visible={!!selectedEvent}
        event={selectedEvent}
        onClose={()=> setSelectedEvent(null)}
        onOpenStory={(i, stories)=> { setStoryIndex(i); setStoryOpen(true); }}
      />

      <FilterSheet
        visible={showFilters}
        value={filters}
        onChange={setFilters}
        onClose={()=> setShowFilters(false)}
        onApply={()=> setShowFilters(false)}
      />

      <StoryModal
        visible={storyOpen}
        data={data}
        index={storyIndex}
        onClose={()=> setStoryOpen(false)}
      />

      {/* Désactive la zone cliquable sous le header transparent */}
      <View pointerEvents="none" style={{ position:'absolute', left:0, right:0, top:0, height: top + headerH }} />
    </View>
  );
}
