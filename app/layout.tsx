import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Nav } from '../components/Nav';
import './globals.css';

export const metadata: Metadata = {
  title: 'Campaign Manager Lite',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <span className="brand">Campaign Manager</span>
          <Nav />
        </header>
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
