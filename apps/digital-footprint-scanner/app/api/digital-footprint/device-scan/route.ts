// app/api/digital-footprint/device-scan/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { userAgent, language, platform, cookieEnabled, doNotTrack, connectionType, screenResolution, timezone } = body;

  // Simple scoring logic
  let score = 0;
  const issues: string[] = [];

  // 1. Browser version (simplified – check if outdated)
  const ua = userAgent || '';
  const isChrome = ua.includes('Chrome/');
  const isFirefox = ua.includes('Firefox/');
  const isSafari = ua.includes('Safari/') && !ua.includes('Chrome/');
  // No easy version check without parsing – we'll skip for now.

  // 2. Cookie disabled
  if (!cookieEnabled) {
    score += 15;
    issues.push('Cookies disabled – some security features may be unavailable');
  }

  // 3. Do Not Track not enabled
  if (doNotTrack !== '1') {
    score += 10;
    issues.push('Do Not Track not enabled – you may be tracked more easily');
  }

  // 4. Slow connection (3G or slower)
  if (connectionType === 'slow-2g' || connectionType === '2g' || connectionType === '3g') {
    score += 10;
    issues.push('Slow network connection – may indicate unstable environment');
  }

  // 5. Screen resolution too low (older device)
  const [width, height] = (screenResolution || '0x0').split('x').map(Number);
  if (width < 1024 || height < 768) {
    score += 10;
    issues.push('Low screen resolution – may be an older or unsupported device');
  }

  // 6. Suspicious timezone (e.g., VPN)
  const saTimezones = ['Africa/Johannesburg', 'Africa/Maputo', 'Africa/Harare', 'Africa/Gaborone'];
  if (!saTimezones.includes(timezone)) {
    score += 15;
    issues.push(`Timezone ${timezone} not typical for South Africa – may indicate VPN/proxy`);
  }

  // Cap at 100
  score = Math.min(100, score);

  const riskLevel = score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low';

  return NextResponse.json({
    score,
    riskLevel,
    issues,
    recommendation: score >= 70 ? 'Update your browser, enable cookies, and disable VPN for this site.' :
                   score >= 40 ? 'Consider improving your device security settings.' :
                   'Your device security looks good.',
  });
}
