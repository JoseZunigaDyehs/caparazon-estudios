## Desarrollo

```sh
astro dev --background
```

Gestión del server: `astro dev stop`, `astro dev status`, `astro dev logs`.

## Stack Tecnológico

- **Astro v7** — componentes `.astro`, Server Islands, enrutamiento estático.
- **Tailwind CSS v4.3** — No existe `tailwind.config.js`. Toda la config (temas, variables, fuentes) va en el CSS global con `@theme`.

## Buenas Prácticas

- Código semántico, accesible, mobile-first.
- Componentes modulares. Sin JS en cliente salvo interactividad explícita.
- No arrastrar dependencias innecesarias.

## Identidad del Proyecto

Consultar `DESIGN_SYSTEM.md` para colores hex, tipografía, estilo visual y convenciones de компоненты.

## Planes de SEO y Accesibilidad

Consultar `SEO_AUDIT_PLANES.md` para el roadmap de mejoras SEO/a11y. Antes de implementar cualquier plan numerado, leer dicho archivo.

## Documentación

- [Astro docs](https://docs.astro.build)
- [Routing](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Framework components](https://docs.astro.build/en/guides/framework-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling](https://docs.astro.build/en/guides/styling/)
- [i18n](https://docs.astro.build/en/guides/internationalization/)
