/**
 * Cloudflare Worker — Caparazón Estudios /api/cotizar
 *
 * Recibe el formulario de cotización desde el frontend Astro y reenvía
 * un resumen estructurado por correo a través de la API de Resend.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Configuración
// ─────────────────────────────────────────────────────────────────────────────

const ENDPOINT = '/api/cotizar';
const RESEND_API_URL = 'https://api.resend.com/emails';

const BRAND = {
  name: 'Caparazón Estudios',
  bg: '#0A0E17',
  surface: '#1E293B',
  border: '#334155',
  primary: '#00C49F',
  text: '#F1F5F9',
  muted: '#94A3B8',
};

const REQUIRED_FIELDS = [
  'objetivo',
  'estadoData',
  'urgencia',
  'inversion',
  'nombre',
  'negocio',
  'whatsapp',
  'correo',
];

// ─────────────────────────────────────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────────────────────────────────────

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

      if (url.pathname !== ENDPOINT) {
        return jsonResponse({ error: 'Ruta no encontrada.' }, 404);
      }

      if (request.method === 'OPTIONS') {
        return handleCors(request, env);
      }

      if (request.method !== 'POST') {
        return jsonResponse({ error: 'Método no permitido.' }, 405, {
          'Allow': 'POST, OPTIONS',
        });
      }

      return await handleQuote(request, env);
    } catch (err) {
      console.error('Worker error:', err);
      return jsonResponse({ error: 'Error interno del servidor.' }, 500);
    }
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Manejo de CORS
// ─────────────────────────────────────────────────────────────────────────────

function handleCors(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowedOrigin = getAllowedOrigin(origin, env);

  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

function corsHeaders(origin, env) {
  return {
    'Access-Control-Allow-Origin': getAllowedOrigin(origin, env),
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function getAllowedOrigin(origin, env) {
  const fallback = 'http://localhost:4321';
  const raw = env.ALLOWED_ORIGINS || fallback;
  const allowed = raw.split(',').map((o) => o.trim()).filter(Boolean);

  if (allowed.includes(origin)) {
    return origin;
  }

  // Si el origen es localhost en cualquier puerto, lo permitimos.
  if (isLocalhost(origin)) {
    return origin;
  }

  // Devolvemos el primer origen permitido como valor por defecto.
  return allowed[0] || fallback;
}

function isLocalhost(origin) {
  try {
    const url = new URL(origin);
    return url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Procesamiento de la cotización
// ─────────────────────────────────────────────────────────────────────────────

async function handleQuote(request, env) {
  const origin = request.headers.get('Origin') || '';
  const cors = corsHeaders(origin, env);

  if (!isAllowedOrigin(origin, env)) {
    return jsonResponse({ error: 'Origen no autorizado.' }, 403);
  }

  const contentType = request.headers.get('Content-Type') || '';
  if (!contentType.includes('application/json')) {
    return jsonResponse({ error: 'Se espera Content-Type: application/json.' }, 415, cors);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: 'JSON inválido.' }, 400, cors);
  }

  const validation = validatePayload(payload);
  if (!validation.ok) {
    return jsonResponse({ error: validation.error }, 400, cors);
  }

  const sanitized = sanitizePayload(payload);
  const destination = env.NOTIFY_EMAIL || 'hola@caparazonestudios.com';

  const resendResult = await sendEmailWithResend(sanitized, destination, env);
  if (!resendResult.ok) {
    console.error('Resend error:', resendResult.error);
    return jsonResponse(
      { error: 'No se pudo enviar el correo. Inténtalo más tarde.' },
      502,
      cors,
    );
  }

  return jsonResponse(
    { success: true, message: 'Cotización enviada correctamente.' },
    200,
    cors,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Validación
// ─────────────────────────────────────────────────────────────────────────────

function validatePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, error: 'El cuerpo de la petición debe ser un objeto JSON.' };
  }

  const missing = REQUIRED_FIELDS.filter((field) => {
    const value = payload[field];
    return value === undefined || value === null || String(value).trim() === '';
  });

  if (missing.length > 0) {
    return {
      ok: false,
      error: `Campos obligatorios faltantes: ${missing.join(', ')}.`,
    };
  }

  if (!isValidEmail(payload.correo)) {
    return { ok: false, error: 'El correo electrónico no tiene un formato válido.' };
  }

  return { ok: true };
}

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(String(email).trim());
}

function isAllowedOrigin(origin, env) {
  if (isLocalhost(origin)) {
    return true;
  }

  const raw = env.ALLOWED_ORIGINS || '';
  const allowed = raw.split(',').map((o) => o.trim()).filter(Boolean);
  return allowed.includes(origin);
}

// ─────────────────────────────────────────────────────────────────────────────
// Sanitización básica
// ─────────────────────────────────────────────────────────────────────────────

function sanitizePayload(payload) {
  return {
    objetivo: String(payload.objetivo).trim(),
    estadoData: String(payload.estadoData).trim(),
    urgencia: String(payload.urgencia).trim(),
    inversion: String(payload.inversion).trim(),
    nombre: String(payload.nombre).trim(),
    negocio: String(payload.negocio).trim(),
    whatsapp: String(payload.whatsapp).trim(),
    correo: String(payload.correo).trim().toLowerCase(),
    mensaje: payload.mensaje ? String(payload.mensaje).trim() : '',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Envío vía Resend
// ─────────────────────────────────────────────────────────────────────────────

async function sendEmailWithResend(data, destination, env) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      error: 'RESEND_API_KEY no está configurada en el entorno.',
    };
  }

  const subject = `Nueva cotización · ${data.nombre} · ${data.negocio}`;
  const html = buildEmailHtml(data);

  const replyTo = data.correo;

  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${BRAND.name} <noreply@caparazonestudios.com>`,
        to: [destination],
        reply_to: replyTo,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        ok: false,
        error: `Resend respondió ${response.status}: ${text}`,
      };
    }

    const result = await response.json();
    return { ok: true, data: result };
  } catch (err) {
    return { ok: false, error: err.message || 'Error de red al contactar Resend.' };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Plantilla HTML del correo
// ─────────────────────────────────────────────────────────────────────────────

function buildEmailHtml(data) {
  const rows = [
    { label: 'Tipo de proyecto', value: data.objetivo },
    { label: 'Estado de la información', value: data.estadoData },
    { label: 'Plazos', value: data.urgencia },
    { label: 'Rango de presupuesto', value: data.inversion },
  ];

  const quoteRows = rows
    .map(
      (row) => `
      <tr>
        <td style="padding:18px 24px;border-bottom:1px solid ${BRAND.border};width:40%;vertical-align:top;">
          <p style="margin:0;font-size:12px;color:${BRAND.muted};text-transform:uppercase;letter-spacing:0.08em;">
            ${escapeHtml(row.label)}
          </p>
        </td>
        <td style="padding:18px 24px;border-bottom:1px solid ${BRAND.border};vertical-align:top;">
          <p style="margin:0;font-size:16px;color:${BRAND.text};font-weight:600;">
            ${escapeHtml(row.value)}
          </p>
        </td>
      </tr>
    `,
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nueva cotización · ${BRAND.name}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.bg};font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${BRAND.bg};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;border-radius:24px;overflow:hidden;background-color:${BRAND.surface};border:1px solid ${BRAND.border};">
          <!-- Header -->
          <tr>
            <td style="padding:40px 32px 24px;text-align:center;border-bottom:1px solid ${BRAND.border};">
              <p style="margin:0 0 8px;font-size:12px;color:${BRAND.primary};text-transform:uppercase;letter-spacing:0.15em;font-weight:700;">
                ${BRAND.name}
              </p>
              <h1 style="margin:0;font-size:24px;color:${BRAND.text};font-weight:700;">
                Nueva solicitud de cotización
              </h1>
              <p style="margin:12px 0 0;font-size:14px;color:${BRAND.muted};">
                Resumen recibido desde el formulario de diagnóstico.
              </p>
            </td>
          </tr>

          <!-- Quote summary -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${quoteRows}
              </table>
            </td>
          </tr>

          <!-- Contact data -->
          <tr>
            <td style="padding:32px 24px 0;">
              <p style="margin:0 0 18px;font-size:12px;color:${BRAND.primary};text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">
                Datos de contacto
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${BRAND.bg};border-radius:16px;border:1px solid ${BRAND.border};">
                <tr>
                  <td style="padding:18px 24px;border-bottom:1px solid ${BRAND.border};width:40%;vertical-align:top;">
                    <p style="margin:0;font-size:12px;color:${BRAND.muted};text-transform:uppercase;letter-spacing:0.08em;">Nombre</p>
                  </td>
                  <td style="padding:18px 24px;border-bottom:1px solid ${BRAND.border};vertical-align:top;">
                    <p style="margin:0;font-size:16px;color:${BRAND.text};font-weight:600;">${escapeHtml(data.nombre)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 24px;border-bottom:1px solid ${BRAND.border};width:40%;vertical-align:top;">
                    <p style="margin:0;font-size:12px;color:${BRAND.muted};text-transform:uppercase;letter-spacing:0.08em;">Negocio</p>
                  </td>
                  <td style="padding:18px 24px;border-bottom:1px solid ${BRAND.border};vertical-align:top;">
                    <p style="margin:0;font-size:16px;color:${BRAND.text};font-weight:600;">${escapeHtml(data.negocio)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 24px;border-bottom:1px solid ${BRAND.border};width:40%;vertical-align:top;">
                    <p style="margin:0;font-size:12px;color:${BRAND.muted};text-transform:uppercase;letter-spacing:0.08em;">WhatsApp</p>
                  </td>
                  <td style="padding:18px 24px;border-bottom:1px solid ${BRAND.border};vertical-align:top;">
                    <p style="margin:0;font-size:16px;color:${BRAND.text};font-weight:600;">
                      <a href="https://wa.me/${cleanPhone(data.whatsapp)}" style="color:${BRAND.primary};text-decoration:none;">${escapeHtml(data.whatsapp)}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 24px;width:40%;vertical-align:top;">
                    <p style="margin:0;font-size:12px;color:${BRAND.muted};text-transform:uppercase;letter-spacing:0.08em;">Correo</p>
                  </td>
                  <td style="padding:18px 24px;vertical-align:top;">
                    <p style="margin:0;font-size:16px;color:${BRAND.text};font-weight:600;">
                      <a href="mailto:${escapeHtml(data.correo)}" style="color:${BRAND.primary};text-decoration:none;">${escapeHtml(data.correo)}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Optional message -->
          ${
            data.mensaje
              ? `
          <tr>
            <td style="padding:32px 24px 0;">
              <p style="margin:0 0 18px;font-size:12px;color:${BRAND.primary};text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">
                Mensaje adicional
              </p>
              <div style="padding:20px 24px;background-color:${BRAND.bg};border:1px solid ${BRAND.border};border-radius:16px;">
                <p style="margin:0;font-size:15px;color:${BRAND.text};line-height:1.6;white-space:pre-wrap;">${escapeHtml(data.mensaje)}</p>
              </div>
            </td>
          </tr>
          `
              : ''
          }

          <!-- Footer -->
          <tr>
            <td style="padding:40px 32px 32px;text-align:center;border-top:1px solid ${BRAND.border};">
              <p style="margin:0;font-size:12px;color:${BRAND.muted};">
                Este resumen fue generado automáticamente por el worker de ${BRAND.name}.
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:${BRAND.muted};">
                Responder al correo del cliente usa el campo "Reply-To".
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilidades
// ─────────────────────────────────────────────────────────────────────────────

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function cleanPhone(number) {
  return number.replace(/[^\d+]/g, '');
}

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });
}
