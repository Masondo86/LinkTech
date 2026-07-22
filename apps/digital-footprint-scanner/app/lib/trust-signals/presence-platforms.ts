// app/lib/trust-signals/presence-platforms.ts

export interface Platform {
  name: string;
  displayName: string;
  urlPattern: (username: string) => string;
  method?: 'HEAD' | 'GET'; // default HEAD
  timeout?: number; // ms, default 3000
}

export const PLATFORMS: Platform[] = [
  // Professional
  {
    name: 'github',
    displayName: 'GitHub',
    urlPattern: (u) => `https://github.com/${u}`,
  },
  {
    name: 'linkedin',
    displayName: 'LinkedIn',
    urlPattern: (u) => `https://linkedin.com/in/${u}`,
  },
  {
    name: 'gitlab',
    displayName: 'GitLab',
    urlPattern: (u) => `https://gitlab.com/${u}`,
  },
  {
    name: 'behance',
    displayName: 'Behance',
    urlPattern: (u) => `https://behance.net/${u}`,
  },
  {
    name: 'medium',
    displayName: 'Medium',
    urlPattern: (u) => `https://medium.com/@${u}`,
  },
  // General
  {
    name: 'facebook',
    displayName: 'Facebook',
    urlPattern: (u) => `https://facebook.com/${u}`,
  },
  {
    name: 'instagram',
    displayName: 'Instagram',
    urlPattern: (u) => `https://instagram.com/${u}`,
  },
  {
    name: 'twitter',
    displayName: 'X (Twitter)',
    urlPattern: (u) => `https://twitter.com/${u}`,
  },
  {
    name: 'reddit',
    displayName: 'Reddit',
    urlPattern: (u) => `https://reddit.com/user/${u}`,
  },
  {
    name: 'pinterest',
    displayName: 'Pinterest',
    urlPattern: (u) => `https://pinterest.com/${u}`,
  },
  // Business
  {
    name: 'trustpilot',
    displayName: 'Trustpilot',
    urlPattern: (u) => `https://trustpilot.com/review/${u}`,
  },
  // Note: Google Business and Crunchbase require more complex lookups – we'll add them later
];
