
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated, Dimensions, Easing, Linking, Modal, PanResponder, Platform, Pressable,
  ScrollView, StyleSheet, Text, View, Image, Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import FavoriteStar from '@/components/FavoriteStar';
import { adaptEvent } from '@/utils/eventAdapter';
import { useEngagementForEvent } from '@/hooks/useEngagement';
import HypePill from '@/components/HypePill';

type Props = {
  visible: boolean;
  event: any | null;
  onClose: () => void;
  onOpenStory?: (index: number, stories: any[]) => void;
  onNavigateProfile?: (type: 'organizer'|'artist', id: string)=>void;
  devFallbacks?: boolean;
};

const { height: SCREEN_H } = Dimensions.get('window');

function formatRange(start?: string | null, end?: string | null){
  if (!start && !end) return '—';
  try{
    const s = start ? new Date(start) : null;
    const e = end ? new Date(end) : null;
    const optsDate: Intl.DateTimeFormatOptions = { weekday:'short', day:'2-digit', month:'short' };
    const optsTime: Intl.DateTimeFormatOptions = { hour:'2-digit', minute:'2-digit' };
    if (s && e){
      const sameDay = s.toDateString() === e.toDateString();
      const left = s.toLocaleDateString(undefined, optsDate)+' • '+s.toLocaleTimeString(undefined, optsTime);
      const right = sameDay ? e.toLocaleTimeString(undefined, optsTime) : e.toLocaleDateString(undefined, optsDate)+' • '+e.toLocaleTimeString(undefined, optsTime);
      return `${left} → ${right}`;
    }
    const one = (s || e)!;
    return one.toLocaleDateString(undefined, optsDate)+' • '+one.toLocaleTimeString(undefined, optsTime);
  }catch{
    return `${start || ''} ${end ? '→ '+end : ''}`.trim() || '—';
  }
}
function priceLabel(adapted: any, raw: any){
  if (typeof adapted?.priceFrom === 'number') return `Dès ${adapted.priceFrom}€`;
  if (Array.isArray(raw?.priceTiers) && raw.priceTiers.length){
    const min = Math.min(...raw.priceTiers.map((t:any)=> t.price || 0));
    return `Dès ${min}€`;
  }
  return 'Tarifs • —';
}

