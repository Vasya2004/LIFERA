'use client';

import { useEffect, useState } from 'react';
import { Bebas_Neue } from 'next/font/google';
import { Moon, Sun } from 'lucide-react';
import './vaultera.css';

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const THEME_KEY = 'vaultera-theme';

export default function VaulteraLayout({ children }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') setTheme(saved);
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
  }

  return (
    <div className={`vaultera-scope ${theme} ${bebas.variable}`}>
      <div className="mx-auto min-h-full w-full max-w-[90rem] px-3 py-4 sm:px-5 sm:py-5 lg:px-8 lg:py-8 xl:px-10">
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Переключить тему"
            className="rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
