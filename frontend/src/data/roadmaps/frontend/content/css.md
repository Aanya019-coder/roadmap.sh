# CSS

CSS (Cascading Style Sheets) is the language used to style and layout web pages. It controls everything visual — colors, fonts, spacing, positioning, animations, and responsive behavior.

## The Cascade

CSS applies rules in a specific order based on **specificity**, **inheritance**, and **source order**. Understanding the cascade is key to writing maintainable CSS.

## Selectors

```css
/* Element */     p { color: red; }
/* Class */       .card { padding: 1rem; }
/* ID */          #header { background: black; }
/* Pseudo-class */:hover { opacity: 0.8; }
/* Combinators */ .card > h2 { font-size: 1.5rem; }
```

## Box Model

Every element is a rectangular box:
- **Content** — The actual content
- **Padding** — Space between content and border
- **Border** — Surrounds the padding
- **Margin** — Space outside the border

## Layout Systems

### Flexbox
```css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### CSS Grid
```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
```

## Responsive Design

```css
/* Mobile first */
.card { font-size: 1rem; }

@media (min-width: 768px) {
  .card { font-size: 1.25rem; }
}
```

## Resources

- [CSS Tricks — A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [CSS Tricks — A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)
