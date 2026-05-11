import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const inputVariants = cva(
  'group/input flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        error: 'border-destructive focus-visible:ring-destructive/30',
        success: 'border-success focus-visible:ring-success/30',
      },
      size: {
        default: 'min-h-11 px-3 py-2',
        sm: 'min-h-9 px-2.5 py-1.5 text-xs',
        lg: 'min-h-12 px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type InputProps = useRender.ComponentProps<'input'> & VariantProps<typeof inputVariants>;

function Input({ className, variant, size, render, ...props }: InputProps) {
  return useRender({
    defaultTagName: 'input',
    props: mergeProps<'input'>(
      {
        className: cn(inputVariants({ variant, size }), className),
      },
      props,
    ),
    render,
    state: {
      slot: 'input',
      variant,
      size,
    },
  });
}

export { Input, inputVariants };
