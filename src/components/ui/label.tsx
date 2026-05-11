import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      variant: {
        default: 'text-foreground',
        muted: 'text-muted-foreground',
        danger: 'text-destructive',
      },
      size: {
        default: 'text-sm',
        sm: 'text-xs',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type LabelProps = useRender.ComponentProps<'label'> & VariantProps<typeof labelVariants>;

function Label({ className, variant, size, render, ...props }: LabelProps) {
  return useRender({
    defaultTagName: 'label',
    props: mergeProps<'label'>(
      {
        className: cn(labelVariants({ variant, size }), className),
      },
      props,
    ),
    render,
    state: {
      slot: 'label',
      variant,
      size,
    },
  });
}

export { Label, labelVariants };
