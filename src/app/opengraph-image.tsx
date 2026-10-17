import { ImageResponse } from 'next/og';
import { LANGUAGE_VERSION } from '@/lib/site';

export const alt = 'RequestScript: send a script, get JSON back';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const script = ['request Forecast {', '    const weather: com.example.Weather', '    const t = weather.temperature(city: "Oslo")', '    return { city: "Oslo", celsius: t.value }', '}'];

/** The shared social card, used by every page that doesn't define its own. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#e8e3eb',
          color: '#2a2430',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width="64" height="64" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="8" fill="#8b3f7f" />
            <path d="M9 10.5 15 16l-6 5.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="17" y="20" width="7" height="3" rx="1.5" fill="#fff" />
          </svg>
          <span style={{ fontSize: 40, fontWeight: 700 }}>RequestScript</span>
          <span style={{ marginLeft: 'auto', fontSize: 28, color: '#5f5867' }}>v{LANGUAGE_VERSION}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>
          <span>Send a script.</span>
          <span style={{ color: '#7c3571' }}>Get JSON back.</span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '24px 32px',
            borderRadius: 20,
            background: '#27232c',
            color: '#e8e3eb',
            fontFamily: 'monospace',
            fontSize: 26,
          }}
        >
          {script.map((line) => (
            <span key={line} style={{ paddingLeft: line.startsWith(' ') ? 40 : 0 }}>
              {line.trim()}
            </span>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
