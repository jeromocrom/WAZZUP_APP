// src/navigation/searchNav.ts
import type { NavigationProp } from '@react-navigation/native';
import { navigate as rootNavigate } from './rootNavigation';

export function navigateToSearchModal(navigation: NavigationProp<any>) {
  // Try current navigator
  // @ts-ignore
  if (navigation?.navigate) {
    try { navigation.navigate('SearchModal' as never); return; } catch {}
  }
  // Try parents up to 2 levels
  // @ts-ignore
  const p1 = (navigation as any)?.getParent?.();
  try { p1?.navigate?.('SearchModal'); return; } catch {}
  // @ts-ignore
  const p2 = p1?.getParent?.();
  try { p2?.navigate?.('SearchModal'); return; } catch {}
  // Fallback to global ref (root)
  rootNavigate('SearchModal');
}