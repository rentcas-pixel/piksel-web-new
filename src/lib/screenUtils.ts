import { LEDScreen, supabase } from './supabase';

function parseCoordinates(raw: unknown): [number, number] {
  if (raw && typeof raw === 'object' && 'x' in raw && 'y' in raw) {
    const point = raw as { x: number; y: number };
    return [point.x, point.y];
  }
  if (typeof raw === 'string') {
    const match = raw.match(/\(([^,]+),\s*([^)]+)\)/);
    if (match) {
      return [parseFloat(match[1]), parseFloat(match[2])];
    }
  }
  return [0, 0];
}

export function transformScreen(screen: Record<string, unknown>): LEDScreen {
  return {
    ...(screen as unknown as LEDScreen),
    coordinates: parseCoordinates(screen.coordinates),
  };
}

/** Canonical public path for a screen page */
export function getScreenPath(screen: LEDScreen): string {
  if (screen.custom_url) return `/${screen.custom_url}`;
  if (screen.slug) return `/ekranas/${screen.slug}`;
  return `/ekranas/${screen.id}`;
}

export function getMapLink(screen: LEDScreen): string {
  if (screen.custom_url) return `/#${screen.custom_url}`;
  return `/?city=${encodeURIComponent(screen.city)}`;
}

export function formatTraffic(traffic?: string): string | null {
  if (!traffic) return null;
  const normalized = traffic.replace(/\s/g, '');
  const num = Number(normalized.replace(/\./g, '').replace(/,/g, ''));
  if (Number.isNaN(num)) return traffic;
  return num.toLocaleString('lt-LT');
}

export function formatPrice(price?: number): string | null {
  if (price == null || price <= 0) return null;
  return `nuo ${price.toFixed(2)} €`;
}

export function findScreenInList(screens: LEDScreen[], identifier: string): LEDScreen | undefined {
  const lower = identifier.toLowerCase();
  return screens.find(
    (s) =>
      s.id === identifier ||
      s.slug?.toLowerCase() === lower ||
      s.custom_url === identifier ||
      s.custom_url?.toLowerCase() === lower
  );
}

export async function fetchScreenByIdentifier(identifier: string): Promise<LEDScreen | null> {
  const decoded = decodeURIComponent(identifier);

  const { data: bySlug } = await supabase
    .from('led_screens')
    .select('*')
    .eq('is_active', true)
    .eq('slug', decoded)
    .maybeSingle();
  if (bySlug) return transformScreen(bySlug);

  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(decoded)) {
    const { data: byId } = await supabase
      .from('led_screens')
      .select('*')
      .eq('is_active', true)
      .eq('id', decoded)
      .maybeSingle();
    if (byId) return transformScreen(byId);
  }

  const { data: byCustomUrl } = await supabase
    .from('led_screens')
    .select('*')
    .eq('is_active', true)
    .eq('custom_url', decoded)
    .maybeSingle();
  if (byCustomUrl) return transformScreen(byCustomUrl);

  return null;
}

export async function fetchScreenByCustomPath(path: string): Promise<LEDScreen | null> {
  const { data } = await supabase
    .from('led_screens')
    .select('*')
    .eq('is_active', true)
    .eq('custom_url', path)
    .maybeSingle();
  return data ? transformScreen(data) : null;
}

export async function fetchRelatedScreens(
  city: string,
  excludeId: string,
  limit = 3
): Promise<LEDScreen[]> {
  const { data } = await supabase
    .from('led_screens')
    .select('*')
    .eq('is_active', true)
    .eq('city', city)
    .neq('id', excludeId)
    .order('display_order', { ascending: true })
    .limit(limit);

  return data?.map(transformScreen) ?? [];
}

export function getScreenFeatures(screen: LEDScreen): string[] {
  const features: string[] = [];
  if (screen.is_video) features.push('Video ekranas');
  if (screen.is_viaduct) features.push('Viadukas');
  if (screen.is_double_sided) features.push('Dvipusis');
  if (screen.is_static) features.push('Statinis vaizdas');
  if (screen.is_last_minute) features.push('Last minute');
  return features;
}
