import React from 'react';

export default function PocPagesLayout({ // Renamed to avoid conflict if app/poc/ui/layout.tsx is also named PocLayout
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
