import { useStore } from '../state/useStore';
import { content } from '../data/content';

const panelStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '2rem',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(13,13,13,0.92)',
  border: '1px solid #8B0000',
  borderRadius: '6px',
  padding: '1.25rem 1.75rem',
  color: '#f0e6d3',
  fontFamily: 'serif',
  maxWidth: '480px',
  width: '90vw',
  backdropFilter: 'blur(8px)',
  zIndex: 10,
  pointerEvents: 'auto',
};

const titleStyle: React.CSSProperties = {
  color: '#c0392b',
  fontSize: '1rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: '0.5rem',
};

const hintStyle: React.CSSProperties = {
  color: '#888',
  fontSize: '0.72rem',
  marginTop: '0.75rem',
};

function GatewayPanel() {
  return (
    <>
      <div style={titleStyle}>Grand Gateway — Welcome</div>
      <p style={{ margin: 0 }}>{content.hero.tagline}</p>
      <p style={{ margin: '0.4rem 0 0', fontSize: '0.85rem', color: '#b0a090' }}>
        {content.about}
      </p>
    </>
  );
}

function TemplePanel() {
  return (
    <>
      <div style={titleStyle}>Central Temple — Education</div>
      {content.education.map((e) => (
        <div key={e.institution} style={{ marginBottom: '0.4rem' }}>
          <strong>{e.institution}</strong>
          <span style={{ color: '#b0a090', marginLeft: '0.5rem', fontSize: '0.88rem' }}>
            {e.detail} · {e.period}
          </span>
        </div>
      ))}
    </>
  );
}

function ArtisansPanel() {
  return (
    <>
      <div style={titleStyle}>Artisans' Quarter — Skills</div>
      {content.skills.map((g) => (
        <div key={g.category} style={{ marginBottom: '0.35rem' }}>
          <span style={{ color: '#c0392b', fontSize: '0.8rem', fontWeight: 600 }}>
            {g.category}:{' '}
          </span>
          <span style={{ fontSize: '0.88rem' }}>{g.items.join(', ')}</span>
        </div>
      ))}
    </>
  );
}

function ProjectsPanel() {
  return (
    <>
      <div style={titleStyle}>Project Shrines — Projects</div>
      {content.projects.map((p) => (
        <div key={p.id} style={{ marginBottom: '0.5rem' }}>
          <strong>{p.title}</strong>
          <span style={{ color: '#888', fontSize: '0.78rem', marginLeft: '0.5rem' }}>
            [{p.tech.join(', ')}]
          </span>
          <p style={{ margin: '0.15rem 0 0', fontSize: '0.84rem', color: '#b0a090' }}>
            {p.description}
          </p>
          {p.github && (
            <a
              href={p.github}
              target="_blank"
              rel="noreferrer"
              style={{ color: '#c0392b', fontSize: '0.78rem' }}
            >
              GitHub ↗
            </a>
          )}
        </div>
      ))}
    </>
  );
}

function ScriptoriumPanel() {
  return (
    <>
      <div style={titleStyle}>The Scriptorium — Writing</div>
      {content.essays.map((e) => (
        <div key={e.id} style={{ marginBottom: '0.4rem' }}>
          <a href={e.href} style={{ color: '#f0e6d3', fontWeight: 600, fontSize: '0.9rem' }}>
            {e.title}
          </a>
          <p style={{ margin: '0.1rem 0 0', fontSize: '0.82rem', color: '#b0a090' }}>
            {e.summary}
          </p>
        </div>
      ))}
    </>
  );
}

function GhatsPanel() {
  const c = content.contact;
  return (
    <>
      <div style={titleStyle}>The Ghats — Contact</div>
      <p style={{ margin: 0 }}>
        <a href={`mailto:${c.email}`} style={{ color: '#c0392b' }}>
          {c.email}
        </a>
      </p>
      <p style={{ margin: '0.3rem 0 0' }}>
        <a href={c.linkedin} target="_blank" rel="noreferrer" style={{ color: '#c0392b' }}>
          LinkedIn ↗
        </a>
        {' · '}
        <a href={c.github} target="_blank" rel="noreferrer" style={{ color: '#c0392b' }}>
          GitHub ↗
        </a>
      </p>
    </>
  );
}

function BellTowerPanel() {
  return (
    <>
      <div style={titleStyle}>Bell Tower — Resume</div>
      <p style={{ margin: 0, fontSize: '0.88rem', color: '#b0a090' }}>
        You've explored the whole city. Here's everything in one page.
      </p>
      <a
        href={content.resumeHref}
        target="_blank"
        rel="noreferrer"
        style={{
          display: 'inline-block',
          marginTop: '0.6rem',
          padding: '0.4rem 1rem',
          background: '#8B0000',
          color: '#f0e6d3',
          borderRadius: '4px',
          fontSize: '0.9rem',
          textDecoration: 'none',
        }}
      >
        Download Resume ↓
      </a>
    </>
  );
}

const PANELS: Record<string, React.ReactNode> = {
  gateway: <GatewayPanel />,
  temple: <TemplePanel />,
  artisans: <ArtisansPanel />,
  projects: <ProjectsPanel />,
  scriptorium: <ScriptoriumPanel />,
  ghats: <GhatsPanel />,
  belltower: <BellTowerPanel />,
};

export function InfoPanel() {
  const activeDistrict = useStore((s) => s.activeDistrict);
  if (!activeDistrict) return null;
  const panel = PANELS[activeDistrict];
  if (!panel) return null;

  return (
    <div style={panelStyle}>
      {panel}
      <p style={hintStyle}>Walk away to dismiss · E to interact</p>
    </div>
  );
}
