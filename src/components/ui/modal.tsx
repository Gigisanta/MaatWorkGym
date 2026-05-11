'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  className?: string;
}

export interface ModalTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export interface ModalContentProps {
  children?: React.ReactNode;
  className?: string;
  showClose?: boolean;
  onClose?: () => void;
}

export interface ModalHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export interface ModalBodyProps {
  children?: React.ReactNode;
  className?: string;
}

export interface ModalFooterProps {
  children?: React.ReactNode;
  className?: string;
}

function ModalContent({ children, className, showClose = true, onClose }: ModalContentProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col gap-4 rounded-2xl glass-card p-6 shadow-2xl z-50',
        className
      )}
    >
      {showClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1.5 opacity-70 transition-opacity hover:opacity-100 hover:bg-secondary text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {children}
    </div>
  );
}

function ModalHeader({ children, className }: ModalHeaderProps) {
  return <div className={cn('flex flex-col gap-1', className)}>{children}</div>;
}

function ModalBody({ children, className }: ModalBodyProps) {
  return <div className={cn('flex flex-col gap-4', className)}>{children}</div>;
}

function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn('flex items-center justify-end gap-3 border-t border-border pt-4', className)}>
      {children}
    </div>
  );
}

function ModalBackdrop() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    />
  );
}

export function Modal({ open, onOpenChange, children }: ModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <ModalBackdrop />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative z-50 w-full max-w-lg"
                onClick={(e) => {
                  // Only close if clicking the backdrop wrapper directly
                  if (e.target === e.currentTarget) {
                    onOpenChange?.(false);
                  }
                }}
              >
                {children}
              </motion.div>
            </div>,
            document.body
          )}
        </>
      )}
    </AnimatePresence>
  );
}

export function ModalTrigger({ children }: ModalTriggerProps) {
  return <>{children}</>;
}

export { ModalContent, ModalHeader, ModalBody, ModalFooter };
