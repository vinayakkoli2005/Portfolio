// Shared mutable input state — written by keyboard and touch; read by PlayerController useFrame
export const keys: Record<string, boolean> = {};

// Touch yaw delta — written by right stick each frame, read + cleared by PlayerController
export const touchState = {
  yawDelta: 0,
};
