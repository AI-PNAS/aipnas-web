import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const countryCode = request.nextUrl.searchParams.get('countryCode')?.toUpperCase();
  if (!countryCode) {
    return NextResponse.json({ success: false, message: 'Country code is required.' }, { status: 400 });
  }

  try {
    if (countryCode !== 'ET') {
      const metadataUrl = `https://www.geoboundaries.org/api/current/gbOpen/${countryCode}/ADM1/`;
      const metadataResponse = await fetch(metadataUrl, { next: { revalidate: 2592000 } });
      if (!metadataResponse.ok) {
        return NextResponse.json(
          { success: true, divisions: [], manualEntryAllowed: true, message: 'Administrative divisions are unavailable; enter the region manually.' },
          { status: 200 },
        );
      }
      const metadata = await metadataResponse.json();
      const downloadUrl = metadata?.gjDownloadURL || metadata?.simplifiedGeometryGeoJSON;
      if (!downloadUrl) throw new Error('geoBoundaries metadata has no GeoJSON URL');

      const dataResponse = await fetch(downloadUrl, { next: { revalidate: 2592000 } });
      if (!dataResponse.ok) throw new Error(`GeoJSON returned ${dataResponse.status}`);
      const geoJson = await dataResponse.json();
      const divisions = (geoJson.features || [])
        .map((feature: { properties?: Record<string, unknown> }, index: number) => {
          const properties = feature.properties || {};
          const name = String(
            properties.shapeName || properties.NAME_1 || properties.name || properties.admin1Name || '',
          );
          const id = String(
            properties.shapeID || properties.adm1ID || properties.GID_1 || `${countryCode}-ADM1-${index}`,
          );
          return name ? { id, name } : null;
        })
        .filter((division: { id: string; name: string } | null): division is { id: string; name: string } => division !== null)
        .filter((division: { id: string; name: string }, index: number, list: { id: string; name: string }[]) =>
          list.findIndex((item) => item.id === division.id || item.name === division.name) === index,
        )
        .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));

      return NextResponse.json({ success: true, divisions, manualEntryAllowed: divisions.length === 0 });
    }

    const metadataResponse = await fetch(
      'https://www.geoboundaries.org/api/current/gbOpen/ET/ADM1/',
      { next: { revalidate: 2592000 } },
    );
    if (!metadataResponse.ok) throw new Error(`geoBoundaries returned ${metadataResponse.status}`);
    const metadata = await metadataResponse.json();
    const downloadUrl = metadata?.gjDownloadURL || metadata?.simplifiedGeometryGeoJSON;
    if (!downloadUrl) throw new Error('Ethiopia ADM1 GeoJSON URL unavailable');

    const dataResponse = await fetch(downloadUrl, { next: { revalidate: 2592000 } });
    if (!dataResponse.ok) throw new Error(`Ethiopia GeoJSON returned ${dataResponse.status}`);
    const geoJson = await dataResponse.json();
    const divisions = (geoJson.features || [])
      .map((feature: { properties?: Record<string, unknown> }, index: number) => {
        const properties = feature.properties || {};
        const name = String(properties.shapeName || properties.NAME_1 || properties.name || '');
        const id = String(properties.shapeID || properties.adm1ID || properties.GID_1 || `ET-ADM1-${index}`);
        return name ? { id, name } : null;
      })
      .filter((division: { id: string; name: string } | null): division is { id: string; name: string } => division !== null)
      .filter((division: { id: string; name: string }, index: number, list: { id: string; name: string }[]) =>
        list.findIndex((item) => item.id === division.id || item.name === division.name) === index,
      )
      .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));

    return NextResponse.json({ success: true, divisions, manualEntryAllowed: false });
  } catch (error) {
    console.error('Administrative geography fetch failed:', error);
    return NextResponse.json(
      { success: false, message: 'Regional data is unavailable. Use cached data or enter the region manually.' },
      { status: 503 },
    );
  }
}
