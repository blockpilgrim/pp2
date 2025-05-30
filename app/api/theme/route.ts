import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { setThemeCookie, getThemeFromCookies } from '@/lib/utils/theme-cookies';
import { getDefaultThemeFromStates } from '@/lib/utils/state-theme-mapping';
import { Theme } from '@/components/ui/theme/theme-provider';

/**
 * GET /api/theme
 * Returns the current theme and any state-based default
 */
export async function GET() {
  try {
    const session = await auth();
    const currentTheme = await getThemeFromCookies();
    
    // Check if user has state assignments that suggest a different theme
    const suggestedTheme = session?.user?.states 
      ? getDefaultThemeFromStates(session.user.states) 
      : null;
    
    return NextResponse.json({
      currentTheme,
      suggestedTheme,
      userStates: session?.user?.states || [],
      hasStateTheme: !!suggestedTheme,
    });
  } catch (error) {
    console.error('Error fetching theme info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch theme information' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/theme
 * Updates the user's theme preference
 */
export async function POST(request: NextRequest) {
  try {
    const { theme } = await request.json();
    
    // Check if theme is valid
    const validThemes: Theme[] = ['light-orange', 'light-green', 'light-purple'];
    if (!theme || !validThemes.includes(theme)) {
      console.error(`Invalid theme value received: ${theme}`);
      return NextResponse.json(
        { error: `Invalid theme value: ${theme}. Valid themes are: ${validThemes.join(', ')}` },
        { status: 400 }
      );
    }
    
    await setThemeCookie(theme as Theme);
    
    return NextResponse.json({ 
      success: true, 
      theme 
    });
  } catch (error) {
    console.error('Error setting theme:', error);
    return NextResponse.json(
      { error: 'Failed to update theme' },
      { status: 500 }
    );
  }
}