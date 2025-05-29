"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from '@/components/ui/theme/theme-provider';
import { getDefaultThemeFromStates, getStateDisplayName } from '@/lib/utils/state-theme-mapping';
import { Theme } from '@/components/ui/theme/theme-provider';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

/**
 * Component that checks if user's state assignment suggests a different theme
 * and offers to switch to the state-specific theme
 */
export function StateThemeChecker() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestedTheme, setSuggestedTheme] = useState<Theme | null>(null);
  const [suggestedState, setSuggestedState] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [hasDeclined, setHasDeclined] = useState(false);

  // Check if user has declined on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('theme-suggestion-declined') === 'true') {
      setHasDeclined(true);
    }
  }, []);

  useEffect(() => {
    // Only check once per session when user logs in
    if (!session?.user?.states || hasChecked || hasDeclined) {
      return;
    }

    const stateTheme = getDefaultThemeFromStates(session.user.states);
    
    // If user has a state theme and it's different from current theme
    if (stateTheme && stateTheme !== theme) {
      setSuggestedTheme(stateTheme);
      setSuggestedState(session.user.states[0]); // Use first state for display
      setShowSuggestion(true);
    }
    
    setHasChecked(true);
  }, [session, theme, hasChecked, hasDeclined]);

  const handleAcceptSuggestion = () => {
    if (suggestedTheme) {
      setTheme(suggestedTheme);
      // Also update via API to ensure cookie is set server-side
      fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: suggestedTheme })
      });
    }
    setShowSuggestion(false);
  };

  const handleDeclineSuggestion = () => {
    setShowSuggestion(false);
    setHasDeclined(true);
    // Remember the user declined by setting a session storage flag
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('theme-suggestion-declined', 'true');
    }
  };

  // Don't show if user already declined in this session
  if (hasDeclined) {
    return null;
  }

  return (
    <Dialog open={showSuggestion} onOpenChange={setShowSuggestion}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>State-Specific Theme Available</DialogTitle>
          <DialogDescription>
            We noticed you're associated with {suggestedState ? getStateDisplayName(suggestedState) : 'a state'} which has a custom theme. 
            Would you like to switch to the {suggestedState ? getStateDisplayName(suggestedState) : 'state-specific'} theme?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleDeclineSuggestion}>
            Keep Current Theme
          </Button>
          <Button onClick={handleAcceptSuggestion}>
            Switch Theme
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}