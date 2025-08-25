// src/utils/eventAdapter.ts
export type AdaptedProfile = {
  id?: string;
  name?: string;
  avatar?: string;
  verified?: boolean;
};

export type AdaptedEvent = {
  id: string;
  title: string;
  cover?: string;
  photos?: string[];
  city?: string;
  venue?: string;
  address?: string;
  datetimeFrom?: string;
  datetimeTo?: string;
  priceFrom?: number | null;
  organizer?: AdaptedProfile | string | null;
  artists?: (AdaptedProfile | string)[];
  stories?: string[];
  type?: string | null;
  isFavorite?: boolean;
};

function pickImage(anyVal: any): string | undefined {
  if (!anyVal) return undefined;
  if (typeof anyVal === 'string') return anyVal;
  if (Array.isArray(anyVal)) return pickImage(anyVal[0]);
  if (typeof anyVal === 'object') return anyVal.url || anyVal.cover || anyVal.photo || anyVal.src || anyVal.href;
  return undefined;
}

function toPhotos(arr: any): string[] | undefined {
  if (!arr) return undefined;
  if (Array.isArray(arr)) {
    const out = arr.map(p => pickImage(p)).filter(Boolean) as string[];
    return out.length ? out : undefined;
  }
  return undefined;
}

function toProfile(p: any): AdaptedProfile | string | null {
  if (!p) return null;
  if (typeof p === 'string') return p;
  if (typeof p === 'object') {
    return {
      id: p.id || p.slug || p._id || p.uuid,
      name: p.name || p.title || p.displayName || p.username,
      avatar: pickImage(p.avatar || p.photo || p.image || p.logo),
      verified: !!(p.verified || p.isVerified),
    };
  }
  return null;
}

function toProfiles(arr: any): (AdaptedProfile | string)[] | undefined {
  if (!arr) return undefined;
  if (Array.isArray(arr)) return arr.map(a => toProfile(a)).filter(Boolean) as any[];
  return undefined;
}

export function adaptEvent(raw: any, fallbackIndex?: number): AdaptedEvent {
  const id = raw?.id || raw?._id || raw?.uuid || raw?.key || (raw?.title && String(raw.title).toLowerCase().replace(/\s+/g, '_')) || (fallbackIndex != null ? String(fallbackIndex) : String(Math.random()));
  const title = raw?.title || raw?.name || raw?.eventName || 'Évènement';
  const cover = pickImage(raw?.cover || raw?.photo || raw?.image || (raw?.photos && raw.photos[0]) || (raw?.media && raw.media[0]));
  const photos = toPhotos(raw?.photos || raw?.gallery || raw?.images);
  const venue = raw?.venue || raw?.place?.name || raw?.location?.name || raw?.club || undefined;
  const city = raw?.city || raw?.place?.city || raw?.location?.city || raw?.address?.city || undefined;
  const address = raw?.address || raw?.location?.address || raw?.place?.address || raw?.fullAddress || undefined;
  const datetimeFrom = raw?.datetimeFrom || raw?.start || raw?.startTime || raw?.startDate || raw?.dateFrom || raw?.date;
  const datetimeTo = raw?.datetimeTo || raw?.end || raw?.endTime || raw?.endDate || raw?.dateTo;
  const priceFrom = (raw?.priceFrom ?? raw?.price ?? raw?.minPrice ?? null);
  const organizer = toProfile(raw?.organizer || raw?.host || raw?.promoter || raw?.booker);
  const artists = toProfiles(raw?.artists || raw?.lineup || raw?.guests) || [];
  const stories = toPhotos(raw?.stories || raw?.highlights || raw?.story) || photos || (cover ? [cover] : []);
  const type = raw?.type || raw?.category || raw?.tag || null;
  const isFavorite = !!raw?.isFavorite;

  return {
    id, title, cover, photos, city, venue, address, datetimeFrom, datetimeTo, priceFrom, organizer, artists, stories, type, isFavorite
  };
}
