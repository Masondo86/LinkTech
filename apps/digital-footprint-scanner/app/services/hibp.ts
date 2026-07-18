export async function checkEmailBreaches(email: string): Promise<{ breached: boolean; breaches: string[] }> {
  const apiKey = process.env.HIBP_API_KEY;
  const url = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`;
  const res = await fetch(url, { headers: { 'hibp-api-key': apiKey! } });
  if (res.status === 404) return { breached: false, breaches: [] };
  if (!res.ok) throw new Error('HIBP lookup failed');
  const data = await res.json();
  const breachNames = data.map((b: any) => b.Name);
  return { breached: true, breaches: breachNames };
}
