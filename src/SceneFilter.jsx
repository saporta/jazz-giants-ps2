import { EffectComposer, Noise, BrightnessContrast, Vignette } from "@react-three/postprocessing";
import { BlendFunction, VignetteTechnique } from "postprocessing";

export function SceneFilter() {
  return (
    <EffectComposer>
      <Noise opacity={0.55} blendFunction={BlendFunction.OVERLAY} />
      <BrightnessContrast brightness={0} contrast={0.3} />
      <Vignette offset={0.3} darkness={0.65} technique={VignetteTechnique.DEFAULT} />
    </EffectComposer>
  );
}
