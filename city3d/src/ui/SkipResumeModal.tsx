import { useStore } from '../state/useStore';
import { content } from '../data/content';

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.75)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 50,
  backdropFilter: 'blur(4px)',
};

const boxStyle: React.CSSProperties = {
  background: '#0D0D0D',
  border: '1px solid #8B0000',
  borderRadius: '8px',
  padding: '2.5rem 3rem',
  color: '#f0e6d3',
  fontFamily: 'serif',
  maxWidth: '420px',
  width: '90vw',
  textAlign: 'center',
};

const btnRow: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'center',
  marginTop: '1.75rem',
  flexWrap: 'wrap',
};

export function SkipResumeModal() {
  const show = useStore((s) => s.showSkipModal);
  const setShowSkipModal = useStore((s) => s.setShowSkipModal);

  if (!show) return null;

  return (
    <div style={overlayStyle} onClick={() => setShowSkipModal(false)}>
      <div style={boxStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.3rem', color: '#c0392b' }}>
          Vinayak Koli
        </h2>
        <p style={{ margin: '0 0 0.25rem', fontSize: '0.9rem', color: '#b0a090' }}>
          CS & Social Sciences · IIIT Delhi
        </p>
        <p style={{ margin: '0.75rem 0 0', fontSize: '0.88rem' }}>
          {content.hero.tagline}
        </p>

        <div style={btnRow}>
          <a
            href={content.resumeHref}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '0.5rem 1.4rem',
              background: '#8B0000',
              color: '#f0e6d3',
              borderRadius: '4px',
              fontSize: '0.9rem',
              textDecoration: 'none',
            }}
          >
            Download Resume ↓
          </a>
          <a
            href={content.contact.linkedin}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '0.5rem 1.4rem',
              border: '1px solid #8B0000',
              color: '#f0e6d3',
              borderRadius: '4px',
              fontSize: '0.9rem',
              textDecoration: 'none',
            }}
          >
            LinkedIn ↗
          </a>
          <a
            href={content.contact.github}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '0.5rem 1.4rem',
              border: '1px solid #555',
              color: '#b0a090',
              borderRadius: '4px',
              fontSize: '0.9rem',
              textDecoration: 'none',
            }}
          >
            GitHub ↗
          </a>
        </div>

        <button
          onClick={() => setShowSkipModal(false)}
          style={{
            marginTop: '1.25rem',
            background: 'none',
            border: 'none',
            color: '#555',
            cursor: 'pointer',
            fontSize: '0.8rem',
          }}
        >
          ✕ Back to exploring
        </button>
      </div>
    </div>
  );
}
