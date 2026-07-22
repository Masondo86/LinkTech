// app/services/abstractPhone.ts

export interface AbstractPhoneResult {
  valid: boolean;
  type: 'mobile' | 'landline' | 'voip' | 'unknown';
  carrier?: string;
  countryCode?: string;
  countryName?: string;
  location?: string;
  riskScore: number;
  reasons: string[];
}

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number = 5000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function getAbstractPhoneReputation(phoneNumber: string): Promise<AbstractPhoneResult | null> {
  const apiKey = process.env.ABSTRACT_PHONE_API_KEY;
  if (!apiKey) {
    console.error('[ABSTRACT-PHONE] API key missing');
    return null;
  }

  const normalized = phoneNumber.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
  if (!normalized) return null;

  const url = `https://phonevalidation.abstractapi.com/v1/?api_key=${apiKey}&phone=${encodeURIComponent(normalized)}`;

  try {
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    }, 5000);

    if (!response.ok) {
      console.error(`[ABSTRACT-PHONE] HTTP error ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log('[ABSTRACT-PHONE] Response:', JSON.stringify(data, null, 2));

    const reasons: string[] = [];
    let riskScore = 0;

    if (data.valid === true) {
      reasons.push('Abstract: Phone number is valid');
      riskScore = 10;
      if (data.type === 'voip') {
        reasons.push('Abstract: VoIP number detected – may be disposable or burner');
        riskScore = 50;
      } else if (data.type === 'mobile') {
        reasons.push(`Abstract: Mobile number (${data.carrier || 'unknown carrier'})`);
        riskScore = 20;
      } else if (data.type === 'landline') {
        reasons.push(`Abstract: Landline number (${data.carrier || 'unknown carrier'})`);
        riskScore = 15;
      }
    } else {
      reasons.push('Abstract: Phone number is invalid or unreachable');
      riskScore = 90;
    }

    return {
      valid: data.valid || false,
      type: data.type || 'unknown',
      carrier: data.carrier,
      countryCode: data.country?.code,
      countryName: data.country?.name,
      location: data.location,
      riskScore,
      reasons,
    };
  } catch (err) {
    console.error('[ABSTRACT-PHONE] Request failed:', err);
    return null;
  }
}
