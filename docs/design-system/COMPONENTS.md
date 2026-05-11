# Design System — Components

## UI Components

All UI components are located in `src/components/ui/` and use shadcn/ui patterns.

### Button

```tsx
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/lib/components-registry';

// Variants
<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

### Badge

```tsx
import { Badge } from '@/components/ui/badge';
import { badgeVariants } from '@/lib/components-registry';

<Badge variant="success">Active</Badge>
<Badge variant="danger">Expired</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="neutral">Neutral</Badge>
<Badge variant="info">Info</Badge>
```

### Card

```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>Main content</CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>;
```

### Input

```tsx
import { Input } from '@/components/ui/input';

<Input type="text" placeholder="Enter text..." />
<Input type="email" placeholder="email@example.com" />
<Input type="password" placeholder="Password" />
```

### Modal

```tsx
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';

<Modal>
  <ModalTrigger>Open Modal</ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <h2>Title</h2>
    </ModalHeader>
    <ModalBody>Content</ModalBody>
    <ModalFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </ModalFooter>
  </ModalContent>
</Modal>;
```

## Component Composition Patterns

### Button with Icon

```tsx
<Button>
  <PlusIcon className="h-4 w-4" />
  <span>Add Client</span>
</Button>
```

### Card with Hover Effect

```tsx
<Card className="transition-all hover:border-accent/40 hover:shadow-lg">
  <CardContent>Content</CardContent>
</Card>
```

### Badge with Dynamic Variant

```tsx
const getStatusBadge = (status: string) => {
  const variants = {
    active: 'success',
    expired: 'danger',
    pending: 'warning',
  };
  return <Badge variant={variants[status] || 'neutral'}>{status}</Badge>;
};
```

## Component Registry

The `src/lib/components-registry.ts` exports all components with variant schemas for type safety.

```tsx
import {
  buttonVariantSchemas,
  badgeVariantSchemas,
  inputVariantSchemas,
} from '@/lib/components-registry';

// buttonVariantSchemas.variants = ["default", "outline", "secondary", "ghost", "destructive", "link"]
// buttonVariantSchemas.sizes = ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"]
```
