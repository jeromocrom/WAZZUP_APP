import React, { useMemo, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useOverlayOffsets } from '@/utils/overlay';
import events from '@/events.json';
import { WazzupEvent, EventType } from '@/types';
import SearchHeader from '@/components/SearchHeader';
import EventCard from '@/components/EventCard';
import EventDetailsSheet from '@/components/EventDetailsSheet';
import FilterSheet, { Filters } from '@/components/FilterSheet';
import StoryModal from '@/components/StoryModal';
import FloatingAddButton from '@/components/FloatingAddButton';
import { navigateToSearchModal } from '@/navigation/searchNav';
import StoriesCardRail from '@/components/StoriesCardRail';

export default function ExplorerScreenV2({ navigation }: any){
  const { top, tabBarHeight } = useOverlayOffsets();
  const [active, setActive] = useState<EventType | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<WazzupEvent | null>(null);
  const [filters, setFilters] = useState<Filters>({ priceMax: 50, distanceKm: null, when: 'any' });
  const [showFilters, setShowFilters] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);

  const [headerH, setHeaderH] = useState(0);
  const [storiesH, setStoriesH] = useState(0);

  const dataAll = events as WazzupEvent[];
  const boosted = useMemo(()=> {
    const list = dataAll.filter(e => (e as any).isBoosted);
    return list.length ? list : dataAll.slice(0, 8);
  }, [dataAll]);

  const filtered = useMemo(()=> {
    let base = active? dataAll.filter(d => d.type===active): dataAll;
    if (typeof filters.priceMax === 'number') base = base.filter(d => (d.priceFrom ?? 0) <= filters.priceMax!);
    return base;
  }, [active, filters]);

  const handleCreateEvent = () => {
    // TODO: Navigate to event creation screen
    console.log('Create event pressed from Explorer');
  };

  const contentTop = top + headerH + (storiesH || 160) + 24; // Removed map height (120) from calculation

  return (
    <View style={{ flex:1 }}>

      {/* Header de recherche (transparent) */}
      <SearchHeader
        topOffset={top}
        placeholder="Recherche"
        activeType={active}
        onChangeType={setActive}
        onPressSearch={()=> navigateToSearchModal(navigation)}
        onPressFilters={()=> setShowFilters(true)}
        onMeasuredHeight={setHeaderH}
      />

      {/* Stories — look EventCard, toujours visible (overlay) */}
      <View pointerEvents="box-none" style={{ position:'absolute', left:0, right:0, top: top + headerH + 6, zIndex: 5, elevation: 5 }}>
        <StoriesCardRail
          stories={boosted.map(b => ({ id: b.id, title: b.title, cover: (b as any).cover || (b as any).photo, by: (b as any).organizer || (b as any).venue }))}
          onOpenStory={(i)=> { setStoryIndex(i); setStoryOpen(true); }}
          onMeasuredHeight={setStoriesH}
        />
      </View>

      {/* Liste — décalée sous header + stories */}
      <FlatList
        data={filtered}
        keyExtractor={i=>i.id}
        renderItem={({item}) => <EventCard ev={item} onPress={setSelectedEvent} />}
        contentContainerStyle={{ paddingTop: contentTop, paddingHorizontal:12, paddingBottom: 24 + tabBarHeight, gap:16 }}
        showsVerticalScrollIndicator={false}
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
        data={boosted}
        index={storyIndex}
        onClose={()=> setStoryOpen(false)}
      />
      
      {/* Floating add button */}
      <FloatingAddButton onPress={handleCreateEvent} />
    </View>
  );
}
