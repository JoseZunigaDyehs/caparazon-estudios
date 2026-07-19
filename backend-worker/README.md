Estructura del archivo

- Producción: caparazon-estudios-worker
- Staging: caparazon-estudios-worker-staging
- Main: apunta a src/backend-worker/index.js
- Variables: NOTIFY_EMAIL y ALLOWED_ORIGINS están comentadas para que las configures con tus datos reales.
  Pasos para desplegar

1. Instala Wrangler si no lo tienes:
   npm install -g wrangler
2. Autentícate con Cloudflare:
   wrangler login
3. Descomenta y configura las variables en wrangler.toml:
   [vars]
   NOTIFY_EMAIL = "tu-correo@gmail.com"
   ALLOWED_ORIGINS = "https://caparazonestudios.com,https://www.caparazonestudios.com"
4. Sube el secreto de Resend (nunca va en wrangler.toml):
   wrangler secret put RESEND_API_KEY
   Para producción:
   wrangler secret put RESEND_API_KEY --env production
5. Despliega:
   wrangler deploy # entorno por defecto
   wrangler deploy --env production # producción
   wrangler deploy --env staging # staging
   Para pruebas locales
   wrangler dev
   Si necesitas secretos locales, créalos en un archivo .dev.vars (ya debería estar ignorado por Git):
   RESEND_API_KEY=re_xxxxxxxx
   NOTIFY_EMAIL=tu-correo@gmail.com
   ALLOWED_ORIGINS=http://localhost:4321
