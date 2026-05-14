import { expect } from 'vitest';

// Custom matchers for DOM testing that Vitest doesn't include by default
expect.extend({
  toBeInTheDocument(this: any, received: Element | null) {
    if (received === null) {
      return { pass: false, message: () => 'Expected element to be in the document, but it was null' };
    }
    const pass = received.ownerDocument?.body?.contains(received) ?? false;
    return {
      pass,
      message: () => pass
        ? `Expected ${received.tagName} not to be in the document`
        : `Expected ${received.tagName} to be in the document`,
    };
  },
  toHaveTextContent(this: any, received: Element | null, text: string | RegExp) {
    if (received === null) {
      return { pass: false, message: () => 'Expected element to have text content, but it was null' };
    }
    const content = received.textContent ?? '';
    const pass = typeof text === 'string'
      ? content.includes(text)
      : text.test(content);
    return {
      pass,
      message: () => pass
        ? `Expected ${received.tagName} not to have text content "${text}"`
        : `Expected ${received.tagName} to have text content "${text}", but found "${content}"`,
    };
  },
  toHaveClass(this: any, received: Element | null, className: string) {
    if (received === null) {
      return { pass: false, message: () => 'Expected element to have class, but it was null' };
    }
    const el = received as HTMLElement;
    const pass = el.classList?.contains(className) ?? false;
    return {
      pass,
      message: () => pass
        ? `Expected ${received.tagName} not to have class "${className}"`
        : `Expected ${received.tagName} to have class "${className}"`,
    };
  },
  toBeDisabled(this: any, received: Element | null) {
    if (received === null) {
      return { pass: false, message: () => 'Expected element to be disabled, but it was null' };
    }
    const el = received as HTMLButtonElement;
    const pass = el.disabled || el.getAttribute('aria-disabled') === 'true';
    return {
      pass,
      message: () => pass
        ? `Expected ${received.tagName} not to be disabled`
        : `Expected ${received.tagName} to be disabled`,
    };
  },
});
