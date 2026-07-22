export const STACK_STICKY_TOP_GAP = 24;
export const STACK_BOTTOM_SAFE_GAP = 40;
export const STACK_MOBILE_BREAKPOINT = 768;
export const STACK_TABLET_BREAKPOINT = 1100;

export function stackModeThreshold(width: number) {
  if (width < STACK_MOBILE_BREAKPOINT) return 0.82;
  if (width < STACK_TABLET_BREAKPOINT) return 0.9;
  return 0.96;
}

export function shouldUseSoftStack(width: number, contentHeight: number, availableHeight: number) {
  return width < STACK_MOBILE_BREAKPOINT && contentHeight <= availableHeight * 0.64;
}
