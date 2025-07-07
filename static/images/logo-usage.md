# AI Engineer Guide - Logo Usage

## Logo Versions

### 1. Main Logo (`logo.svg`)
- **Dimensions**: 280x60px
- **Usage**: Hero sections, main branding, large displays, **navbar header**
- **Features**: Clean "AI Engineer" + "Guide" text with consistent circular design elements

### 2. Compact Logo (`logo-compact.svg`)
- **Dimensions**: 200x32px  
- **Usage**: Alternative for headers, smaller spaces where full logo is too large
- **Features**: Horizontal layout "AI Engineer Guide" with circular design elements

### 3. Icon Logo (`logo-icon.svg`)
- **Dimensions**: 48x48px
- **Usage**: Favicons, app icons, very small spaces
- **Features**: Circular design with "AI" text and consistent tech pattern

## Design Features

- **Consistent Circular Elements**: All logos now feature circular design elements for visual unity
- **Colors**: Uses your blog's theme colors (#3273dc for light mode, #8cc2dd for dark mode)
- **Typography**: Verdana font family matching your blog's theme
- **Dark Mode**: Automatic adaptation using CSS media queries
- **Scalability**: Vector-based SVG format for crisp display at any size
- **Accessibility**: High contrast and readable text with consistent accent colors
- **Unified Style**: All logos share the same circular pattern and color scheme
- **Enhanced Visibility**: Improved opacity and sizing for better readability

## Current Implementation

The **main logo** is currently used in the navbar header with responsive sizing:
- **Desktop**: Full 280x60px
- **Tablet**: 200x43px  
- **Mobile**: 160x34px

### In HTML
```html
<!-- Main logo (currently in navbar) -->
<img src="/images/logo.svg" alt="AI Engineer Guide" width="280" height="60">

<!-- Compact logo -->
<img src="/images/logo-compact.svg" alt="AI Engineer Guide" width="200" height="32">

<!-- Icon logo -->
<img src="/images/logo-icon.svg" alt="AI Engineer Guide" width="48" height="48">
```

### In Hugo templates
```html
<!-- Main logo (navbar implementation) -->
<img src="{{ "images/logo.svg" | relURL }}" alt="{{ .Site.Title }}" width="280" height="60">

<!-- Compact logo -->
<img src="{{ "images/logo-compact.svg" | relURL }}" alt="{{ .Site.Title }}" width="200" height="32">
```

## Color Scheme
- **Primary**: #3273dc (Light mode) / #8cc2dd (Dark mode)
- **Secondary**: Same as primary with 0.8 opacity for "Guide" text
- **Circular Elements**: Subtle circular backgrounds with 0.1 opacity
- **Tech Pattern**: Enhanced visibility with 0.25 opacity

All logos now feature consistent circular design elements and enhanced visibility, with the main logo prominently displayed in the navbar header with full responsive support. 