export default function EventDetailsSheet({
  visible, event, onClose, onOpenStory, onNavigateProfile, devFallbacks = true
}: Props){
  // ---------- Hooks ALWAYS called (no conditional early-return before hooks) ----------
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_H)).current;
  const [stickyH, setStickyH] = useState(100);

  const a = useMemo(()=> (event ? adaptEvent(event) : null), [event]);
  const SNAP_FULL = useMemo(() => Math.max(insets.top + 12, 64), [insets.top]);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? SNAP_FULL : SCREEN_H,
      duration: visible ? 240 : 220,
      easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      useNativeDriver: true
    }).start();
  }, [visible, SNAP_FULL]);

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > Math.abs(g.dx) && Math.abs(g.dy) > 6,
      onPanResponderMove: (_, g) => {
        const next = Math.max(SNAP_FULL, Math.min(SCREEN_H, SNAP_FULL + g.dy));
        translateY.setValue(next);
      },
      onPanResponderRelease: (_, g) => {
        if (g.vy > 1.2 || (SNAP_FULL + g.dy) > SCREEN_H - 120) { onClose(); return; }
        Animated.spring(translateY, { toValue: SNAP_FULL, useNativeDriver: true, damping: 18, stiffness: 220, mass: 0.8 }).start();
      },
    })
  ).current;

  const id = a?.id as string | undefined;
  const { isFavorite, status, toggleFavorite, setRSVP, counts, hypeScore } = useEngagementForEvent(id);

  const shouldRenderContent = !!(visible && a);

  // Derived display values (safe fallbacks)
  const title = a?.title || '';
  const metaLine = (a?.venue || '') + (a?.city ? ((a?.venue ? ' • ' : '') + a.city) : '');
  const addrLine = a?.address || ((event as any)?.lat && (event as any)?.lng ? `${(event as any).lat}, ${(event as any).lng}` : '—');
  const themeType = [ (event as any)?.theme, a?.type ].flat().filter(Boolean).join(' • ');
  const whenRange = formatRange(a?.datetimeFrom || (event as any)?.start || (event as any)?.startAt, a?.datetimeTo || (event as any)?.end || (event as any)?.endAt);
  const priceText = priceLabel(a, event);

  const cover = a?.cover || (a?.photos && a.photos[0]);
  let photos = (a?.photos || (event as any)?.photos) as string[] | undefined;
  let stories = (a?.stories || (event as any)?.stories) as any[] | undefined;
  if (devFallbacks && shouldRenderContent){
    if (!photos || photos.length === 0){
      photos = [
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop'
      ];
    }
    if (!stories || stories.length === 0){
      stories = [{id:'demo1'},{id:'demo2'},{id:'demo3'}];
    }
  }

  // Organizer/Artists normalized
  const organizer = useMemo(()=>{
    const org: any = a?.organizer ?? null;
    if (!org) return null;
    if (typeof org === 'string') return { id: org, name: org, avatar: undefined, verified: false };
    return org as { id?:string; name?:string; avatar?:string; verified?:boolean };
  }, [a?.organizer]);

  const artists = useMemo(()=> {
    const arr = (a?.artists ?? []) as any[];
    return arr.map((x:any, i:number)=> {
      if (!x) return null;
      if (typeof x === 'string') return { id: String(i), name: x, avatar: undefined };
      return { id: x.id || String(i), name: x.name || 'Artiste', avatar: x.avatar };
    }).filter(Boolean) as { id:string; name:string; avatar?:string }[];
  }, [a?.artists]);

  // ---------- Render (no early return to keep hook order stable) ----------
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {/* Background scrim + blur */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
        <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor:'#00000030' }} />
      </Pressable>

      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        {/* Drag handle + header */}
        <View style={[styles.dragZone]} {...pan.panHandlers}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={{ flex:1 }}>
              <Text style={styles.title} numberOfLines={2}>{shouldRenderContent ? title : ''}</Text>
              <Text style={styles.meta} numberOfLines={1}>{shouldRenderContent ? metaLine : ''}</Text>
              {shouldRenderContent && (
                <>
                  <View style={{ height:6 }} />
                  <HypePill score={hypeScore} />
                  <View style={{ flexDirection:'row', flexWrap:'wrap', gap:6, marginTop:6 }}>
                    {/* Example badges – you can feed them from state flags if you have them */}
                  </View>
                </>
              )}
            </View>
            {shouldRenderContent && (
              <FavoriteStar active={!!isFavorite} onToggle={toggleFavorite} />
            )}
          </View>
        </View>

        <ScrollView
          style={{ flex:1 }}
          contentContainerStyle={{ paddingBottom: stickyH + 16 }}
          nestedScrollEnabled
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Cover */}
          {shouldRenderContent && cover && (
            <View style={{ paddingHorizontal: 12, paddingTop: 8 }}>
              <Image source={{ uri: cover }} style={styles.cover} resizeMode="cover" />
            </View>
          )}

          {/* When & Address */}
          {shouldRenderContent && (
            <>
              <Section title="Horaires">
                <Text style={styles.text}>{whenRange}</Text>
              </Section>
              <Section title="Adresse">
                <Text style={styles.text}>{addrLine}</Text>
                <View style={{ height: 8 }} />
                <View style={{ flexDirection:'row', gap:8, flexWrap:'wrap' }}>
                  <Chip onPress={()=> openMaps(a, event)}>🧭 Itinéraire</Chip>
                  {!!a?.venue && <Chip>📍 {a.venue}</Chip>}
                </View>
              </Section>
            </>
          )}

          {/* Photos */}
          {shouldRenderContent && !!photos?.length && (
            <Section title="Photos">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                {photos!.map((uri: string, i: number) => (
                  <Image key={i} source={{ uri }} style={styles.photo} resizeMode="cover" />
                ))}
              </ScrollView>
            </Section>
          )}

          {/* Stories */}
          {shouldRenderContent && !!stories?.length && (
            <Section title="Stories">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {stories!.map((s: any, i: number) => (
                  <Pressable key={i} onPress={()=> onOpenStory?.(i, stories!)} style={styles.storyBubble}>
                    <Text style={{ fontWeight:'900' }}>🎬</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <Text style={[styles.text, { marginTop: 6 }]}>Tape sur une bulle pour lire la story.</Text>
            </Section>
          )}

          {/* Organizer */}
          {shouldRenderContent && !!organizer && (
            <Section title="Organisateur">
              <Pressable style={styles.profileRow} onPress={()=> onNavigateProfile?.('organizer', organizer.id || organizer.name || '')}>
                {organizer.avatar ? <Image source={{ uri: organizer.avatar }} style={styles.avatar} /> : <View style={[styles.avatar, styles.avatarFallback]} />}
                <View style={{ flex:1 }}>
                  <Text style={styles.profileName}>{organizer.name || 'Organisateur'}</Text>
                </View>
                <Text style={styles.link}>Voir le profil ›</Text>
              </Pressable>
            </Section>
          )}

          {/* Artists */}
          {shouldRenderContent && !!artists?.length && (
            <Section title="Artistes & collab">
              <View style={styles.artistGrid}>
                {artists.map((p:any)=> (
                  <Pressable key={String(p.id)} style={styles.artistChip} onPress={()=> onNavigateProfile?.('artist', p.id || p.name || '')}>
                    {p.avatar ? <Image source={{ uri: p.avatar }} style={styles.artistAvatar} /> : <View style={[styles.artistAvatar, styles.avatarFallback]} />}
                    <Text numberOfLines={1} style={styles.artistName}>{p.name || 'Artiste'}</Text>
                  </Pressable>
                ))}
              </View>
            </Section>
          )}

          {/* Thematic / Type */}
          {shouldRenderContent && !!themeType && (
            <Section title="Thématique & type">
              <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8 }}>
                {String(themeType).split('•').map((t, i)=>( <Chip key={i}>{t.trim()}</Chip> ))}
              </View>
            </Section>
          )}

          {/* Practical info */}
          {shouldRenderContent && (
            <Section title="Infos pratiques">
              <Row label="Tarifs" value={priceText} />
            </Section>
          )}

          {/* About / Description */}
          {shouldRenderContent && (
            <Section title="À propos">
              <Text style={styles.desc}>
                {(event as any)?.description || (event as any)?.longDescription || 'Description à venir.'}
              </Text>
            </Section>
          )}
        </ScrollView>

        {/* Sticky actions */}
        {shouldRenderContent && (
          <View style={styles.sticky} onLayout={e => setStickyH(e.nativeEvent.layout.height)}>
            <View style={styles.rsvpRow}>
              <Pressable onPress={()=> setRSVP(status==='going' ? null : 'going')} style={[styles.rsvpBtn, status==='going' && styles.rsvpActive]}>
                <Text style={styles.rsvpTxt}>{status==='going' ? '✓ Je participe' : 'Je participe'}</Text>
              </Pressable>
              <Pressable onPress={()=> setRSVP(status==='interested' ? null : 'interested')} style={[styles.rsvpBtn, status==='interested' && styles.rsvpActive]}>
                <Text style={styles.rsvpTxt}>{status==='interested' ? '✓ Intéressé' : 'Intéressé'}</Text>
              </Pressable>
            </View>
            <Pressable onPress={()=> onPressPrimary(a, event)} style={[styles.cta, styles.ctaPrimary]}>
              <Text style={styles.ctaPrimaryTxt}>{primaryCtaLabel(event)}</Text>
            </Pressable>
            <Pressable onPress={()=> openMaps(a, event)} style={[styles.cta, styles.ctaGhost]}>
              <Text style={styles.ctaGhostTxt}>🧭 Itinéraire</Text>
            </Pressable>
          </View>
        )}
      </Animated.View>
    </Modal>
  );
}

