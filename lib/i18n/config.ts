// Simple i18n translation system

import en from '@/public/locales/en/common.json';
import am from '@/public/locales/am/common.json';

export type Language = 'en' | 'am';

type TranslationTree = {
  [key: string]: string | TranslationTree;
};

const translations: Record<Language, TranslationTree> = {
  en,
  am,
};

export function getTranslation(key: string, lang: Language = 'en'): string {
  const keys = key.split('.');
  let value: string | TranslationTree | undefined = translations[lang] ?? translations.en;

  for (const k of keys) {
    if (typeof value !== 'object' || value === null) {
      return key;
    }
    value = value[k];
  }

  return typeof value === 'string' ? value : key;
}

export const SUPPORTED_LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'am', label: 'አማርኛ' },
];

const i18nConfig = { getTranslation, SUPPORTED_LANGUAGES };

export default i18nConfig;
