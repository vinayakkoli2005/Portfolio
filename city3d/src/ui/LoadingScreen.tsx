import { useProgress } from '@react-three/drei';
import { useStore } from '../state/useStore';

export function LoadingScreen() {
  const loaded = useStore((s) => s.loaded);
  const { progress } = useProgress();

  if (loaded) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0D0D0D',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        fontFamily: 'serif',
        color: '#f0e6d3',
      }}
    >
      {/* Title */}
      <h1
        style={{
          fontSize: '2.4rem',
          fontWeight: 400,
          letterSpacing: '0.18em',
          color: '#c0392b',
          margin: '0 0 0.25rem',
          textShadow: '0 0 24px #8B0000',
        }}
      >
        VINAYAK KOLI
      </h1>
      <p
        style={{
          margin: '0 0 3rem',
          fontSize: '0.85rem',
          color: '#7a6a5a',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}
      >
        An Ancient Indian City
      </p>

      {/* Progress bar */}
      <div
        style={{
          width: '280px',
          height: '2px',
          background: '#1a1008',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.round(progress)}%`,
            background: 'linear-gradient(90deg, #8B0000, #c0392b)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <p
        style={{
          marginTop: '0.75rem',
          fontSize: '0.72rem',
          color: '#555',
          letterSpacing: '0.1em',
        }}
      >
        {Math.round(progress)}%
      </p>
    </div>
  );
}
