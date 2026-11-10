/**
 * Design tokens (single source of truth for colors used in JS and CSS).
 * SCSS $variables in assets/scss/_variables.scss should stay in sync for
 * Sass helpers (rgba, etc.) until those call sites use var(--*) only.
 */
export const themeColors = {
  white: "#fff",
  black: "#000",
  grey100: "#f5f5f5",
  grey200: "#dfdfdf",
  grey400: "#a2a2a2",
  grey800: "#636363",
  text: "#eff0eb",
  brandLight: "#c99f67",
  brandDark: "#966840",
  primary: "#242424",
  secondary: "#575759",
  danger: "#660d00",
  warning: "#cc860d",
  success: "#486600",
  disabled: "#808080",
  borderControl: "#bbb",
  mapCollected: "#4caf50",
  mapRouteEnd: "#e57373",
  mapUserAccuracyFill: "#0042ff",
  mapMarkerBrown: "#54341f",
  primaryMuted: "rgba(36, 36, 36, 0.52)"
} as const;

/** Colors passed to the Google Maps JavaScript API (must be concrete hex/rgb). */
export const mapTheme = {
  primary: themeColors.primary,
  white: themeColors.white,
  brandLight: themeColors.brandLight,
  collected: themeColors.mapCollected,
  routeEnd: themeColors.mapRouteEnd,
  userAccuracyFill: themeColors.mapUserAccuracyFill,
  markerBrown: themeColors.mapMarkerBrown
} as const;

/** Maps token → CSS custom property for global styling. */
export const themeCssVariables: Record<string, string> = {
  "--color-white": themeColors.white,
  "--color-black": themeColors.black,
  "--color-primary": themeColors.primary,
  "--color-secondary": themeColors.secondary,
  "--color-text": themeColors.text,
  "--color-brand-light": themeColors.brandLight,
  "--color-brand-dark": themeColors.brandDark,
  "--color-grey-200": themeColors.grey200,
  "--color-warning": themeColors.warning,
  "--color-success": themeColors.success,
  "--color-border-control": themeColors.borderControl,
  "--color-map-collected": themeColors.mapCollected,
  "--color-map-route-end": themeColors.mapRouteEnd,
  "--color-map-user-accuracy-fill": themeColors.mapUserAccuracyFill,
  "--color-map-marker-brown": themeColors.mapMarkerBrown,
  "--color-primary-muted": themeColors.primaryMuted
};

/** Push design tokens to :root so styles can use var(--color-*). */
export function applyCssTheme(): void {
  const root = document.documentElement;
  Object.entries(themeCssVariables).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });
}
