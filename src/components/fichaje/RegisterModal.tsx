'use client';

import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Plan {
  id: string;
  nombre: string;
  precio: number;
}

interface RegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDni?: string;
  planes: Plan[];
  onRegister: (data: {
    nombre: string;
    apellido: string;
    dni: string;
    planId: string;
    fechaInicio: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function RegisterModal({
  open,
  onOpenChange,
  initialDni = '',
  planes,
  onRegister,
  isLoading = false,
}: RegisterModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: initialDni,
    planId: '',
    fechaInicio: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.apellido || !formData.dni || !formData.planId) return;
    await onRegister(formData);
  };

  const isValid = formData.nombre && formData.apellido && formData.dni && formData.planId;

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-md glass-card border-border">
        <ModalHeader>
          <h2 className="text-lg font-bold font-heading text-foreground">
            Registrar Nuevo Socio
          </h2>
        </ModalHeader>

        <ModalBody className="gap-4">
          {/* DNI Field */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dni">DNI</Label>
            <Input
              id="dni"
              value={formData.dni}
              onChange={(e) => setFormData((prev) => ({ ...prev, dni: e.target.value }))}
              placeholder="12345678"
              className="h-10 bg-secondary/50 border-border"
            />
          </div>

          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                placeholder="Juan"
                className="h-10 bg-secondary/50 border-border"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                value={formData.apellido}
                onChange={(e) => setFormData((prev) => ({ ...prev, apellido: e.target.value }))}
                placeholder="Pérez"
                className="h-10 bg-secondary/50 border-border"
              />
            </div>
          </div>

          {/* Plan */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="plan">Plan</Label>
            <select
              id="plan"
              value={formData.planId}
              onChange={(e) => setFormData((prev) => ({ ...prev, planId: e.target.value }))}
              className="h-10 w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground font-sans ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors hover:border-primary/50"
            >
              <option value="" className="bg-background">Seleccionar plan...</option>
              {planes.map((plan) => (
                <option key={plan.id} value={plan.id} className="bg-background">
                  {plan.nombre} - ${plan.precio}/mes
                </option>
              ))}
            </select>
          </div>
        </ModalBody>

        <ModalFooter className="gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 bg-transparent border-border hover:bg-muted"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            className="flex-1"
          >
            {isLoading ? 'Registrando...' : 'Registrar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
