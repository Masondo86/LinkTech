export async function validateEmail(email: string) {
  const apiKey = process.env.ABSTRACT_API_KEY;
  const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`;
  const res = await fetch(url);
  const data = await res.json();
  return {
    is_valid: data.is_valid_format?.value === true,
    deliverability: data.deliverability,
    free_provider: data.is_free_provider?.value,
  };
}
