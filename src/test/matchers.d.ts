import 'vitest';

declare module 'vitest' {
  interface Assertion<T> {
    toBeInTheDocument(): this;
    toHaveTextContent(text: string | RegExp): this;
    toHaveClass(className: string): this;
    toBeDisabled(): this;
  }
}
