'use client';

import { useState, useEffect, useCallback } from 'react';
import { Settings, Loader2, Check, AlertCircle, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ConfigValues {
  storeName: string;
  storeLogo: string;
  welcomeMessage: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  shippingCost: string;
  freeShippingThreshold: string;
  taxRate: string;
}

interface SectionStatus {
  [key: string]: 'idle' | 'saving' | 'saved' | 'error';
}

const INITIAL_CONFIG: ConfigValues = {
  storeName: '',
  storeLogo: '',
  welcomeMessage: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  shippingCost: '0',
  freeShippingThreshold: '0',
  taxRate: '0.21',
};

export default function EcommerceConfigPage() {
  const [config, setConfig] = useState<ConfigValues>(INITIAL_CONFIG);
  const [sectionStatus, setSectionStatus] = useState<SectionStatus>({});
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load config on mount
  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch('/api/ecommerce/config');
        if (res.ok) {
          const data = await res.json();
          setConfig({
            storeName: data.storeName || '',
            storeLogo: data.storeLogo || '',
            welcomeMessage: data.welcomeMessage || '',
            contactEmail: data.contactEmail || '',
            contactPhone: data.contactPhone || '',
            address: data.address || '',
            shippingCost: data.shippingCost ?? '0',
            freeShippingThreshold: data.freeShippingThreshold ?? '0',
            taxRate: data.taxRate ?? '0.21',
          });
        }
      } catch (error) {
        console.error('Error loading config:', error);
        showNotification('error', 'Error al cargar la configuración');
      } finally {
        setIsLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const saveField = useCallback(async (key: keyof ConfigValues, value: string) => {
    const section = getSectionForField(key);
    setSectionStatus(prev => ({ ...prev, [section]: 'saving' }));

    try {
      const res = await fetch('/api/ecommerce/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });

      if (!res.ok) throw new Error('Save failed');

      setSectionStatus(prev => ({ ...prev, [section]: 'saved' }));
      showNotification('success', 'Configuración guardada');

      setTimeout(() => {
        setSectionStatus(prev => ({ ...prev, [section]: 'idle' }));
      }, 2000);
    } catch (error) {
      console.error('Error saving config:', error);
      setSectionStatus(prev => ({ ...prev, [section]: 'error' }));
      showNotification('error', 'Error al guardar');
      setTimeout(() => {
        setSectionStatus(prev => ({ ...prev, [section]: 'idle' }));
      }, 2000);
    }
  }, [showNotification]);

  const handleInputChange = (key: keyof ConfigValues, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleInputBlur = (key: keyof ConfigValues) => {
    saveField(key, config[key]);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-w-0 relative overflow-hidden h-full bg-background">
        <div className="flex items-center justify-center flex-1">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Cargando configuración...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-w-0 relative overflow-hidden h-full bg-background">
      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-8 py-4 flex flex-col lg:flex-row items-center justify-between gap-4 relative z-20 shrink-0 border-b border-border/60 bg-background">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Settings size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Configuración de Tienda</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Gestiona la configuración de tu ecommerce</p>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className={cn(
          "fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all animate-in slide-in-from-top",
          notification.type === 'success' 
            ? 'bg-success/10 text-success border border-success/20' 
            : 'bg-destructive/10 text-destructive border border-destructive/20'
        )}>
          {notification.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Page Title */}
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-semibold text-foreground">
              Configuración
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Personaliza los ajustes de tu tienda online
            </p>
          </div>

          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>Configura la información básica de tu tienda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Nombre de la Tienda</Label>
                <Input
                  id="storeName"
                  type="text"
                  value={config.storeName}
                  onChange={(e) => handleInputChange('storeName', e.target.value)}
                  onBlur={() => handleInputBlur('storeName')}
                  placeholder="Mi Tienda"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeLogo">URL del Logo</Label>
                <Input
                  id="storeLogo"
                  type="url"
                  value={config.storeLogo}
                  onChange={(e) => handleInputChange('storeLogo', e.target.value)}
                  onBlur={() => handleInputBlur('storeLogo')}
                  placeholder="https://ejemplo.com/logo.png"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="welcomeMessage">Mensaje de Bienvenida</Label>
                <textarea
                  id="welcomeMessage"
                  value={config.welcomeMessage}
                  onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                  onBlur={() => handleInputBlur('welcomeMessage')}
                  placeholder="¡Bienvenido a nuestra tienda!"
                  rows={3}
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <SaveButton section="general" status={sectionStatus.general} />
            </CardFooter>
          </Card>

          {/* Contacto */}
          <Card>
            <CardHeader>
              <CardTitle>Contacto</CardTitle>
              <CardDescription>Información de contacto para tus clientes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email de Contacto</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={config.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  onBlur={() => handleInputBlur('contactEmail')}
                  placeholder="contacto@mitienda.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Teléfono de Contacto</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={config.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  onBlur={() => handleInputBlur('contactPhone')}
                  placeholder="+54 11 1234-5678"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  type="text"
                  value={config.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  onBlur={() => handleInputBlur('address')}
                  placeholder="Calle Principal 123, Ciudad"
                />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <SaveButton section="contacto" status={sectionStatus.contacto} />
            </CardFooter>
          </Card>

          {/* Envío */}
          <Card>
            <CardHeader>
              <CardTitle>Envío</CardTitle>
              <CardDescription>Configura los costos y umbrales de envío</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shippingCost">Costo de Envío (ARS)</Label>
                <Input
                  id="shippingCost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={config.shippingCost}
                  onChange={(e) => handleInputChange('shippingCost', e.target.value)}
                  onBlur={() => handleInputBlur('shippingCost')}
                  placeholder="500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="freeShippingThreshold">Envío Gratis desde (ARS)</Label>
                <Input
                  id="freeShippingThreshold"
                  type="number"
                  min="0"
                  step="0.01"
                  value={config.freeShippingThreshold}
                  onChange={(e) => handleInputChange('freeShippingThreshold', e.target.value)}
                  onBlur={() => handleInputBlur('freeShippingThreshold')}
                  placeholder="5000"
                />
                <p className="text-xs text-muted-foreground">
                  Los pedidos mayores a este monto tendrán envío gratis. Deja en 0 para desactivar.
                </p>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <SaveButton section="envio" status={sectionStatus.envio} />
            </CardFooter>
          </Card>

          {/* Impuestos */}
          <Card>
            <CardHeader>
              <CardTitle>Impuestos</CardTitle>
              <CardDescription>Configura la tasa de impuestos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tasa de Impuesto (decimal)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={config.taxRate}
                  onChange={(e) => handleInputChange('taxRate', e.target.value)}
                  onBlur={() => handleInputBlur('taxRate')}
                  placeholder="0.21"
                />
                <p className="text-xs text-muted-foreground">
                  Ingresa el valor decimal. Ejemplo: 0.21 para 21%, 0.105 para 10.5%
                </p>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <SaveButton section="impuestos" status={sectionStatus.impuestos} />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getSectionForField(key: keyof ConfigValues): string {
  switch (key) {
    case 'storeName':
    case 'storeLogo':
    case 'welcomeMessage':
      return 'general';
    case 'contactEmail':
    case 'contactPhone':
    case 'address':
      return 'contacto';
    case 'shippingCost':
    case 'freeShippingThreshold':
      return 'envio';
    case 'taxRate':
      return 'impuestos';
    default:
      return 'general';
  }
}

function SaveButton({ section, status }: { section: string; status?: 'idle' | 'saving' | 'saved' | 'error' }) {
  return (
    <Button
      variant="outline"
      size="sm"
      disabled
      className={cn(
        status === 'saved' && 'border-success/50 text-success',
        status === 'error' && 'border-destructive/50 text-destructive'
      )}
    >
      {status === 'saving' ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          <span>Guardando...</span>
        </>
      ) : status === 'saved' ? (
        <>
          <Check size={14} />
          <span>Guardado</span>
        </>
      ) : status === 'error' ? (
        <>
          <AlertCircle size={14} />
          <span>Error</span>
        </>
      ) : (
        <>
          <Save size={14} />
          <span>Guardar</span>
        </>
      )}
    </Button>
  );
}
