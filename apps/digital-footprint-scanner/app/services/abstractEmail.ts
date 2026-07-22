// app/services/abstractEmail.ts

export interface AbstractEmailResult {
  valid: boolean;
  isDisposable: boolean;
  isFreeProvider: boolean;
  deliverability: 'DELIVERABLE' | 'RISKY' | 'UNDELIVERABLE' | 'UNKNOWN';
  qualityScore: number;
  isSMTPValid: boolean;
  isMXFound: boolean;
  riskScore: number;
  reasons: string[];
}

// Helper to fetch with timeout
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

export async function getAbstractEmailReputation(email: string): Promise<AbstractEmailResult | null> {
  const apiKey = process.env.ABSTRACT_EMAIL_API_KEY;
  if (!apiKey) {
    console.error('[ABSTRACT-EMAIL] API key missing');
    return null;
  }

  const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`;

  try {
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    }, 5000);

    if (!response.ok) {
      console.error(`[ABSTRACT-EMAIL] HTTP error ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log('[ABSTRACT-EMAIL] Response:', JSON.stringify(data, null, 2));

    const reasons: string[] = [];
    const isValid = data.is_valid_format?.value === true;
    if (!isValid) {
      reasons.push(`Abstract: Invalid email format (${data.is_valid_format?.text || 'unknown reason'})`);
    } else {
      reasons.push('Abstract: Email format is valid');
    }

    const isDisposable = data.is_disposable_email?.value === true;
    if (isDisposable) reasons.push('Abstract: Disposable email address detected');

    const isFreeProvider = data.is_free_provider?.value === true;
    if (isFreeProvider) reasons.push('Abstract: Free email provider (e.g., Gmail, Yahoo)');

    const deliverability = data.deliverability || 'UNKNOWN';
    if (deliverability === 'DELIVERABLE') reasons.push('Abstract: Email is deliverable');
    else if (deliverability === 'RISKY') reasons.push('Abstract: Risky deliverability – may bounce');
    else if (deliverability === 'UNDELIVERABLE') reasons.push('Abstract: Email is undeliverable');

    const isMXFound = data.is_mx_found?.value === true || false;
    if (!isMXFound) reasons.push('Abstract: No MX records found – domain may not accept email');

    const qualityScore = data.quality_score || 0;
    let riskScore = 0;
    if (!isValid) riskScore += 40;
    if (isDisposable) riskScore += 25;
    if (deliverability === 'UNDELIVERABLE') riskScore += 20;
    if (!isMXFound) riskScore += 15;
    riskScore = Math.min(100, riskScore + (1 - qualityScore) * 20);

    return {
      valid: isValid,
      isDisposable,
      isFreeProvider,
      deliverability: deliverability as 'DELIVERABLE' | 'RISKY' | 'UNDELIVERABLE' | 'UNKNOWN',
      qualityScore,
      isSMTPValid: data.is_smtp_valid?.value === true || false,
      isMXFound,
      riskScore,
      reasons,
    };
  } catch (err) {
    console.error('[ABSTRACT-EMAIL] Request failed:', err);
    return null;
  }
}
