import React from 'react';
import { PocNavigation } from '@/components/custom/poc-navigation';

export default function PocPagesLayout({ // Renamed to avoid conflict if app/poc/ui/layout.tsx is also named PocLayout
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PocNavigation />
      <main className="flex-grow"> {/* Added flex-grow for better layout if you have footers */}
        {children}
      </main>
    </>
  );
}
