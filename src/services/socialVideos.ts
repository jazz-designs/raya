/**
 * Social Reels & Videos Service
 * Automatically detects and dynamically imports all video files in assets/videos/
 * Any new video added to assets/videos/ will be picked up automatically.
 */

// Vite import.meta.glob will bundle/resolve all video files in assets/videos
const videoModules = import.meta.glob<{ default: string } | string>(
  '../../assets/videos/*.{mp4,webm,mov,MP4,WEBM,MOV}',
  { eager: true }
);

// Fallback in case path resolution differs
const fallbackModules = import.meta.glob<{ default: string } | string>(
  '/assets/videos/*.{mp4,webm,mov,MP4,WEBM,MOV}',
  { eager: true }
);

const allModules = Object.keys(videoModules).length > 0 ? videoModules : fallbackModules;

export interface SocialVideoItem {
  id: string;
  url: string;
  caption?: string;
  handle: string;
}

export const INSTAGRAM_HANDLE = '@raya_.jewels';
export const INSTAGRAM_URL = 'https://www.instagram.com/raya_.jewels/';

// Extract resolved URLs from glob modules
export const ALL_SOCIAL_VIDEOS: SocialVideoItem[] = Object.entries(allModules)
  .map(([path, mod], index) => {
    const url = typeof mod === 'string' ? mod : (mod as { default: string }).default || '';
    const filename = path.split('/').pop()?.split('.')[0] || `video-${index + 1}`;
    return {
      id: filename,
      url,
      handle: INSTAGRAM_HANDLE,
      caption: 'Sparkle in real motion ✨ #rayajewels #antitarnish',
    };
  })
  .filter((item) => Boolean(item.url));

/**
 * Deterministic pseudo-random number generator from a string seed.
 * Ensures the same 5 videos are shown consistently for a given product
 * throughout the user's session, avoiding unwanted re-shuffle on state updates.
 */
function seededRandom(seedStr: string): () => number {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  let seed = Math.abs(hash) || 123456789;
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

/**
 * Returns up to maxCount (default 5) random videos for a given product.
 * Automatically adapts if there are more or fewer videos in assets/videos/.
 */
export function getProductSocialVideos(productId: string, maxCount = 5): SocialVideoItem[] {
  if (ALL_SOCIAL_VIDEOS.length <= maxCount) {
    return [...ALL_SOCIAL_VIDEOS];
  }

  // Shuffle using seeded random so it remains stable for this product
  const rng = seededRandom(productId || 'default-seed');
  const shuffled = [...ALL_SOCIAL_VIDEOS];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, maxCount);
}
