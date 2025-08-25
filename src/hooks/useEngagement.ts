import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type RSVPStatus = 'going' | 'interested' | null;

const KEY_FAV = 'wzp:favorites:v1';
const KEY_RSVP = 'wzp:rsvp:v1';

function hashId(id: string){
  let h = 0;
  for (let i=0;i<id.length;i++){ h = ((h<<5)-h) + id.charCodeAt(i); h |= 0; }
  return Math.abs(h);
}

export function useEngagementForEvent(id?: string | null){
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [rsvp, setRsvp] = useState<Record<string, RSVPStatus>>({});

  // load
  useEffect(()=>{
    (async ()=>{
      try{
        const f = await AsyncStorage.getItem(KEY_FAV);
        const r = await AsyncStorage.getItem(KEY_RSVP);
        if (f){ setFavs(new Set(JSON.parse(f))); }
        if (r){ setRsvp(JSON.parse(r)); }
      }catch{}
    })();
  }, []);

  const isFavorite = useMemo(()=> !!(id && favs.has(id)), [id, favs]);
  const status = useMemo(()=> (id ? (rsvp[id] ?? null) : null), [id, rsvp]);

  const toggleFavorite = useCallback(async ()=> {
    if (!id) return;
    const next = new Set(favs);
    if (next.has(id)) next.delete(id); else next.add(id);
    setFavs(next);
    try{ await AsyncStorage.setItem(KEY_FAV, JSON.stringify(Array.from(next))); }catch{}
  }, [id, favs]);

  const setRSVP = useCallback(async (s: RSVPStatus)=> {
    if (!id) return;
    const next = { ...rsvp, [id]: s };
    if (s===null) delete next[id];
    setRsvp(next);
    try{ await AsyncStorage.setItem(KEY_RSVP, JSON.stringify(next)); }catch{}
  }, [id, rsvp]);

  // demo counts for hype (stable pseudo-random seeded by id)
  const counts = useMemo(()=>{
    if (!id) return { going: 0, interested: 0, wish: 0 };
    const base = hashId(id);
    const going = (base % 120) + 20;
    const interested = (Math.floor(base/3) % 180) + 30;
    const wish = (Math.floor(base/7) % 90) + 10;
    return { going, interested, wish };
  }, [id]);

  const hypeScore = useMemo(()=> {
    const g = counts.going + (status==='going'? 1:0);
    const i = counts.interested + (status==='interested'? 1:0);
    const f = isFavorite ? 1 : 0;
    return Math.round( (g*0.6 + i*0.3 + f*0.1) );
  }, [counts, isFavorite, status]);

  return { isFavorite, status, toggleFavorite, setRSVP, counts, hypeScore };
}
