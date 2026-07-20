# Seguimiento SEO y Analytics — Caparazón Estudios

> Fecha: 2026-07-20
> Estado: **Configuración parcial en código** — requiere acciones externas del usuario.

Este documento resume cómo activar Google Search Console, Google Analytics 4 y el seguimiento de keywords. El código del sitio ya está preparado; solo faltan los IDs reales.

---

## 1. Google Search Console (6.1)

### Opción A: Meta tag (recomendada)

1. Ve a [https://search.google.com/search-console](https://search.google.com/search-console).
2. Añade la propiedad `https://caparazonestudios.com`.
3. Elige el método de verificación **"Etiqueta HTML"**.
4. Copia el valor del atributo `content`, por ejemplo:
   ```
   abcdefghijklmnopqrstuvwxyz0123456789
   ```
5. Pégalo en el archivo `.env`:
   ```
   PUBLIC_SEARCH_CONSOLE_VERIFICATION=abcdefghijklmnopqrstuvwxyz0123456789
   ```
6. Rebuild y redeploy.

### Opción B: Archivo de verificación

Si prefieres verificar mediante archivo, crea `public/googleXXXXXXXXXXXXXXXX.html` con el contenido exacto que indique Search Console.

### Opción C: DNS TXT

Añade el registro TXT que te proporcione Search Console en la configuración DNS de tu dominio.

---

## 2. Google Analytics 4 (6.2)

1. Crea una propiedad en [https://analytics.google.com](https://analytics.google.com).
2. Copia el **Measurement ID** (ej: `G-XXXXXXXXXX`).
3. Pégalo en el archivo `.env`:
   ```
   PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
4. Rebuild y redeploy.

El componente `src/components/Analytics.astro` se encargará de:
- Cargar el script de `gtag.js`.
- Configurar la página vista.
- Exponer `window.trackEvent()` para eventos personalizados.

### Alternativa sin cookies

Si prefieres no usar GA4, puedes reemplazar `Analytics.astro` por una solución como:
- [Plausible Analytics](https://plausible.io/)
- [Fathom Analytics](https://usefathom.com/)
- [Umami](https://umami.is/)

Estas herramientas suelen requerir solo un script ligero.

---

## 3. Eventos de conversión (6.3)

El sitio ya dispara los siguientes eventos cuando GA4 está configurado:

| Evento | Descripción | Dónde se dispara |
|--------|-------------|------------------|
| `cta_click` | Clic en un CTA | Navbar "Cotizar Proyecto" |
| `cta_click` | Clic en un CTA | Hero "Cotizar mi Proyecto" |
| `cta_click` | Clic en un CTA | Hero "Explorar Casos" |
| `generate_lead` | Envío exitoso del formulario | Wizard de cotización |

### Parámetros de `cta_click`

```json
{
  "cta_location": "navbar|hero_primary|hero_secondary",
  "cta_text": "Cotizar Proyecto|Cotizar mi Proyecto|Explorar Casos"
}
```

### Parámetros de `generate_lead`

```json
{
  "currency": "CLP",
  "value": "Plan Headless (1.2M-2M)",
  "event_category": "cotizacion",
  "event_label": "Migración/Aceleración"
}
```

### Cómo añadir más eventos

Usa los atributos `data-track-event` y `data-track-params` en cualquier elemento interactivo:

```astro
<a
  href="#contacto"
  data-track-event="cta_click"
  data-track-params='{"cta_location":"footer","cta_text":"Contacto"}'
>
  Contacto
</a>
```

O desde cualquier script:

```js
if (typeof window.trackEvent === "function") {
  window.trackEvent("nombre_evento", { parametro: "valor" });
}
```

### Evento de WhatsApp

Aunque actualmente no hay botón de WhatsApp, si se añade en el futuro puedes usar:

```astro
<a
  href="https://wa.me/569XXXXXXXX"
  data-track-event="whatsapp_click"
  data-track-params='{"location":"hero"}'
>
  Escríbenos por WhatsApp
</a>
```

---

## 4. Keywords objetivo a monitorizar (6.4)

Revisa mensualmente la posición promedio de estas keywords en Google Search Console o con herramientas como Ubersuggest, Ahrefs, SEMrush o SERPWatcher.

### Primarias

| Keyword | Intención | Prioridad |
|---------|-----------|-----------|
| `ecommerce headless chile` | Comercial | Alta |
| `tienda online astro` | Informacional/Comercial | Alta |
| `catálogo b2b chile` | Comercial | Alta |
| `desarrollo web alto rendimiento` | Comercial | Media |
| `core web vitals chile` | Informacional | Media |
| `migrar tienda woocommerce a astro` | Comercial | Media-Alta |

### Secundarias / Long-tail

- `desarrollador astro chile`
- `tienda online headless precio`
- `catálogo digital para empresas`
- `ecommerce con flow.cl`
- `sitio web estático astro`
- `mejorar velocidad tienda online`

### Métricas a seguir

- **Impresiones** y **clics** en Search Console.
- **Posición promedio** por keyword.
- **CTR** de las páginas principales.
- **Conversiones** en GA4 (`generate_lead`, `cta_click`).
- **Core Web Vitals** mensuales en Search Console.

---

## 5. Checklist post-despliegue

- [ ] Verificación de Search Console activa.
- [ ] GA4 recibiendo datos de página vista.
- [ ] Evento `cta_click` registrado al hacer clic en CTAs.
- [ ] Evento `generate_lead` registrado al enviar cotización.
- [ ] Sitemap enviado en Search Console (`https://caparazonestudios.com/sitemap-index.xml`).
- [ ] Primera medición de Core Web Vitals en Search Console (tarda unos días).
- [ ] Revisión mensual de posiciones y CTR.

---

## 6. Archivos relacionados

- `src/components/Analytics.astro`
- `src/components/TrackClicks.astro`
- `src/layouts/Layout.astro`
- `src/components/Formulario.astro`
- `src/components/Hero.astro`
- `src/components/Navbar.astro`
- `.env.example`
