'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FIRST_DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const SECOND_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function RatingPicker({ value, onChange }) {
  const [step, setStep] = useState(null); // null | 'first' | 'second'
  const [firstDigit, setFirstDigit] = useState(null);

  const displayValue = value ? value.toFixed(1) : '—';

  function handleOpen() {
    setStep('first');
    setFirstDigit(null);
  }

  function handleFirstDigit(d) {
    if (d === 10) {
      onChange(10.0);
      setStep(null);
      return;
    }
    setFirstDigit(d);
    setStep('second');
  }

  function handleSecondDigit(d) {
    const rating = parseFloat(`${firstDigit}.${d}`);
    onChange(rating);
    setStep(null);
  }

  function handleClose() {
    setStep(null);
    setFirstDigit(null);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border hover:border-primary transition-colors"
      >
        <span className="font-bebas text-2xl text-primary leading-none">{displayValue}</span>
        <span className="text-xs text-muted-foreground">/ 10</span>
      </button>

      <AnimatePresence>
        {step && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-full mb-2 left-0 z-50 bg-card border border-border rounded-xl p-4 shadow-2xl"
            style={{ minWidth: 220 }}
          >
            <div className="mb-3 flex justify-end">
              <button type="button" onClick={handleClose} className="text-sm text-muted-foreground hover:text-foreground">✕</button>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {step === 'first' && FIRST_DIGITS.map(d => (
                <button
                  key={d}
                  onClick={() => handleFirstDigit(d)}
                  className="h-9 w-full rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors font-bebas text-lg leading-none"
                >
                  {d}
                </button>
              ))}

              {step === 'second' && SECOND_DIGITS.map(d => (
                <button
                  key={d}
                  onClick={() => handleSecondDigit(d)}
                  className="h-9 w-full rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors font-bebas text-lg leading-none"
                >
                  {d}
                </button>
              ))}
            </div>

            {step === 'second' && (
              <button
                onClick={() => setStep('first')}
                className="mt-3 text-xs text-muted-foreground hover:text-foreground w-full text-center"
              >
                ← назад
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
