'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isExcludedRoute = pathname.startsWith('/admin') || pathname.startsWith('/login');

  if (isExcludedRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div className="flex-grow-1">
        {children}
      </div>
      <Footer />
    </>
  );
}
