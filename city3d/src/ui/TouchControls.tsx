import { useEffect, useRef } from 'react';
import { keys, touchState } from '../player/inputState';

const STICK_SIZE = 80;
const DEAD_ZONE = 6;

type StickState = { active: boolean; id: number; startX: number; startY: number; dx: number; dy: number };

function makeStick(): StickState {
  return { active: false, id: -1, startX: 0, startY: 0, dx: 0, dy: 0 };
}


export function TouchControls() {
  const leftStick = useRef<StickState>(makeStick());
  const rightStick = useRef<StickState>(makeStick());
  const leftKnob = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const rightKnob = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const leftEl = useRef<HTMLDivElement>(null);
  const rightEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if touch device
    if (!('ontouchstart' in window)) return;

    function clearKeys() {
      keys['KeyW'] = false;
      keys['KeyS'] = false;
      keys['KeyA'] = false;
      keys['KeyD'] = false;
    }

    function updateLeft(dx: number, dy: number) {
      const magnitude = Math.sqrt(dx * dx + dy * dy);
      clearKeys();
      if (magnitude > DEAD_ZONE) {
        if (dy < -DEAD_ZONE) keys['KeyW'] = true;
        if (dy > DEAD_ZONE) keys['KeyS'] = true;
        if (dx < -DEAD_ZONE) keys['KeyA'] = true;
        if (dx > DEAD_ZONE) keys['KeyD'] = true;
      }
      if (leftEl.current) {
        leftKnob.current = { dx, dy };
        updateKnobDOM(leftEl.current, dx, dy);
      }
    }

    function updateRight(dx: number, dy: number) {
      if (Math.abs(dx) > DEAD_ZONE) {
        touchState.yawDelta += dx * 0.004;
      }
      if (rightEl.current) {
        rightKnob.current = { dx, dy };
        updateKnobDOM(rightEl.current, dx, dy);
      }
    }

    function updateKnobDOM(el: HTMLDivElement, dx: number, dy: number) {
      const knob = el.querySelector('.knob') as HTMLElement | null;
      if (!knob) return;
      const max = STICK_SIZE / 2 - 14;
      const cx = Math.max(-max, Math.min(max, dx));
      const cy = Math.max(-max, Math.min(max, dy));
      knob.style.transform = `translate(calc(-50% + ${cx}px), calc(-50% + ${cy}px))`;
    }

    function onTouchStart(e: TouchEvent) {
      for (const touch of Array.from(e.changedTouches)) {
        const el = e.currentTarget as HTMLElement;
        const rect = el.getBoundingClientRect();
        const isLeft = el === leftEl.current;
        const stick = isLeft ? leftStick.current : rightStick.current;
        if (!stick.active) {
          stick.active = true;
          stick.id = touch.identifier;
          stick.startX = touch.clientX - rect.left;
          stick.startY = touch.clientY - rect.top;
        }
      }
    }

    function onTouchMove(e: TouchEvent) {
      for (const touch of Array.from(e.changedTouches)) {
        const el = e.currentTarget as HTMLElement;
        const isLeft = el === leftEl.current;
        const stick = isLeft ? leftStick.current : rightStick.current;
        if (stick.active && stick.id === touch.identifier) {
          const rect = el.getBoundingClientRect();
          const x = touch.clientX - rect.left;
          const y = touch.clientY - rect.top;
          const dx = x - stick.startX;
          const dy = y - stick.startY;
          if (isLeft) updateLeft(dx, dy);
          else updateRight(dx, dy);
        }
      }
    }

    function onTouchEnd(e: TouchEvent) {
      for (const touch of Array.from(e.changedTouches)) {
        const el = e.currentTarget as HTMLElement;
        const isLeft = el === leftEl.current;
        const stick = isLeft ? leftStick.current : rightStick.current;
        if (stick.id === touch.identifier) {
          stick.active = false;
          stick.id = -1;
          if (isLeft) updateLeft(0, 0);
          else updateRight(0, 0);
        }
      }
    }

    const leftNode = leftEl.current;
    const rightNode = rightEl.current;
    if (!leftNode || !rightNode) return;

    leftNode.addEventListener('touchstart', onTouchStart, { passive: true });
    leftNode.addEventListener('touchmove', onTouchMove, { passive: true });
    leftNode.addEventListener('touchend', onTouchEnd, { passive: true });
    rightNode.addEventListener('touchstart', onTouchStart, { passive: true });
    rightNode.addEventListener('touchmove', onTouchMove, { passive: true });
    rightNode.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      leftNode.removeEventListener('touchstart', onTouchStart);
      leftNode.removeEventListener('touchmove', onTouchMove);
      leftNode.removeEventListener('touchend', onTouchEnd);
      rightNode.removeEventListener('touchstart', onTouchStart);
      rightNode.removeEventListener('touchmove', onTouchMove);
      rightNode.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2.5rem',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 2rem',
        pointerEvents: 'auto',
        zIndex: 15,
      }}
    >
      <div ref={leftEl} style={{ width: STICK_SIZE, height: STICK_SIZE, borderRadius: '50%', background: 'rgba(139,0,0,0.18)', border: '1.5px solid rgba(139,0,0,0.5)', position: 'relative', touchAction: 'none', userSelect: 'none' }}>
        <div className="knob" style={{ position: 'absolute', width: 28, height: 28, borderRadius: '50%', background: 'rgba(192,57,43,0.7)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />
      </div>
      <div ref={rightEl} style={{ width: STICK_SIZE, height: STICK_SIZE, borderRadius: '50%', background: 'rgba(139,0,0,0.18)', border: '1.5px solid rgba(139,0,0,0.5)', position: 'relative', touchAction: 'none', userSelect: 'none' }}>
        <div className="knob" style={{ position: 'absolute', width: 28, height: 28, borderRadius: '50%', background: 'rgba(192,57,43,0.7)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
}
