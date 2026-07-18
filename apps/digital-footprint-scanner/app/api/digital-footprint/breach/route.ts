import { checkEmailBreaches } from '@/app/services/hibp';
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  if (!email) return new Response('Email required', { status: 400 });
  const data = await checkEmailBreaches(email);
  return Response.json(data);
}
