"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useLanguageSwitcher } from "@/utils/language"
import { defaultLocale, locales, localesLabel } from "@/utils/variable"

const languages = locales.map((code, index) => ({
  code,
  label: localesLabel[index]
}))

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { changeLanguage } = useLanguageSwitcher()

  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const currentLocale = locales.find(locale => pathname.startsWith(`/${locale}`)) || defaultLocale
    return languages.find(lang => lang.code === currentLocale) || languages[0]
  })

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const currentLocale = locales.find(locale => pathname.startsWith(`/${locale}`)) || defaultLocale
    const newSelectedLanguage = languages.find(lang => lang.code === currentLocale) || languages[0]
    setSelectedLanguage(newSelectedLanguage)
  }, [pathname])

  const handleLanguageChange = (language: typeof languages[0]) => {
    setSelectedLanguage(language)
    changeLanguage(language.code)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>{selectedLanguage.label}</span>
        <svg className="w-5 h-5 ml-2 -mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                {language.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

