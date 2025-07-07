# AI Engineer Guide - Logo Usage

## Logo Versions

### 1. Main Logo (`logo.svg`)
- **Dimensions**: 280x60px
- **Usage**: Hero sections, main branding, large displays
- **Features**: Clean "AI Engineer" + "Guide" text with subtle tech pattern

### 2. Compact Logo (`logo-compact.svg`)
- **Dimensions**: 200x32px  
- **Usage**: Headers, navigation bars, smaller spaces
- **Features**: Horizontal layout "AI Engineer Guide" with minimal tech pattern

### 3. Icon Logo (`logo-icon.svg`)
- **Dimensions**: 48x48px
- **Usage**: Favicons, app icons, very small spaces
- **Features**: Consistent tech pattern with "AI" text

## Design Features

- **Colors**: Uses your blog's theme colors (#3273dc for light mode, #8cc2dd for dark mode)
- **Typography**: Verdana font family matching your blog's theme
- **Dark Mode**: Automatic adaptation using CSS media queries
- **Scalability**: Vector-based SVG format for crisp display at any size
- **Accessibility**: High contrast and readable text with consistent accent colors
- **Consistent Style**: All logos share the same tech pattern and color scheme
- **Readable Text**: All text uses accent colors for better visibility

## Implementation

### In HTML
```html
<!-- Main logo -->
<img src="/images/logo.svg" alt="AI Engineer Guide" width="280" height="60">

<!-- Compact logo -->
<img src="/images/logo-compact.svg" alt="AI Engineer Guide" width="200" height="32">

<!-- Icon logo -->
<img src="/images/logo-icon.svg" alt="AI Engineer Guide" width="48" height="48">
```

### In Hugo templates
```html
<!-- Main logo -->
<img src="{{ "images/logo.svg" | relURL }}" alt="{{ .Site.Title }}" width="280" height="60">

<!-- Compact logo -->
<img src="{{ "images/logo-compact.svg" | relURL }}" alt="{{ .Site.Title }}" width="200" height="32">
```

## Color Scheme
- **Primary**: #3273dc (Light mode) / #8cc2dd (Dark mode)
- **Secondary**: Same as primary with opacity for "Guide" text
- **Accent**: Subtle gradients for depth

All logos now feature consistent styling with readable text and unified design patterns that automatically adapt to your site's dark/light mode preferences. 
