'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Delete, Eraser } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NumericKeypadProps {
  value: string;
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  maxLength?: number;
  disabled?: boolean;
}

export function NumericKeypad({
  value,
  onDigit,
  onBackspace,
  onClear,
  maxLength = 12,
  disabled = false,
}: NumericKeypadProps) {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handlePress = useCallback(
    (digit: string) => {
      if (disabled || value.length >= maxLength) return;
      onDigit(digit);
    },
    [disabled, value.length, maxLength, onDigit],
  );

  const handleKeyDown = useCallback((key: string) => {
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 150);
  }, []);

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Display */}
      <div className="relative rounded-[2rem] border border-border bg-card overflow-hidden group">
        <div className="flex items-center justify-center min-h-[80px] px-8">
          <span className={cn(
            "text-4xl sm:text-5xl font-black tracking-[0.2em] font-mono transition-all duration-500",
            value ? 'text-foreground' : 'text-muted-foreground/20'
          )}>
            {value ? value.padEnd(8, '•') : '••••••••'}
          </span>
        </div>
        {value && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBackspace}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            disabled={disabled}
          >
            <Delete size={24} />
          </motion.button>
        )}
      </div>

      {/* Keypad Grid */}
      <div className="grid grid-cols-3 gap-4">
        {digits.map((digit) => (
          <KeypadButton
            key={digit}
            value={digit}
            onPress={() => handlePress(digit)}
            onKeyDown={() => handleKeyDown(digit)}
            isPressed={pressedKey === digit}
            disabled={disabled || value.length >= maxLength}
          />
        ))}

        <KeypadButton
          value={<Eraser size={20} />}
          onPress={onClear}
          onKeyDown={() => handleKeyDown('clear')}
          isPressed={pressedKey === 'clear'}
          variant="secondary"
          disabled={disabled || !value}
        />
        <KeypadButton
          value="0"
          onPress={() => handlePress('0')}
          onKeyDown={() => handleKeyDown('0')}
          isPressed={pressedKey === '0'}
          disabled={disabled || value.length >= maxLength}
        />
        <KeypadButton
          value={<Delete size={20} />}
          onPress={onBackspace}
          onKeyDown={() => handleKeyDown('backspace')}
          isPressed={pressedKey === 'backspace'}
          variant="secondary"
          disabled={disabled || !value}
        />
      </div>
    </div>
  );
}

interface KeypadButtonProps {
  value: React.ReactNode;
  onPress: () => void;
  onKeyDown: () => void;
  isPressed: boolean;
  disabled?: boolean;
  variant?: 'default' | 'secondary';
}

function KeypadButton({
  value,
  onPress,
  onKeyDown,
  isPressed: _isPressed,
  disabled = false,
  variant = 'default',
}: KeypadButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onPress}
      onMouseDown={onKeyDown}
      onMouseUp={() => onKeyDown()}
      onMouseLeave={() => onKeyDown()}
      disabled={disabled}
      whileTap={{ scale: 0.92, backgroundColor: "hsl(var(--muted))" }}
      className={cn(
        'h-16 sm:h-20 rounded-[1.5rem] font-black text-2xl border transition-all duration-300',
        'flex items-center justify-center relative overflow-hidden',
        'disabled:opacity-20 disabled:cursor-not-allowed',
        variant === 'default'
          ? 'bg-muted border-border text-foreground hover:bg-muted/80 hover:border-primary/20 hover:shadow-xl dark:shadow-black/20'
          : 'bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50',
      )}
    >
      {value}
    </motion.button>
  );
}
