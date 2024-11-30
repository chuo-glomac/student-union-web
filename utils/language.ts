"use client"
import { useRouter } from 'next/router';
import { defaultLocale, locales } from '@/utils/variable';

/**
 * Hook to switch languages in a Next.js application.
 * Automatically updates the `NEXT_LOCALE` cookie and redirects to the localized URL.
 */
export function useLanguageSwitcher() {
  const router = useRouter();

  /**
   * Change the language for the current route.
   * @param {string} locale - The new language to switch to (e.g., 'en-US', 'ja').
   */
  const changeLanguage = async (locale: string) => {
    // Set the NEXT_LOCALE cookie to remember the user's language preference
    document.cookie = `NEXT_LOCALE=${locale}; path=/`;

    // Get the current path and remove the existing locale from it
    const currentPath = router.asPath;
    const currentLocale = router.locale || 'en-US'; // Default to 'en-US'

    // Construct the new localized URL
    const newPath = currentPath.startsWith(`/${currentLocale}`)
      ? currentPath.replace(`/${currentLocale}`, `/${locale}`)
      : `/${locale}${currentPath}`;

    // Navigate to the new localized path
    await router.push(newPath);
  };

  return { changeLanguage };
}
