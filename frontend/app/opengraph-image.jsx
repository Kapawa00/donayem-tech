import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'DONAYEM TECH — Agence Digitale à Douala, Cameroun';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#050A22',
          backgroundImage: 'radial-gradient(circle at 25% 20%, #0D1B56 0%, #050A22 60%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 22, height: 22, backgroundColor: '#D4A336' }} />
          <div style={{ display: 'flex', fontSize: 72, fontWeight: 800, color: '#ffffff', letterSpacing: -1 }}>
            DONAYEM<span style={{ color: '#D4A336' }}>&nbsp;TECH</span>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontSize: 30,
            color: '#D4A336',
            letterSpacing: 6,
            textTransform: 'uppercase',
          }}
        >
          Agence digitale à Douala
        </div>
      </div>
    ),
    { ...size }
  );
}
