# Auditoría SEO y Accesibilidad — Caparazón Estudios

> Fecha: 2026-07-20
> Auditor: Asistente SEO senior
> Estado: **Planes 0, 1, 2, 3, 4 y 6 implementados** — Plan 5 pendiente

Este documento es la referencia viva de mejoras SEO y accesibilidad (a11y) detectadas en el proyecto. Cuando se solicite _"implementar el Plan X"_, este archivo debe leerse primero para mantener coherencia y prioridad.

---

## Resumen ejecutivo

El proyecto es una **landing page single-page** en Astro 7 + Tailwind 4.3 con output estático. Tiene buena base técnica, pero carece de metadatos esenciales, presenta errores de accesibilidad y oportunidades claras de contenido/arquitectura para posicionar términos como _e-commerce headless Chile_, _tiendas Astro_, _catálogos B2B_, etc.

### Problemas críticos actuales

1. `<html lang="en">` con contenido 100% en español.
2. No existe `meta description`, Open Graph, Twitter Cards, canonical, JSON-LD ni `robots.txt/sitemap.xml`.
3. El badge valioso del Hero (`Ingeniería Web de Élite`) está comentado.
4. Botones de CTA sin navegación real y footer con enlaces vacíos (`href="#"`).
5. Imágenes remotas sin dimensiones explícitas ni lazy loading.
6. Faltan favicons multiplataforma y manifest.

---

## Plan 0 — Quick Wins Críticos

Prioridad: **ALTA** | Esfuerzo: **Bajo**

| #    | Acción                                                                                         | Motivo SEO / A11y                         | Archivo objetivo                                           |
| ---- | ---------------------------------------------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------- |
| 0.1  | Cambiar `<html lang="en">` → `lang="es-CL"`                                                    | SEO local + lectores de pantalla          | `src/layouts/Layout.astro`                                 |
| 0.2  | Añadir `<meta name="description">` único por página                                            | CTR en SERPs                              | `src/layouts/Layout.astro`                                 |
| 0.3  | Añadir Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`) | Previsualización en redes y WhatsApp      | `src/layouts/Layout.astro`                                 |
| 0.4  | Añadir Twitter Cards                                                                           | Compartir en X/Twitter                    | `src/layouts/Layout.astro`                                 |
| 0.5  | Añadir `<link rel="canonical">`                                                                | Evitar contenido duplicado                | `src/layouts/Layout.astro`                                 |
| 0.6  | Añadir `<meta name="robots" content="index, follow">`                                          | Control de rastreo explícito              | `src/layouts/Layout.astro`                                 |
| 0.7  | Favicons multiplataforma + `site.webmanifest` + `theme-color`                                  | PWA + señales de calidad                  | `public/` + `src/layouts/Layout.astro`                     |
| 0.8  | Descomentar o reemplazar badge "Ingeniería Web de Élite" en Hero                               | Refuerzo semántico de keywords            | `src/components/Hero.astro`                                |
| 0.9  | Convertir botones de navegación/CTA a `<a>` reales (`#cotizar`, `#casos`)                      | Navegación por teclado + internal linking | `src/components/Navbar.astro`, `src/components/Hero.astro` |
| 0.10 | Corregir enlaces vacíos del footer (`href="#"`)                                                | No confundir a Google ni a screen readers | `src/components/Footer.astro`                              |

---

## Plan 1 — SEO Técnico y Arquitectura de Indexación

Prioridad: **ALTA** | Esfuerzo: **Medio**

| #   | Acción                             | Detalle                                                                       |
| --- | ---------------------------------- | ----------------------------------------------------------------------------- |
| 1.1 | Crear `robots.txt`                 | Allow/Disallow sensato + ruta al sitemap                                      |
| 1.2 | Crear `sitemap.xml`                | Generado manualmente o con `@astrojs/sitemap`                                 |
| 1.3 | Implementar JSON-LD                | `Organization`, `WebSite`, `Service`, `LocalBusiness` (Chile), `ContactPoint` |
| 1.4 | Configurar canonical dinámico      | Basado en `Astro.url.pathname`                                                |
| 1.5 | Añadir `hreflang`                  | Al menos `es-CL` y `x-default`                                                |
| 1.6 | Crear página 404 personalizada     | Mejora UX y reduce bounce rate                                                |
| 1.7 | Definir URL definitiva del dominio | Redirects `www` ↔ `non-www` y `http` → `https`                                |
| 1.8 | Preconnect/dns-prefetch            | A Unsplash y al worker si se usan recursos externos                           |

