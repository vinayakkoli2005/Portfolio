import { useStore } from '../state/useStore';

const btnBase: React.CSSProperties = {
  background: 'rgba(13,13,13,0.85)',
  border: '1px solid #8B0000',
  color: '#f0e6d3',
  fontFamily: 'monospace',
  fontSize: '0.75rem',
  padding: '0.35rem 0.8rem',
  borderRadius: '4px',
  cursor: 'pointer',
  letterSpacing: '0.06em',
  backdropFilter: 'blur(6px)',
};

export function HUD() {
  const cameraMode = useStore((s) => s.cameraMode);
  const toggleCamera = useStore((s) => s.toggleCamera);
  const setShowSkipModal = useStore((s) => s.setShowSkipModal);

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        display: 'flex',
        gap: '0.5rem',
        zIndex: 30,
        pointerEvents: 'auto',
      }}
    >
      <button style={btnBase} onClick={toggleCamera}>
        {cameraMode === 'third' ? '1P View [V]' : '3P View [V]'}
      </button>
      <button
        style={{ ...btnBase, borderColor: '#c0392b', color: '#c0392b' }}
        onClick={() => setShowSkipModal(true)}
      >
        Skip → Resume
      </button>
    </div>
  );
}
