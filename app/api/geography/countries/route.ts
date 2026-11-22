import { NextResponse } from 'next/server';

type RestCountry = {
  name?: { common?: string; official?: string };
  cca2?: string;
  cca3?: string;
  flags?: { png?: string; svg?: string };
  independent?: boolean;
  unMember?: boolean;
};

export async function GET() {
  try {
    const response = await fetch(
      'https://restcountries.com/v3.1/all?fields=name,cca2,cca3,flags,independent,unMember',
      { next: { revalidate: 604800 } },
    );

    if (!response.ok) {
      throw new Error(`REST Countries returned ${response.status}`);
    }

    const countries = await response.json() as RestCountry[];
    const sovereign = countries
      .filter((country) => country.cca2 && country.cca3 &&
        (country.independent === true || country.unMember === true))
      .map((country) => ({
        name: country.name?.common || country.name?.official || '',
        officialName: country.name?.official || country.name?.common || '',
        iso2: country.cca2!,
        iso3: country.cca3!,
        flag: country.flags?.svg || country.flags?.png || '',
      }))
      .filter((country) => country.name)
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ success: true, countries: sovereign });
  } catch (error) {
    console.error('Country geography fetch failed:', error);
    return NextResponse.json(
      { success: false, message: 'Country data is unavailable. Use a previously cached country list or try again.' },
      { status: 503 },
    );
  }
}
