const FLAGS: Record<string, string> = {
  en: '\u{1F1EC}\u{1F1E7}',
  it: '\u{1F1EE}\u{1F1F9}',
  fr: '\u{1F1EB}\u{1F1F7}',
  de: '\u{1F1E9}\u{1F1EA}',
  es: '\u{1F1EA}\u{1F1F8}',
  pt: '\u{1F1F5}\u{1F1F9}',
  ja: '\u{1F1EF}\u{1F1F5}',
  ko: '\u{1F1F0}\u{1F1F7}',
  zh: '\u{1F1E8}\u{1F1F3}',
  ru: '\u{1F1F7}\u{1F1FA}',
  ar: '\u{1F1F8}\u{1F1E6}',
  nl: '\u{1F1F3}\u{1F1F1}',
  sv: '\u{1F1F8}\u{1F1EA}',
  pl: '\u{1F1F5}\u{1F1F1}',
  tr: '\u{1F1F9}\u{1F1F7}',
  hi: '\u{1F1EE}\u{1F1F3}',
  fi: '\u{1F1EB}\u{1F1EE}',
  no: '\u{1F1F3}\u{1F1F4}',
  nb: '\u{1F1F3}\u{1F1F4}',
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  it: 'Italiano',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  pt: 'Português',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
  ru: 'Русский',
  ar: 'العربية',
  nl: 'Nederlands',
  sv: 'Svenska',
  pl: 'Polski',
  tr: 'Türkçe',
  hi: 'हिन्दी',
  fi: 'Suomi',
  no: 'Norsk',
  nb: 'Norsk bokmål',
}

export function getLanguageDisplay(code: string): string {
  return FLAGS[code.toLowerCase()] || code.toUpperCase()
}

export function getLanguageName(code: string): string {
  return LANGUAGE_NAMES[code.toLowerCase()] || code.toUpperCase()
}
