// ============================================================================
// GymPro Component Registry — Centralized UI Component Exports
// All UI components must be exported from here for consistent imports.
// ============================================================================

/**
 * Button component with multiple variants and sizes.
 * @see @/components/ui/button
 */
export { Button, buttonVariants } from '@/components/ui/button';

/**
 * Badge component for status indicators and labels.
 * @see @/components/ui/badge
 */
export { Badge, badgeVariants } from '@/components/ui/badge';

/**
 * Card component for content containers with header, content, and footer sections.
 * @see @/components/ui/card
 */
export { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

/**
 * Avatar component for user representation with image and fallback support.
 * @see @/components/ui/avatar
 */
export { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

/**
 * Progress component for displaying task completion or loading states.
 * @see @/components/ui/progress
 */
export { Progress } from '@/components/ui/progress';

/**
 * Tooltip component for contextual information on hover/focus.
 * @see @/components/ui/tooltip
 */
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

/**
 * Input component for user text entry with multiple states.
 * @see @/components/ui/input
 */
export { Input, inputVariants } from '@/components/ui/input';

/**
 * Label component for form field descriptions.
 * @see @/components/ui/label
 */
export { Label, labelVariants } from '@/components/ui/label';

/**
 * Modal component for dialogs and overlays.
 * @see @/components/ui/modal
 */
export {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';

// ---------------------------------------------------------------------------
// Component Variant Definitions
// ---------------------------------------------------------------------------

/**
 * Defines valid button variant and size options for type safety.
 */
export const buttonVariantSchemas = {
  variants: ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'] as const,
  sizes: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'] as const,
} as const;

/**
 * Defines valid badge variant and size options for type safety.
 */
export const badgeVariantSchemas = {
  variants: ['success', 'danger', 'warning', 'neutral', 'info'] as const,
  sizes: ['sm', 'default', 'lg'] as const,
} as const;

/**
 * Defines valid input state and size options for type safety.
 */
export const inputVariantSchemas = {
  states: ['default', 'focus', 'error', 'disabled'] as const,
  sizes: ['sm', 'default', 'lg'] as const,
} as const;
