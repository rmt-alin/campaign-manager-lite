'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/campaigns', label: 'Campaigns' },
  { href: '/dashboard', label: 'Dashboard' },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="nav">
      {LINKS.map(({ href, label }) => (
        <Link key={href} href={href} className={pathname.startsWith(href) ? 'nav-link active' : 'nav-link'}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
