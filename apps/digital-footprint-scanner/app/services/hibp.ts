// apps/digital-footprint-scanner/app/services/hibp.ts

export async function checkEmailBreaches(email: string): Promise<{ breached: boolean; breaches: string[] }> {
  const apiKey = process.env.HIBP_API_KEY;
  if (!apiKey) {
    console.warn('[HIBP] No API key provided, skipping breach check');
    return { breached: false, breaches: [] };
  }

  try {
    const url = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`;
    const response = await fetch(url, {
      headers: {
        'hibp-api-key': apiKey,
        'User-Agent': 'TheLinkDigital/1.0',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (response.status === 404) {
      return { breached: false, breaches: [] };
    }

    if (!response.ok) {
      console.warn(`[HIBP] API error: ${response.status}`);
      return { breached: false, breaches: [] };
    }

    const data = await response.json();
    const breachNames = data.map((b: any) => b.Name);
    return { breached: true, breaches: breachNames };
  } catch (err) {
    console.error('[HIBP] Error:', err);
    return { breached: false, breaches: [] };
  }
}
