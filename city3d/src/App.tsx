import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import { City } from './scene/City';
import { detectWebGL, detectTier } from './ui/webgl';
import { useStore } from './state/useStore';
import { InfoPanel } from './ui/InfoPanel';
import { JourneyCaption } from './ui/JourneyCaption';
import { HUD } from './ui/HUD';
import { SkipResumeModal } from './ui/SkipResumeModal';
import { LoadingScreen } from './ui/LoadingScreen';

export default function App() {
  const [supported, setSupported] = useState(true);
  const setQualityTier = useStore((s) => s.setQualityTier);
  const setLoaded = useStore((s) => s.setLoaded);

  useEffect(() => {
    setSupported(detectWebGL());
    setQualityTier(detectTier());
  }, [setQualityTier]);

  if (!supported) {
    return (
      <div style={{ color: '#fff', background: '#0D0D0D', padding: 40, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
        <h1>Vinayak Koli</h1>
        <p>Your device can't render the 3D city.</p>
        <a style={{ color: '#8B0000' }} href="../index.html">View the standard portfolio →</a>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0D0D0D' }}>
      <Canvas
        shadows
        camera={{ position: [0, 5, 55], fov: 60 }}
        dpr={[1, 2]}
        onCreated={() => setLoaded(true)}
      >
        <Suspense fallback={null}>
          <City />
        </Suspense>
      </Canvas>
      <LoadingScreen />
      <HUD />
      <InfoPanel />
      <JourneyCaption />
      <SkipResumeModal />
    </div>
  );
}
