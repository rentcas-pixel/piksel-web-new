import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CustomUrlScreenNotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-14 md:pt-0 ml-0 md:ml-80 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-2 h-2 bg-[#bcf715] shrink-0" />
          <span className="text-xs font-semibold tracking-[0.2em] text-[#bcf715] uppercase">
            PIKSEL
          </span>
        </div>
        <h1 className="text-3xl font-extrabold mb-3">Ekranas nerastas</h1>
        <p className="text-white/55 mb-8 leading-relaxed">
          Šis LED ekranas neegzistuoja arba nebėra aktyvus tinkle. Peržiūrėkite visus ekranus
          interaktyviame žemėlapyje.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#bcf715] text-[#141414] font-bold text-sm tracking-wide uppercase px-6 py-3.5 hover:bg-[#d4ff4d] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Grįžti į žemėlapį
        </Link>
      </div>
    </div>
  );
}
