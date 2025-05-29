import { cookies } from 'next/headers';

export type Theme = "light-orange" | "light-green";

const THEME_COOKIE_NAME = 'partner-portal-theme';
const DEFAULT_THEME: Theme = 'light-green'; // Changed to green as default brand

/**
 * Get the current theme from cookies (server-side)
 * This prevents theme flash by reading the theme before render
 */
export async function getThemeFromCookies(): Promise<Theme> {
  try {
    const cookieStore = await cookies();
    const themeCookie = cookieStore.get(THEME_COOKIE_NAME);
    
    // If user has explicitly set a theme, respect it
    if (themeCookie?.value && isValidTheme(themeCookie.value)) {
      return themeCookie.value as Theme;
    }
  } catch (error) {
    // If cookie reading fails, log error and return default
    console.error('Failed to read theme cookie:', error);
  }
  
  // Default to green (primary brand color)
  return DEFAULT_THEME;
}

/**
 * Set theme in cookies (typically called from API routes or server actions)
 */
export async function setThemeCookie(theme: Theme) {
  const cookieStore = await cookies();
  
  cookieStore.set(THEME_COOKIE_NAME, theme, {
    httpOnly: false, // Allow client-side access
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
}

function isValidTheme(value: string): boolean {
  return value === 'light-orange' || value === 'light-green';
}