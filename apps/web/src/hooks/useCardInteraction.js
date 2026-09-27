'use client';

import { useEffect, useState } from 'react';

/** True when primary input is touch (no hover). */
export function useTouchUi() {
  const [touchUi, setTouchUi] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    const update = () => setTouchUi(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  return touchUi;
}

/** Hover on desktop, tap-to-toggle on mobile. */
export function useCardInteraction() {
  const touchUi = useTouchUi();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!touchUi || !active) return undefined;

    const onKey = (event) => {
      if (event.key === 'Escape') setActive(false);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [touchUi, active]);

  return {
    touchUi,
    active,
    setActive,
    close: () => setActive(false),
    open: () => setActive(true),
    toggle: () => setActive((value) => !value),
    bindCard: touchUi
      ? {}
      : {
          onMouseEnter: () => setActive(true),
          onMouseLeave: () => setActive(false),
        },
  };
}
