import { Theme } from '@/components/ui/theme/theme-provider';

/**
 * Maps US states to their corresponding theme colors
 * This centralizes the state-to-theme logic for the multi-state portal
 */
export const STATE_THEME_MAP: Record<string, Theme> = {
  // Primary states with custom themes
  'arkansas': 'light-green', // Arkansas users get light-green theme
  'oregon': 'light-green', // Oregon users get light-green theme
  'tennessee': 'light-orange', // Tennessee users get light-orange theme,
  'kentucky': 'light-purple', // Kentucky users get light-purple theme
  
  // Future state expansions can be added here
  // 'alabama': 'light-blue',
  // 'mississippi': 'light-purple',
  // 'louisiana': 'light-red',
};

/**
 * Get the theme for a given state
 * @param state The state name (case-insensitive)
 * @returns The theme for the state, or null if no custom theme
 */
export function getThemeForState(state: string): Theme | null {
  const normalizedState = state.toLowerCase().trim();
  return STATE_THEME_MAP[normalizedState] || null;
}

/**
 * Get the default theme based on user's state assignments
 * @param states Array of state assignments from D365
 * @returns The theme for the first state with a custom theme, or null
 */
export function getDefaultThemeFromStates(states?: string[]): Theme | null {
  if (!states || states.length === 0) {
    return null;
  }
  
  // Return theme for first state that has a custom theme
  for (const state of states) {
    const theme = getThemeForState(state);
    if (theme) {
      return theme;
    }
  }
  
  return null;
}

/**
 * Get display name for a state
 * @param state The state identifier
 * @returns Properly formatted state name
 */
export function getStateDisplayName(state: string): string {
  const stateNames: Record<string, string> = {
    'tennessee': 'Every Child Tennessee',
    'arkansas': 'Every Child Arkansas',
    'oregon': 'Every Child Oregon',
    'alabama': 'Every Child Alabama',
    'mississippi': 'Every Child Mississippi',
    'louisiana': 'Every Child Louisiana',
    'kentucky': 'Every Child Kentucky',
  };
  
  return stateNames[state.toLowerCase()] || state;
}