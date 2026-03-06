# React

React is a JavaScript library for building user interfaces, developed by Meta. It introduces a **component-based architecture** that makes complex UIs composable and maintainable.

## Core Concepts

### Components & JSX
```jsx
function Button({ label, onClick }) {
  return (
    <button
      className="btn-primary"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
```

### useState Hook
```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### useEffect Hook
```jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);

  if (!user) return <p>Loading...</p>;
  return <h1>{user.name}</h1>;
}
```

### Props & State

- **Props** — Data passed from parent to child (read-only)
- **State** — Internal data that can change over time (triggers re-renders)

## The Ecosystem

| Tool | Purpose |
|------|---------|
| React Router | Client-side routing |
| Zustand / Jotai | Global state management |
| React Query / TanStack | Server state & data fetching |
| React Hook Form | Form management |
| Framer Motion | Animations |

## Resources

- [React Official Documentation](https://react.dev)
- [Full Stack Open — React Course](https://fullstackopen.com/en/)
- [Build UI — React Patterns](https://buildui.com/)
