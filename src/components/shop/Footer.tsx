import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Shield, Truck, RotateCcw } from 'lucide-react';

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

function TwitterIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

export default function ShopFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-orange-500/30">
                S
              </div>
              <div>
                <span className="text-white font-bold text-lg tracking-tight">Sevjo</span>
                <span className="text-orange-400 font-bold text-lg tracking-tight"> Supplements</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Suplementos premium para atletas. Calidad laboratory-tested, entrega rapida en todo Argentina.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/sevjo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-orange-500/20 flex items-center justify-center text-gray-400 hover:text-orange-400 transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon size={16} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Tienda</h3>
            <ul className="space-y-3">
              {[
                { label: 'Todos los Productos', href: '/shop/tienda' },
                { label: 'Ofertas', href: '/shop/ofertas' },
                { label: 'Mi Cuenta', href: '/shop/cuenta' },
                { label: 'Wishlist', href: '/shop/wishlist' },
                { label: 'Panel Admin', href: '/main' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 text-sm hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Ayuda</h3>
            <ul className="space-y-3">
              {[
                { label: 'Preguntas Frecuentes', href: '/shop/faq' },
                { label: 'Contacto', href: '/shop/contacto' },
                { label: 'Politica de Devolucion', href: '#' },
                { label: 'Terminos y Condiciones', href: '#' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 text-sm hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Contacto</h3>
            <ul className="space-y-4">
              {[
                { icon: Mail, label: 'hola@sevjo.maat.work' },
                { icon: Phone, label: '+54 9 11 0000 0000' },
                { icon: MapPin, label: 'Buenos Aires, Argentina' },
                { icon: Clock, label: 'Lun a Vie 9:00 - 18:00' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <item.icon size={15} className="text-orange-400 mt-0.5 shrink-0" />
                  <span className="text-gray-400 text-sm">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: 'Envio Gratis +$75.000', desc: 'A todo Argentina' },
              { icon: Shield, title: 'Productos 100% Originales', desc: 'Laboratory tested' },
              { icon: RotateCcw, title: '30 Dias de Garantia', desc: 'Devolucion sin costo' },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-3 justify-center sm:justify-start">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                  <badge.icon size={18} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-white text-xs font-bold">{badge.title}</p>
                  <p className="text-gray-500 text-xs">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-xs">
            &copy; {currentYear} Sevjo Supplements. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-gray-600 text-xs">Todos los sistemas operativos</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