---

## Plan 2 — SEO On-Page y Contenido

Prioridad: **MEDIA-ALTA** | Esfuerzo: **Medio**

| #   | Acción                                     | Detalle                                                                |
| --- | ------------------------------------------ | ---------------------------------------------------------------------- |
| 2.1 | Optimizar `<title>`                        | Incluir keyword principal + ubicación                                  |
| 2.2 | Revisar jerarquía de headings              | Un solo `<h1>` por página; `<h2>` para secciones; `<h3>` para tarjetas |
| 2.3 | Mejorar textos alternativos                | Descripción del resultado, no solo el nombre del cliente               |
| 2.4 | Estructurar servicios con Schema `Service` | Cada módulo con descripción, área de servicio, provider                |
| 2.5 | Añadir testimonios/cifras reales           | Mejora E-E-A-T                                                         |
| 2.6 | Implementar FAQ Schema                     | Preguntas frecuentes sobre costos, plazos, tecnología                  |
| 2.7 | Añadir breadcrumb                          | Aunque sea single-page, ayuda a navegación y estructura                |

---

## Plan 3 — Accesibilidad (a11y)

### 3.1 Estructura y navegación

| #     | Acción                                                              | Archivo                                                      |
| ----- | ------------------------------------------------------------------- | ------------------------------------------------------------ |
| 3.1.1 | Añadir **skip link** ("Saltar al contenido principal")              | `src/layouts/Layout.astro`                                   |
| 3.1.2 | Asignar `aria-label` al `<nav>` principal                           | `src/components/Navbar.astro`                                |
| 3.1.3 | Añadir `aria-current="page"` al enlace activo                       | `src/components/Navbar.astro`                                |
| 3.1.4 | Añadir `role="img"` y `aria-label="Caparazón Estudios"` al SVG logo | `src/components/Navbar.astro`, `src/components/Footer.astro` |
| 3.1.5 | Ocultar iconos decorativos con `aria-hidden="true"`                 | Todos los componentes                                        |
| 3.1.6 | Asegurar `type` explícito en todos los botones interactivos         | `src/components/Navbar.astro`, `src/components/Hero.astro`   |

### 3.2 Formulario de cotización

| #     | Acción                                                                             | Motivo                                    |
| ----- | ---------------------------------------------------------------------------------- | ----------------------------------------- |
| 3.2.1 | Asociar errores con `aria-describedby`                                             | Screen reader anuncia el error específico |
| 3.2.2 | Añadir `aria-invalid="true"` cuando un campo falla                                 | Estado de error semántico                 |
| 3.2.3 | Convertir botón "Enviar" en `type="submit"` dentro del `<form>` o usar `form="id"` | Relación botón-formulario correcta        |
| 3.2.4 | Mejorar progress bar con `role="progressbar"`, `aria-valuemin/max/now`             | Indicador de paso accesible               |
| 3.2.5 | Mantener `aria-live="polite"` en `#step-content`                                   | ✅ Ya implementado                        |
| 3.2.6 | Asegurar foco visible en todos los elementos interactivos                          | Tailwind `focus-visible:`                 |

### 3.3 Contraste y percepción

| #     | Acción                                                                                                               |
| ----- | -------------------------------------------------------------------------------------------------------------------- |
| 3.3.1 | Verificar ratios de contraste WCAG AA para texto pequeño sobre fondos oscuros                                        |
| 3.3.2 | Evitar información crítica solo en hover (`group-hover:opacity-100` en casos); mostrar siempre o con botón "Ver más" |
| 3.3.3 | Asegurar target táctil mínimo 44×44 px en botones pequeños                                                           |

---

## Plan 4 — Performance y Core Web Vitals

Prioridad: **MEDIA** | Esfuerzo: **Medio-Alto**

