import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** The icon.svg mark as a PNG, for iOS home screens. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <svg width="180" height="180" viewBox="0 0 32 32">
        <rect width="32" height="32" fill="#8b3f7f" />
        <path d="M9 10.5 15 16l-6 5.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="17" y="20" width="7" height="3" rx="1.5" fill="#fff" />
      </svg>
    ),
    size,
  );
}
