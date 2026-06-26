import { useEffect, useState } from 'react';
import { useStore } from '../state/useStore';
import { JOURNEY_CAPTIONS } from '../scene/journey';

export function JourneyCaption() {
  const journeyPhase = useStore((s) => s.journeyPhase);
  const [visible, setVisible] = useState(false);
  const [caption, setCaption] = useState('');

  useEffect(() => {
    const text = JOURNEY_CAPTIONS[journeyPhase];
    if (!text) return;
    setCaption(text);
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), 3500);
    return () => window.clearTimeout(t);
  }, [journeyPhase]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '18%',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#f0e6d3',
        fontFamily: 'serif',
        fontSize: '1.1rem',
        fontStyle: 'italic',
        textAlign: 'center',
        textShadow: '0 0 20px #8B0000, 0 2px 6px rgba(0,0,0,0.9)',
        letterSpacing: '0.04em',
        pointerEvents: 'none',
        zIndex: 20,
        maxWidth: '540px',
        width: '90vw',
        animation: 'fadeInOut 3.5s ease',
      }}
    >
      {caption}
      <style>{`
        @keyframes fadeInOut {
          0%   { opacity: 0; }
          15%  { opacity: 1; }
          75%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
