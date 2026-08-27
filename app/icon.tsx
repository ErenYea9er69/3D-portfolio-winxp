import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(135deg, #3a6ea5 0%, #004e98 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
        }}
      >
        <svg viewBox="0 0 88 88" width="24" height="24">
          <path d="M1,1 L40,1 L35,40 L1,44 Z" fill="#F25022" />
          <path d="M45,1 L87,5 L87,40 L41,40 Z" fill="#7FBA00" />
          <path d="M1,48 L35,48 L40,87 L1,83 Z" fill="#00A4EF" />
          <path d="M41,48 L87,48 L83,87 L45,87 Z" fill="#FFB900" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
