import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing';
import { useStore } from '../state/useStore';

// ToneMappingMode.ACES_FILMIC = 4 (avoids direct postprocessing import)
const ACES_FILMIC = 4;

export function PostFX() {
  const tier = useStore((s) => s.qualityTier);

  if (tier === 'lite') return null;

  if (tier === 'medium') {
    return (
      <EffectComposer>
        <Vignette eskil={false} offset={0.3} darkness={0.45} />
      </EffectComposer>
    );
  }

  // high: full Raji color grade
  return (
    <EffectComposer>
      <Bloom intensity={0.6} luminanceThreshold={0.7} luminanceSmoothing={0.3} />
      <Vignette eskil={false} offset={0.3} darkness={0.7} />
      <ToneMapping mode={ACES_FILMIC} />
    </EffectComposer>
  );
}
