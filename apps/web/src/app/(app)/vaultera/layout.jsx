'use client';

import { Bebas_Neue } from 'next/font/google';
import { useVaulteraTheme } from '@/hooks/useVaulteraTheme';
import './vaultera.css';

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

export default function VaulteraLayout({ children }) {
  const { effectiveTheme } = useVaulteraTheme();

  return (
    <div className={`vaultera-scope ${effectiveTheme} ${bebas.variable}`}>
      <div className="mx-auto min-h-full w-full max-w-[90rem] px-3 py-4 sm:px-5 sm:py-5 lg:px-8 lg:py-8 xl:px-10">
        {children}
      </div>
    </div>
  );
}
