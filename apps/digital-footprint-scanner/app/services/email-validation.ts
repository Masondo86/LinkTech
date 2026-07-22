// apps/digital-footprint-scanner/app/services/email-validation.ts

export interface EmailValidationResult {
  is_valid: boolean;
  deliverability: string;
  free_provider: boolean;
  disposable: boolean;
  mx_found: boolean;
  smtp_valid: boolean;
  quality_score: number;
}

export async function validateEmail(email: string): Promise<EmailValidationResult | null> {
  const apiKey = process.env.ABSTRACT_EMAIL_API_KEY;
  if (!apiKey) {
    console.warn('[Email Validation] No API key provided');
    return null;
  }

  try {
    const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error(`[Email Validation] HTTP error ${response.status}`);
      return null;
    }

    const data = await response.json();

    return {
      is_valid: data.is_valid_format?.value === true,
      deliverability: data.deliverability || 'UNKNOWN',
      free_provider: data.is_free_provider?.value === true,
      disposable: data.is_disposable_email?.value === true,
      mx_found: data.is_mx_found?.value === true,
      smtp_valid: data.is_smtp_valid?.value === true,
      quality_score: data.quality_score || 0,
    };
  } catch (err) {
    console.error('[Email Validation] Error:', err);
    return null;
  }
}
