import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Image
                src="/Piksel-logo-black-2023.png"
                alt="PIKSEL Logo"
                width={120}
                height={40}
                className="h-8 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-gray-300 mb-4">
              Profesionalūs LED ekranų reklamos sprendimai Lietuvoje. 
              Mes teikiame kokybiškas reklamos paslaugas naudodami moderniausią technologiją.
            </p>
            <div className="text-gray-300">
              <p>VIDEOARCHITEKTAI, UAB</p>
              <p>Ramybės g. 4-70, LT-02103, Vilnius</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Nuorodos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Pagrindinis
                </Link>
              </li>
              <li>
                <Link href="/paslaugos" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Paslaugos
                </Link>
              </li>
              <li>
                <Link href="/ekranai" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Ekranai
                </Link>
              </li>
              <li>
                <Link href="/kainos" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Kainos
                </Link>
              </li>
              <li>
                <Link href="/kontaktai" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Kontaktai
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontaktai</h4>
            <div className="space-y-2 text-gray-300">
              <p>
                <span className="font-medium">Telefonas:</span><br />
                +370 (690) 66633
              </p>
              <p>
                <span className="font-medium">El. paštas:</span><br />
                info@piksel.lt
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 PIKSEL. Visos teisės saugomos.</p>
        </div>
      </div>
    </footer>
  );
}