| #   | Acción                                                                                         | Impacto             |
| --- | ---------------------------------------------------------------------------------------------- | ------------------- |
| 4.1 | Migrar imágenes de Unsplash a `/public` o usar `astro:assets` con `srcset` y formatos modernos | LCP, ancho de banda |
| 4.2 | Añadir `width`, `height`, `loading="lazy"`, `decoding="async"` a todas las imágenes            | CLS, LCP            |
| 4.3 | Cargar fuentes Geist/Geist Mono reales con `font-display: swap`                                | Evitar FOUT/FOIT    |
| 4.4 | Precargar CSS crítico y fuentes                                                                | FCP                 |
| 4.5 | Revisar que el JS del wizard no bloquee el renderizado                                         | Inlining o `defer`  |
| 4.6 | Medir LCP, INP, CLS con Lighthouse/PageSpeed Insights tras cambios                             | Validación          |

---

## Plan 5 — Expansión de Contenido y Arquitectura

Prioridad: **MEDIA** | Esfuerzo: **Alto**

| #   | Acción                                                           | Beneficio                                     |
| --- | ---------------------------------------------------------------- | --------------------------------------------- |
| 5.1 | Crear `/servicios/ecommerce-headless`                            | Posicionar long-tail específica               |
| 5.2 | Crear `/servicios/catalogos-b2b`                                 | Captar tráfico industrial/corporativo         |
| 5.3 | Crear páginas por caso de éxito (`/casos/umbral-pv-sushi`, etc.) | Prueba social + keywords                      |
| 5.4 | Crear blog técnico (`/blog/`)                                    | Autoridad en Astro, headless, Core Web Vitals |
| 5.5 | Añadir `/contacto` y `/politica-de-privacidad`                   | Confianza y requisitos legales                |
| 5.6 | Integrar WhatsApp CTA con `wa.me` + Schema `ContactPoint`        | Conversión local                              |

---

## Plan 6 — Medición y Seguimiento

Prioridad: **MEDIA** | Esfuerzo: **Bajo**

Consultar `TRACKING.md` para el paso a paso de configuración externa (Search Console, GA4, keywords).

| #   | Acción                                                                               |
| --- | ------------------------------------------------------------------------------------ |
| 6.1 | Registrar propiedad en Google Search Console                                         |
| 6.2 | Crear cuenta de Google Analytics 4 (o alternativa sin cookies)                       |
| 6.3 | Configurar eventos de conversión: envío de formulario, clic WhatsApp, clic "Cotizar" |
| 6.4 | Monitorizar posiciones para keywords objetivo                                        |

### Keywords objetivo sugeridas

- `ecommerce headless chile`
- `tienda online astro`
- `catálogo b2b chile`
- `desarrollo web alto rendimiento`
- `core web vitals chile`
- `migrar tienda woocommerce a astro`

---

## Roadmap recomendado

1. **Semana 1:** Plan 0.
2. **Semana 2:** Plan 1 + accesibilidad básica del Plan 3.
3. **Semana 3:** Plan 2 + Plan 4.
4. **Mes 2:** Plan 5 + Plan 6.

---

## Notas para el agente implementador

- Antes de ejecutar un plan, leer este archivo completo.
- Seguir el stack Astro 7 + Tailwind 4.3 del proyecto (`@theme`, sin `tailwind.config.js`).
- Preferir componentes `.astro` puros y evitar JS en cliente salvo interactividad explícita.
- Respetar el design system definido en `DESIGN_SYSTEM.md`.
- Verificar el build con `pnpm build` y, si es posible, ejecutar Lighthouse tras cambios.

---

## Notas para el dev

- Organization.sameAs está vacío. Cuando tengas perfiles de LinkedIn, GitHub, Instagram, etc., añádelos ahí para reforzar E-E-A-T.
- El ContactPoint solo tiene areaServed: "CL". Cuando definas un correo/teléfono oficial, añade email y telephone.

- La sección de testimonios reales (2.5) queda pendiente de que tengas frases o datos de clientes. Cuando los tengas, puedo añadirlos fácilmente al componente Resultados.astro o crear una sección Testimonios.astro.

- Los enlaces de email (mailto:hola@caparazonestudios.com) y GitHub son placeholders. Cuando tengas los datos reales, actualízalos en Footer.astro.
- El formulario ahora es más amigable para lectores de pantalla, pero recomiendo probarlo con un lector real o herramienta como axe DevTools.
