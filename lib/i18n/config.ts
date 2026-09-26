// Simple i18n translation system

import en from '@/public/locales/en/common.json';
import am from '@/public/locales/am/common.json';

type Language = 'en' | 'am';
type TranslationTree = Record<string, unknown>;

const translations: Record<Language, TranslationTree> = {
  en: en as TranslationTree,
  am: am as TranslationTree,
};

export function getTranslation(key: string, lang: Language = 'en'): string {
  const keys = key.split('.');
  let value: unknown = translations[lang] || translations.en;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
      continue;
    }

    return key;
  }

  return typeof value === 'string' ? value : key;
}

export const SUPPORTED_LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'am', label: 'አማርኛ' },
];

const i18n = { getTranslation, SUPPORTED_LANGUAGES };

export default i18n;