// ---------- helpers (no hooks) ----------
function openMaps(a: any, raw: any){
  const addr = a?.address;
  const lat = raw?.lat;
  const lng = raw?.lng;
  let url = '';
  if (typeof lat === 'number' && typeof lng === 'number'){
    url = Platform.select({
      ios: `http://maps.apple.com/?ll=${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}`,
      default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    }) as string;
  } else if (addr){
    url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
  }
  if (url) Linking.openURL(url).catch(()=>{});
}
function primaryCtaLabel(raw: any){
  const ticketUrl = raw?.ticketUrl || raw?.ticket?.url;
  return ticketUrl ? '🎟️ Billets' : '🎟️ Billets (indisponibles)';
}
function onPressPrimary(a:any, raw:any){
  const ticketUrl = raw?.ticketUrl || raw?.ticket?.url;
  if (ticketUrl){ Linking.openURL(ticketUrl).catch(()=>{}); }
  else { Alert.alert('Billets', 'Aucun lien billets fourni.'); }
}

// ---------- small UI primitives ----------
function Section({ title, children }: { title: string; children: React.ReactNode }){
  return (
    <View style={{ paddingHorizontal: 12, paddingTop: 12 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={{ height: 8 }} />
      {children}
      <View style={{ height: 10 }} />
      <View style={styles.separator} />
    </View>
  );
}
function Row({ label, value }: { label: string; value: string }){
  return (
    <View style={{ flexDirection:'row', alignItems:'flex-start', gap:8, marginBottom:6 }}>
      <Text style={[styles.text, { width:120, color:'#333' }]}>{label}</Text>
      <Text style={[styles.text, { flex:1 }]}>{value}</Text>
    </View>
  );
}
function Chip({ children, onPress }: { children: React.ReactNode; onPress?: ()=>void }){
  return (
    <Pressable onPress={onPress} style={styles.chip}><Text style={{ fontWeight:'900' }}>{children}</Text></Pressable>
  );
}

const styles = StyleSheet.create({
  sheet:{
    position:'absolute', left:0, right:0, top:0, bottom:0,
    backgroundColor:'#FFF',
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    borderWidth:2, borderColor:'#000',
    overflow:'hidden',
    shadowColor:'#000',
    shadowOpacity:0.12,
    shadowRadius:18,
    shadowOffset:{ width:0, height:8 },
    elevation:16,
  },
  dragZone:{ paddingTop: 8, paddingHorizontal: 12, paddingBottom: 4 },
  handle:{ alignSelf:'center', width:56, height:6, borderRadius:999, backgroundColor:'#000', marginBottom:8 },
  header:{ flexDirection:'row', alignItems:'center', gap:10 },
  title:{ fontWeight:'900', fontSize:18 },
  meta:{ fontWeight:'700', color:'#333' },
  metaSmall:{ fontWeight:'700', color:'#666', fontSize:12 },

  cover:{ width:'100%', height: 160, borderRadius: 16, borderWidth:1.5, borderColor:'#000' },
  sectionTitle:{ fontWeight:'900', fontSize:16 },
  text:{ fontWeight:'700' },
  chip:{ paddingHorizontal:12, paddingVertical:8, borderWidth:1, borderColor:'#000', borderRadius:999, backgroundColor:'#FFF' },
  photo:{ width:180, height:120, borderRadius:14, borderWidth:1, borderColor:'#000' },
  storyBubble:{ width:64, height:64, borderRadius:999, borderWidth:2, borderColor:'#000', alignItems:'center', justifyContent:'center', backgroundColor:'#FFD300' },

  profileRow:{ flexDirection:'row', alignItems:'center', gap:10, padding:8, borderWidth:1.5, borderColor:'#000', borderRadius:12, backgroundColor:'#FFF' },
  avatar:{ width:36, height:36, borderRadius:999, borderWidth:1.5, borderColor:'#000' },
  avatarFallback:{ backgroundColor:'#FFD300' },
  profileName:{ fontWeight:'900' },
  link:{ fontWeight:'900', color:'#000' },

  artistGrid:{ flexDirection:'row', flexWrap:'wrap', gap:10 },
  artistChip:{ width:110, padding:8, borderWidth:1.5, borderColor:'#000', borderRadius:12, backgroundColor:'#FFF', alignItems:'center', gap:6 },
  artistAvatar:{ width:54, height:54, borderRadius:999, borderWidth:1.5, borderColor:'#000' },
  artistName:{ fontWeight:'900', maxWidth:90, textAlign:'center' },

  separator:{ height:1, backgroundColor:'#000', opacity:0.12 },

  sticky:{
    position:'absolute', left:0, right:0, bottom:0,
    backgroundColor:'#FFF',
    borderTopWidth:1, borderTopColor:'#000',
    gap:10, paddingHorizontal:12, paddingTop:10, paddingBottom:12
  },
  rsvpRow:{ flexDirection:'row', gap:8 },
  rsvpBtn:{ flex:1, height:42, borderRadius:12, alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'#000', backgroundColor:'#FFF' },
  rsvpActive:{ backgroundColor:'#FFD300' },

  cta:{ height:48, borderRadius:14, alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'#000' },
  ctaPrimary:{ backgroundColor:'#FFD300' },
  ctaPrimaryTxt:{ fontWeight:'900' },
  ctaGhost:{ backgroundColor:'#FFF' },
  ctaGhostTxt:{ fontWeight:'900' },
});
