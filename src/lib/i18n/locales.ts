// 30-locale configuration for the RecipeCrave language selector.
// Each locale carries:
//   code   — IANA-ish code used for storage + URL params
//   name   — English-readable name (shown in admin/menus)
//   native — name as spoken/written by native speakers
//   flag   — flag emoji shorthand (CDN-free, supported by every modern OS)
//   rtl?   — true for right-to-left scripts (ar / he / fa / ur)

export type Locale = {
  code: string;
  name: string;
  native: string;
  flag: string;
  rtl?: boolean;
};

export const LOCALES: Locale[] = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'es-MX', name: 'Mexican Spanish', native: 'Español (México)', flag: '🇲🇽' },
  { code: 'zh', name: 'Mandarin Chinese', native: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', native: 'Polski', flag: '🇵🇱' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', name: 'Thai', native: 'ไทย', flag: '🇹🇭' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'fil', name: 'Filipino', native: 'Filipino', flag: '🇵🇭' },
  { code: 'sv', name: 'Swedish', native: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norwegian', native: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Danish', native: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', native: 'Suomi', flag: '🇫🇮' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'he', name: 'Hebrew', native: 'עברית', flag: '🇮🇱', rtl: true },
  { code: 'fa', name: 'Farsi', native: 'فارسی', flag: '🇮🇷', rtl: true },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰', rtl: true },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇧🇩' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili', flag: '🇹🇿' },
];

export const DEFAULT_LOCALE = 'en';

export function getLocale(code: string): Locale {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0]!;
}
