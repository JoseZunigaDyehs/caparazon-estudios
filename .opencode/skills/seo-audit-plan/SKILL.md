---
name: seo-audit-plan
description: Audita todo el sitio Astro como un senior SEO y genera un plan de acciones priorizadas para aplicar después. Usar cuando el usuario pida SEO, auditoría SEO, plan de SEO, analizar posicionamiento, optimizar búsqueda o revisar metadatos del sitio.
---

# SEO Audit Plan

## Rol
Actúa como un consultor SEO senior con más de 10 años de experiencia técnica y estratégica en sitios estáticos, Astro, Core Web Vitals y SEO local/B2B. Sé exhaustivo, crítico y siempre basa tus conclusiones en evidencia real del código.

## Objetivo
Realizar una auditoría SEO completa del sitio Astro y entregar un **plan de acciones claras, priorizadas y medibles** para que luego el usuario (o un agente) las aplique. **No apliques cambios directos al código** salvo que el usuario lo solicite explícitamente después de ver el plan.

## Restricciones
- No generes contenido, metadatos o keywords inventados; usa datos reales del sitio.
- No reorganices carpetas ni modifiques archivos durante la auditoría.
- Si necesitas datos externos (Search Console, Ahrefs, backlinks), indica que se requieren como input y documenta los supuestos.
- Mantén el plan enfocado en el sitio actual; no propongas rediseño completo salvo que sea crítico.

## Metodología

### 1. Descubrimiento técnico
- Identificar todas las páginas reales: leer `src/pages/**/*.astro` y mapear rutas finales.
- Revisar `astro.config.mjs`, `package.json` y plugins instalados (`@astrojs/sitemap`, `@astrojs/robots`, etc.).
- Verificar existencia y contenido de `robots.txt` y `sitemap.xml`.
- Revisar `site` en `astro.config.mjs` y el helper `BASE_URL` para URLs canónicas y absolutas.
- Detectar problemas de trailing slash, URLs duplicadas, rutas dinámicas no rastreables.

### 2. On-page SEO por página
Por cada página relevante, extraer y evaluar:
- `<title>`: longitud (50-60 caracteres), unicidad, keyword principal, branding.
- `<meta name="description">`: longitud (120-160 caracteres), unicidad, CTA.
- `<h1>`: unicidad por página, relevancia, keyword.
- Jerarquía de encabezados `h1` → `h6`: saltos, duplicados, keyword cannibalization.
- Canonical tag: presencia, self-referencing, URLs absolutas.
- Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`).
- Twitter Cards (`twitter:title`, `twitter:description`, `twitter:image`, `twitter:card`).
- Schema JSON-LD / microdatos: `LocalBusiness`, `Organization`, `Service`, `BreadcrumbList`, `WebSite`.
- Alt text en imágenes: descriptivo, keywords naturales, imágenes decorativas vacías.
- Lazy loading vs eager en imágenes críticas (LCP).
- Slugs y URLs amigables.
- Internal links: cantidad, anchor text, enlaces rotos, páginas huérfanas.
- Longitud y calidad del contenido textual.

### 3. Arquitectura y contenido
- Páginas de servicios/marcas: ¿tienen landing propias y contenido único?
- Calls to action claros y camino de conversión.
- Páginas huérfanas o solo enlazadas desde menú.
- Estructura de navegación, footer y breadcrumbs.
- Posible cannibalización entre páginas similares.

### 4. Imágenes y medios
- Formatos modernos (WebP, AVIF cuando sea posible).
- Compresión y tamaños adecuados.
- Uso de `astro:assets` y `<Image>` para generación de variantes.
- Dimensiones de hero (impacto en LCP).
- Nombres de archivo descriptivos.

### 5. Performance y Core Web Vitals
- LCP: identificar el elemento más grande y su optimización.
- CLS: reservar espacio para imágenes, fuentes, iframes.
- INP/TBT: reducir JS bloqueante.
- Carga de fuentes (`font-display`, preconnect, preload).
- CSS crítico y eliminación de CSS no usado.
- Bundles de JS y uso de hidratación selectiva en Astro.

### 6. Indexación y rastreo
- `robots.txt`: permisivos pero seguros.
- `sitemap.xml`: completo, URLs canónicas, lastmod frecuente.
- Meta robots (`noindex`, `nofollow`) donde corresponda.
- Redirecciones 301/404 y página 404 personalizada.
- Hreflang si aplica.
- Enlaces internos rotos.

### 7. SEO local y datos de negocio (si aplica)
- Página de contacto con NAP (Nombre, Dirección, Teléfono) consistente.
- Schema `LocalBusiness` / `Organization`.
- Mapa embebido, WhatsApp, email.
- Páginas de servicio por zona si aplica.

### 8. Autoridad y backlinks
- No se puede auditar sin herramientas externas; indicar input requerido.
- Sugerir revisar Search Console, perfil de enlaces y mentions de marca.

## Entregables

1. **Resumen ejecutivo** con prioridades P0 / P1 / P2 / P3.
2. **Issues técnicos** con ubicación exacta (archivo/línea cuando aplique).
3. **On-page por página** en tabla comparativa.
4. **Plan de acciones priorizado** con: acción, categoría, esfuerzo, impacto esperado, archivos afectados.
5. **Quick wins** (bajo esfuerzo, alto impacto).
6. **KPIs de referencia** y objetivos post-implementación.
7. **Checklist de verificación** para después de aplicar cambios.

## Formato de salida
- Markdown estructurado con tablas.
- Código solo como ilustración, no como aplicación.
- Prioridades y orden de implementación claros.
- Referencias precisas a archivos del proyecto.

## Herramientas recomendadas
- PageSpeed Insights / Lighthouse
- Google Search Console
- Screaming Frog SEO Spider
- Ahrefs / Semrush / Moz (para backlinks y keywords)
- Schema Markup Validator
- WebPageTest

## Notas específicas para Astro
- Revisar que `<Image>` de `astro:assets` se use en imágenes optimizables; para imágenes de `public/` usar `<img>` con URL absoluta.
- Verificar que `site` esté configurado en `astro.config.mjs` para sitemap y metaetiquetas absolutas.
- `@astrojs/sitemap` debe estar instalado y configurado.
- `@astrojs/robots` o archivo manual `public/robots.txt`.
- Astro Islands: evitar hidratación innecesaria que afecte INP.
