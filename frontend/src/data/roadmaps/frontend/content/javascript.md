# JavaScript

JavaScript is the programming language of the web. It makes web pages interactive — everything from form validation to complex single-page applications.

## The Language

JavaScript is a **dynamically-typed**, **interpreted** language. It runs in the browser (and on servers with Node.js), operating on the DOM to create interactive experiences.

## Core Syntax

```javascript
// Variables
const name = "Alice";
let age = 30;

// Functions
function greet(name) {
  return `Hello, ${name}!`;
}

// Arrow functions
const add = (a, b) => a + b;

// Arrays & Objects
const skills = ["HTML", "CSS", "JS"];
const user = { name: "Alice", role: "developer" };
```

## Modern JavaScript (ES6+)

```javascript
// Destructuring
const { name, role } = user;
const [first, ...rest] = skills;

// Async / Await
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Optional chaining
const city = user?.address?.city ?? "Unknown";
```

## The DOM

```javascript
// Select elements
const btn = document.querySelector('#my-button');

// Modify elements
btn.textContent = "Click me";
btn.style.color = "green";

// Event listeners
btn.addEventListener('click', () => {
  console.log('Button clicked!');
});
```

## Resources

- [The Modern JavaScript Tutorial — javascript.info](https://javascript.info/)
- [Eloquent JavaScript — Free Book](https://eloquentjavascript.net/)
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
