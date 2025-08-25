// src/utils/overlay.ts
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useHeaderHeight } from '@react-navigation/elements';

export function useOverlayOffsets(opts?: { header?: boolean }){
  const insets = useSafeAreaInsets();
  const tabH = useBottomTabBarHeight?.() ?? 0;
  const headerH = opts?.header ? useHeaderHeight?.() ?? 0 : 0;

  const top = insets.top + (opts?.header ? headerH : 0);
  const bottom = insets.bottom + tabH;
  return { top, bottom, insetsTop: insets.top, insetsBottom: insets.bottom, tabBarHeight: tabH, headerHeight: headerH };
}