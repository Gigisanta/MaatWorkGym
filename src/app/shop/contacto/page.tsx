'use client';

import { useState } from 'react';
import { Send, Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

export default function ContactoPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Nombre requerido';
    if (!form.email.trim() || !form.email.includes('@')) errs.email = 'Email requerido';
    if (!form.subject.trim()) errs.subject = 'Asunto requerido';
    if (!form.message.trim() || form.message.length < 10) errs.message = 'Mensaje muy corto';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    // In a real app, send to /api/contact
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Mail size={40} className="text-orange-400 mx-auto mb-4" />
          <h1 className="text-white text-4xl font-black mb-3">Contacto</h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            ¿Tenés alguna pregunta o necesitás ayuda? Estamos para vos.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-white text-xl font-black mb-6">Info de Contacto</h2>
              <div className="space-y-4">
                {[
                  { icon: <Mail size={18} />, label: 'Email', value: 'hola@sevjo.maat.work' },
                  { icon: <Phone size={18} />, label: 'Teléfono', value: '+54 9 11 0000 0000' },
                  { icon: <InstagramIcon size={18} />, label: 'Instagram', value: '@sevjo.supplements' },
                  { icon: <Clock size={18} />, label: 'Horario', value: 'Lun a Vie 9:00 - 18:00' },
                  { icon: <MapPin size={18} />, label: 'Ubicación', value: 'Buenos Aires, Argentina' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl border border-gray-800">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">{item.label}</p>
                      <p className="text-white text-sm font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl">
              <MessageCircle size={24} className="text-orange-400 mb-3" />
              <h3 className="text-white font-bold mb-2">¿Prefers WhatsApp?</h3>
              <p className="text-gray-400 text-sm mb-3">
                Escríbenos directamente y te respondemos al toque.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-bold text-sm rounded-xl hover:bg-green-500 transition-colors"
              >
                <MessageCircle size={16} />
                Abrir WhatsApp
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Send size={28} className="text-green-400" />
                </div>
                <h2 className="text-white text-xl font-bold">¡Mensaje Enviado!</h2>
                <p className="text-gray-400 text-sm max-w-xs">
                  Te responderemos en menos de 24 horas. Gracias por contactarnos.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-5">
                <h2 className="text-white font-bold text-lg">Envianos un mensaje</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-xs font-medium mb-1 block">Nombre *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Tu nombre"
                      className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white text-sm focus:outline-none focus:ring-1 ${
                        errors.name ? 'border-red-500' : 'border-gray-700 focus:border-orange-500'
                      }`}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs font-medium mb-1 block">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="tu@email.com"
                      className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white text-sm focus:outline-none focus:ring-1 ${
                        errors.email ? 'border-red-500' : 'border-gray-700 focus:border-orange-500'
                      }`}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1 block">Asunto *</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="¿Sobre qué nos escribís?"
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white text-sm focus:outline-none focus:ring-1 ${
                      errors.subject ? 'border-red-500' : 'border-gray-700 focus:border-orange-500'
                    }`}
                  />
                  {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1 block">Mensaje *</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Contanos en qué podemos ayudarte..."
                    rows={5}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white text-sm focus:outline-none focus:ring-1 resize-none ${
                      errors.message ? 'border-red-500' : 'border-gray-700 focus:border-orange-500'
                    }`}
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-sm rounded-xl hover:from-orange-400 hover:to-red-500 transition-all shadow-xl shadow-orange-500/20"
                >
                  <Send size={16} />
                  Enviar Mensaje
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
