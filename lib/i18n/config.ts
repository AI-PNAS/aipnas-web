// Simple i18n translation system

import en from '@/public/locales/en/common.json';
import am from '@/public/locales/am/common.json';

type Language = 'en' | 'am';

const translations = {
  en,
  am,
};

export function getTranslation(key: string, lang: Language = 'en'): string {
  const keys = key.split('.');
  let value: any = translations[lang] || translations.en;

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
}

export const SUPPORTED_LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'am', label: 'አማርኛ' },
];

export default { getTranslation, SUPPORTED_LANGUAGES };
