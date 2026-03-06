# TypeScript

TypeScript is a strongly-typed superset of JavaScript that compiles to plain JavaScript. It adds static type checking, which catches errors at compile time rather than runtime.

## Why TypeScript?

- **Early error detection** — Catch bugs before running the code
- **Better IDE support** — Autocomplete, refactoring, documentation
- **Self-documenting code** — Types act as inline documentation
- **Large codebase scalability** — Easier to maintain and refactor

## Basic Types

```typescript
// Primitive types
const name: string = "Alice";
const age: number = 30;
const isActive: boolean = true;

// Arrays
const skills: string[] = ["HTML", "CSS", "TypeScript"];
const scores: Array<number> = [98, 87, 95];

// Objects with interfaces
interface User {
  id: number;
  name: string;
  email: string;
  role?: "admin" | "editor" | "viewer"; // optional union type
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
};
```

## Functions with Types

```typescript
function greet(name: string, times: number = 1): string {
  return `Hello, ${name}! `.repeat(times);
}

// Generic functions
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
```

## Type Utilities

```typescript
// Partial, Required, Readonly, Pick, Omit
type UpdateUser = Partial<User>;
type PublicProfile = Pick<User, "id" | "name">;
type SafeUser = Omit<User, "email">;
```

## Resources

- [TypeScript Official Docs](https://www.typescriptlang.org/docs/)
- [Total TypeScript — Matt Pocock](https://totaltypescript.com/)
- [The TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
