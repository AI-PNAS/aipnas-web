export type CountryOption = {
  name: string;
  officialName: string;
  iso2: string;
  iso3: string;
  flag: string;
};

export type AdministrativeDivision = {
  id: string;
  name: string;
};

const COUNTRY_CACHE_KEY = 'aipnas:countries:v1';
const REGION_CACHE_KEY = 'aipnas:ethiopia-regions:v1';

export function readCountryCache(): CountryOption[] {
  if (typeof window === 'undefined') return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(COUNTRY_CACHE_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function writeCountryCache(countries: CountryOption[]) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(COUNTRY_CACHE_KEY, JSON.stringify(countries));
  }
}

export function readRegionCache(): AdministrativeDivision[] {
  if (typeof window === 'undefined') return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(REGION_CACHE_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function writeRegionCache(regions: AdministrativeDivision[]) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(REGION_CACHE_KEY, JSON.stringify(regions));
  }
}
