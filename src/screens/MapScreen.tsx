import React, { useMemo, useState, useCallback } from 'react';
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
  const [centerEventId, setCenterEventId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({ priceMax: 50, distanceKm: null, when: 'any' });
  const [showFilters, setShowFilters] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);

  const [headerH, setHeaderH] = useState(0);

  const all = useMemo(() => events as WazzupEvent[], []);
  
  // Optimize data filtering with better memoization
  const data = useMemo(() => {
    let base = active ? all.filter(d => d.type === active) : all;
    if (typeof filters.priceMax === 'number') {
      base = base.filter(d => (d.priceFrom ?? 0) <= filters.priceMax!);
    }
    return base;
  }, [all, active, filters.priceMax]);

  // Place le carousel plus BAS (près du bord), tout en évitant le bouton Home
  const carouselBottom = useMemo(() => Math.max(8, insets.bottom + 8), [insets.bottom]);

  // Callback optimizations
  const handleMarkerPress = useCallback((id: string) => {
    const ev = data.find(e => e.id === id) || all.find(e => e.id === id);
    if (ev) {
      setSelectedEvent(ev);
      setCenterEventId(id);
      // Reset centering after a short delay to allow for re-centering on same marker
      setTimeout(() => setCenterEventId(null), 100);
    }
  }, [data, all]);

  const handleSearchPress = useCallback(() => {
    navigateToSearchModal(navigation);
  }, [navigation]);

  const handleFiltersPress = useCallback(() => {
    setShowFilters(true);
  }, []);

  const handleCloseFilters = useCallback(() => {
    setShowFilters(false);
  }, []);

  const handleApplyFilters = useCallback(() => {
    setShowFilters(false);
  }, []);

  const handleCloseEvent = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const handleCarouselPress = useCallback((ev: WazzupEvent) => {
    setSelectedEvent(ev);
  }, []);

  const handleOpenStory = useCallback((i: number) => {
    setStoryIndex(i);
    setStoryOpen(true);
  }, []);

  const handleCloseStory = useCallback(() => {
    setStoryOpen(false);
  }, []);

  // Handle centering map on event
  const handleCenterMap = useCallback((eventId: string) => {
    setCenterEventId(eventId);
    // Reset centering after animation completes
    setTimeout(() => setCenterEventId(null), 1000);
  }, []);

  return (
    <View style={{ flex:1 }}>
      <SearchHeader
        topOffset={top}
        placeholder="Recherche"
        activeType={active}
        onChangeType={setActive}
        onPressSearch={handleSearchPress}
        onPressFilters={handleFiltersPress}
        onMeasuredHeight={setHeaderH}
      />

      <WorldMapWeb
        events={data}
        onMarkerPress={handleMarkerPress}
        centerOnEvent={centerEventId}
      />

      <CardCarousel
        data={data}
        selectedId={selectedId}
        onFocus={setSelectedId}
        onPress={handleCarouselPress}
        bottomOffset={carouselBottom}
        compact
      />

      <EventDetailsSheet
        visible={!!selectedEvent}
        event={selectedEvent}
        onClose={handleCloseEvent}
        onOpenStory={handleOpenStory}
        onCenterMap={handleCenterMap}
      />

      <FilterSheet
        visible={showFilters}
        value={filters}
        onChange={setFilters}
        onClose={handleCloseFilters}
        onApply={handleApplyFilters}
      />

      <StoryModal
        visible={storyOpen}
        data={data}
        index={storyIndex}
        onClose={handleCloseStory}
      />

      {/* Désactive la zone cliquable sous le header transparent */}
      <View pointerEvents="none" style={{ position:'absolute', left:0, right:0, top:0, height: top + headerH }} />
    </View>
  );
}
