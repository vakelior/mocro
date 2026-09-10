# MOCRO — Black & White WordPress Theme

A sleek, high-contrast black & white WordPress theme with sharp 2026 minimalist aesthetics and open-source **Lucide** icons. Elegant, fast, and fully responsive.

## ✨ Features

- **Monochrome design** — pure black & white with sharp contrast and generous whitespace
- **Lucide icons** — 1,600+ open-source (ISC license) thin-line icons, loaded via CDN
- **Modern typography** — Inter (sans) + JetBrains Mono (mono) via Google Fonts
- **Fully responsive** — mobile navigation with animated hamburger toggle
- **Customizer options** — social links (X, GitHub, LinkedIn, Instagram)
- **Gutenberg-ready** — wide/full alignment support, editor styles
- **Accessible** — skip-link, ARIA labels, screen-reader-friendly, reduced-motion support
- **Lightweight** — no heavy frameworks, minimal CSS footprint

## 🗂 File structure

```
mocro/
├── style.css                  # Theme header + all styles
├── functions.php              # Setup, enqueues, widgets, customizer includes
├── header.php                 # Sticky header + nav
├── footer.php                 # Footer with social + newsletter
├── index.php                  # Blog / archive fallback
├── front-page.php             # Homepage (hero + services + posts + CTA)
├── single.php                 # Single post
├── page.php                   # Static page
├── archive.php                # Archive listing
├── 404.php                    # 404 page
├── searchform.php             # Search form
├── comments.php               # Comments area
├── template-parts/
│   └── content-summary.php    # Post card partial
├── inc/
│   ├── customizer.php         # Social links settings
│   └── template-tags.php      # Helper functions
└── assets/
    ├── js/main.js             # Nav toggle + icon init
    ├── css/                   # (reserved for future modular CSS)
    └── img/                   # screenshot.png goes here
```

## 🚀 Installation

1. Download the `mocro` folder.
2. Zip it into `mocro.zip`.
3. In WordPress admin, go to **Appearance → Themes → Add New → Upload Theme**.
4. Upload `mocro.zip` and click **Activate**.

## ⚙️ Setup

- **Menus**: Appearance → Menus — assign a menu to "Primary Menu" and "Footer Menu".
- **Logo**: Appearance → Customize → Site Identity → Logo.
- **Social links**: Appearance → Customize → *MOCRO — Social Links*.
- **Front page**: Set a static front page (Settings → Reading) OR keep blog as homepage; the `front-page.php` hero is used when the site front page is set to "latest posts".

## 🎨 Icons

Icons use [Lucide](https://lucide.dev) (ISC open-source license). To use any icon in your content, simply add:

```html
<i data-lucide="heart"></i>
```

Replace `heart` with any Lucide icon name. Icons are rendered as inline SVG and inherit the current text color via CSS.

## 🛠 Customization

All design tokens (colors, spacing, fonts, radii) are defined as CSS variables in `:root` at the top of `style.css`. Change them once and the whole theme updates.

## 📄 License

- Theme: GPL v2 or later (see [license](http://www.gnu.org/licenses/gpl-2.0.html))
- Icons: Lucide — ISC license
- Fonts: Inter & JetBrains Mono — SIL Open Font License (via Google Fonts)
