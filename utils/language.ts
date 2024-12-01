"use client"

import { useRouter } from "next/navigation"
import { defaultLocale, locales } from "./variable"

export function useLanguageSwitcher() {
  const router = useRouter()

  const changeLanguage = async (locale: string) => {
    if (!locales.includes(locale)) {
      console.error(`Invalid locale: ${locale}`)
      return
    }

    document.cookie = `NEXT_LOCALE=${locale}; path=/`

    const currentPath = window.location.pathname

    const currentLocale = locales.find((l) =>
      currentPath.startsWith(`/${l}`)
    ) || defaultLocale

    const newPath = currentPath.startsWith(`/${currentLocale}`)
      ? currentPath.replace(`/${currentLocale}`, `/${locale}`)
      : `/${locale}${currentPath}`

    router.push(newPath)
  }

  return { changeLanguage }
}

