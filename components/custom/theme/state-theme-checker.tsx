"use client";

"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from '@/components/ui/theme/theme-provider';
import { getDefaultThemeFromStates } from '@/lib/utils/state-theme-mapping';
import { Theme } from '@/components/ui/theme/theme-provider'; // Theme type might still be needed if used directly

/**
 * Component that automatically sets the theme based on the user's state assignment
 * on their first login, if no explicit theme choice has been made.
 */
export function StateThemeChecker() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme(); // Get current theme to compare

  useEffect(() => {
    // Ensure session is loaded and user has states defined
    if (status !== 'authenticated' || !session?.user?.states || session.user.states.length === 0) {
      return;
    }

    // Determine the theme based on D365 state
    const stateTheme = getDefaultThemeFromStates(session.user.states);

    // Only apply the D365 state theme if it's different from the current theme.
    // This check is still useful to avoid unnecessary setTheme calls if the theme is already correct.
    if (stateTheme && stateTheme !== theme) {
      setTheme(stateTheme);
    }
    // By removing 'theme' from the dependency array below, this effect will primarily run
    // on session load/change. Manual theme changes will not immediately trigger this effect
    // to revert the theme, allowing manual overrides to persist until the next session update
    // or component re-mount that re-evaluates the session.

  }, [session, status, setTheme]); // Removed 'theme' from dependencies

  // This component no longer renders any UI, it's purely for side-effects
  return null;
}