# Visual Design Guide - Sound Training

## 🎨 Design Philosophy

**"Unity in Diversity"** - Just like languages connect people, our design connects pages through a unified visual language while celebrating vibrant diversity through color.

---

## 🌈 Color System

### Primary Palette
```
Purple-Blue Gradient: #667eea → #764ba2
├─ Headers, Primary Buttons, Key Elements
└─ Represents: Knowledge, Communication, Learning
```

### Accent Palette
```
Teal:   #06b6d4  →  Innovation & Clarity
Orange: #f59e0b  →  Energy & Enthusiasm
Pink:   #ec4899  →  Creativity & Expression
Green:  #10b981  →  Growth & Success
```

### Neutral Palette
```
Dark:      #1f2937  →  Text, Navigation
Medium:    #6b7280  →  Secondary Text
Light:     #f9fafb  →  Backgrounds
White:     #ffffff  →  Content Areas
```

---

## 📐 Layout Structure

### Every Page Follows This Pattern:

```
┌─────────────────────────────────────┐
│  Navigation Bar (Dark Gradient)     │
├─────────────────────────────────────┤
│  Header (Purple Gradient)           │
│  ├─ Title (White, Bold)             │
│  └─ Subtitle (White, Transparent)   │
├─────────────────────────────────────┤
│  Main Content (White Overlay)       │
│  ├─ Rounded Top Corners             │
│  ├─ Cards, Forms, Buttons           │
│  └─ Consistent Spacing              │
├─────────────────────────────────────┤
│  Footer (Dark Gradient)             │
└─────────────────────────────────────┘
```

---

## 🎯 Component Styles

### Buttons

**Primary Button:**
- Background: Purple-blue gradient
- Hover: Lifts up 2px, reverses gradient
- Click: Ripple effect
- Shadow: Soft purple glow

**Success Button:**
- Background: Green gradient
- Use for: Positive actions, confirmations

**Danger Button:**
- Background: Red gradient
- Use for: Destructive actions, warnings

**Light Button:**
- Background: White gradient
- Border: Purple outline
- Use for: Secondary actions

### Cards

**Standard Card:**
```css
Background: White → Light gray gradient
Border Radius: 1rem
Shadow: Soft purple shadow
Hover: Lifts up 4px, larger shadow
```

**Language Card:**
```css
Background: White → Light purple gradient
Border: 2px transparent → purple on hover
Hover: Lifts up 10px, purple border
```

### Forms

**Input Fields:**
```css
Border: 2px light gray
Border Radius: 0.75rem
Focus: Purple border + purple glow
Background: White
```

**Select Dropdowns:**
- Same as input fields
- Purple arrow on focus

### Alerts

**Info Alert:**
- Background: Blue gradient
- Text: Dark blue
- Icon: Info circle

**Success Alert:**
- Background: Green gradient
- Text: Dark green
- Icon: Checkmark

**Warning Alert:**
- Background: Orange gradient
- Text: Dark orange
- Icon: Exclamation

**Danger Alert:**
- Background: Red gradient
- Text: Dark red
- Icon: X circle

---

## ✨ Animation System

### Page Load
```
Fade In + Slide Up
Duration: 0.6s
Easing: ease-out
```

### Hover Effects
```
Buttons:  Lift 2px + Shadow
Cards:    Lift 4px + Shadow
Links:    Underline animation
```

### Click Effects
```
Buttons:  Ripple from center
Forms:    Pulse on focus
```

### Header
```
Shimmer: Continuous 3s animation
Effect: Light sweep across gradient
```

---

## 🎨 Shadow System

### Small (sm)
```css
0 2px 8px rgba(102, 126, 234, 0.1)
Use: Cards at rest, small elements
```

### Medium (md)
```css
0 4px 16px rgba(102, 126, 234, 0.15)
Use: Hover states, active elements
```

### Large (lg)
```css
0 8px 32px rgba(102, 126, 234, 0.2)
Use: Modals, important cards
```

### Extra Large (xl)
```css
0 12px 48px rgba(102, 126, 234, 0.25)
Use: Overlays, popups
```

---

## 📱 Responsive Breakpoints

### Mobile (< 576px)
- Simplified gradients
- Smaller shadows
- Reduced animations
- Single column layout

### Tablet (576px - 992px)
- Medium complexity
- Standard shadows
- Full animations
- 2-column layout

### Desktop (> 992px)
- Full artistic effects
- All shadows
- All animations
- Multi-column layout

---

## 🎯 Consistency Checklist

When creating a new page, ensure:

- [ ] Background: Purple-teal gradient (fixed)
- [ ] Header: Purple gradient with white text
- [ ] Navigation: Dark gradient with hover effects
- [ ] Main: White overlay with rounded top
- [ ] Footer: Dark gradient
- [ ] Buttons: Gradient backgrounds
- [ ] Cards: White gradient with shadows
- [ ] Forms: Purple focus states
- [ ] Alerts: Color-coded gradients
- [ ] Animations: Fade in on load
- [ ] Shadows: Consistent system
- [ ] Spacing: 2rem padding on main

---

## 🎨 Usage Examples

### Creating a New Page

```html
<body>
  <nav class="navbar navbar-dark">
    <!-- Dark gradient, auto-styled -->
  </nav>
  
  <header class="text-white py-5">
    <!-- Purple gradient, auto-styled -->
    <h1>Page Title</h1>
  </header>
  
  <main class="container my-5">
    <!-- White overlay, auto-styled -->
    <div class="card">
      <!-- Gradient card, auto-styled -->
    </div>
  </main>
  
  <footer class="bg-dark text-white">
    <!-- Dark gradient, auto-styled -->
  </footer>
</body>
```

### Creating a Button

```html
<!-- Primary action -->
<button class="btn btn-primary">
  <i class="bi bi-check"></i> Confirm
</button>

<!-- Secondary action -->
<button class="btn btn-light">
  Cancel
</button>

<!-- Destructive action -->
<button class="btn btn-danger">
  Delete
</button>
```

### Creating a Card

```html
<div class="card">
  <div class="card-body">
    <h5 class="card-title">Title</h5>
    <p class="card-text">Content</p>
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

---

## 🚀 Quick Reference

### CSS Variables
```css
var(--primary-gradient)    /* Purple-blue gradient */
var(--primary-color)       /* #667eea */
var(--accent-teal)         /* #06b6d4 */
var(--shadow-md)           /* Medium shadow */
var(--text-primary)        /* #1f2937 */
```

### Common Classes
```css
.btn-primary              /* Gradient button */
.card                     /* Gradient card */
.alert-info               /* Blue gradient alert */
.badge.bg-success         /* Green gradient badge */
```

---

## ✅ Design Goals Achieved

✅ **Consistency** - Same look across all pages  
✅ **Artistic** - Beautiful gradients and animations  
✅ **Professional** - Polished shadows and spacing  
✅ **Accessible** - Good contrast and readability  
✅ **Responsive** - Works on all devices  
✅ **Modern** - Contemporary design trends  
✅ **Branded** - Unique purple-teal identity  

---

**Remember:** Every element should feel like part of the same family. When in doubt, use gradients, rounded corners, and the purple-teal color scheme!

