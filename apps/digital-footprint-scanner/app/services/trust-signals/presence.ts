// app/services/trust-signals/presence.ts

import { PresenceSignal, PresenceResponse } from '@/app/lib/trust-signals/types';
import { PLATFORMS, Platform } from '@/app/lib/trust-signals/presence-platforms';

const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const cache = new Map<string, { timestamp: number; signals: PresenceSignal[] }>();

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number = 3000): Promise<Response> {
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

/**
 * Check a username across all (or a subset of) platforms.
 */
export async function checkPresence(
  username: string,
  platforms?: string[]
): Promise<PresenceResponse> {
  const cacheKey = `${username}:${platforms?.join(',') || 'all'}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return {
      username,
      signals: cached.signals,
      foundCount: cached.signals.filter(s => s.found).length,
      checkedCount: cached.signals.length,
    };
  }

  const platformList = platforms
    ? PLATFORMS.filter(p => platforms.includes(p.name))
    : PLATFORMS;

  const signals: PresenceSignal[] = [];

  // Check each platform concurrently
  const checks = platformList.map((platform) => checkPlatform(username, platform));
  const results = await Promise.allSettled(checks);

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.status === 'fulfilled') {
      signals.push(result.value);
    } else {
      // If a platform fails, add a signal with error
      signals.push({
        platform: platformList[i].name,
        found: false,
        confidence: 0,
        error: result.reason?.message || 'Request failed',
      });
    }
  }

  // Store in cache
  cache.set(cacheKey, { timestamp: Date.now(), signals });

  return {
    username,
    signals,
    foundCount: signals.filter(s => s.found).length,
    checkedCount: signals.length,
  };
}

/**
 * Check a single platform for a username.
 */
async function checkPlatform(username: string, platform: Platform): Promise<PresenceSignal> {
  const url = platform.urlPattern(username);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), platform.timeout || 3000);

  try {
    const response = await fetch(url, {
      method: platform.method || 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TheLinkDigital/1.0)',
      },
    });

    clearTimeout(timeout);

    let found = false;
    let confidence = 0;

    if (response.status === 200) {
      found = true;
      confidence = 95;
    } else if (response.status === 404) {
      found = false;
      confidence = 90;
    } else if (response.status >= 300 && response.status < 400) {
      const finalUrl = response.url;
      if (finalUrl.includes('/login') || finalUrl.includes('/search')) {
        found = false;
        confidence = 60;
      } else {
        found = false;
        confidence = 40;
      }
    } else {
      found = false;
      confidence = 0;
    }

    return {
      platform: platform.name,
      found,
      confidence,
      profileUrl: found ? url : undefined,
    };
  } catch (err) {
    clearTimeout(timeout);
    return {
      platform: platform.name,
      found: false,
      confidence: 0,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}