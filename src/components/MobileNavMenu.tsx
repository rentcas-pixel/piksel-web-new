'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** Bendras mobilus hamburger meniu – tas pats išdėstymas, struktūra ir tekstai visur */
export default function MobileNavMenu({
  isOpen,
  onClose,
  newsCount = 0,
  topOffset = 56,
}: {
  isOpen: boolean;
  onClose: () => void;
  newsCount?: number;
  topOffset?: number;
}) {
  const pathname = usePathname();

  if (!isOpen) return null;

  const linkClass = (path: string) => {
    const isActive =
      path === '/'
        ? pathname === '/'
        : path === '/naujienos'
          ? pathname === '/naujienos' || pathname.startsWith('/naujienos/')
          : path === '/klipai-mobile'
            ? pathname === '/klipai-mobile' || pathname === '/klipai'
            : path === '/duk-mobile'
              ? pathname === '/duk-mobile' || pathname === '/duk'
              : pathname === path || pathname.startsWith(path + '/');
    return `px-4 py-3 text-base font-medium rounded-lg flex items-center gap-2 ${
      isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
    }`;
  };

  return (
    <>
      <div
        className="fixed bg-black/30 z-40"
        style={{ top: topOffset, left: 0, right: 0, bottom: 0 }}
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed bg-white z-50 py-4 px-4 shadow-lg border-b border-gray-200"
        style={{ top: topOffset, left: 0, right: 0 }}
      >
        <nav className="flex flex-col gap-1">
          <Link href="/" className={linkClass('/')} onClick={onClose}>
            Ekranai
          </Link>
          <Link href="/naujienos" className={linkClass('/naujienos')} onClick={onClose}>
            Naujienos
            {newsCount > 0 && (
              <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                {newsCount}
              </span>
            )}
          </Link>
          <Link href="/klipai-mobile" className={linkClass('/klipai-mobile')} onClick={onClose}>
            Klipai
          </Link>
          <Link href="/duk-mobile" className={linkClass('/duk-mobile')} onClick={onClose}>
            DUK
          </Link>
        </nav>
      </div>
    </>
  );
}
