import type { WizardStep, ContactField } from "../types/wizard";

export const cotizacionSteps: WizardStep[] = [
  {
    id: "objetivo",
    question: "¿Cuál es el objetivo principal de tu proyecto?",
    options: [
      {
        label: "Crear mi primera tienda online (E-commerce)",
        value: "Primera Tienda (E-commerce)",
      },
      {
        label: "Migrar/Acelerar mi tienda actual (Ya vendo, pero es lenta)",
        value: "Migración/Aceleración",
      },
      {
        label: "Catálogo digital / Sitio corporativo de alta gama",
        value: "Catálogo B2B / Corporativo",
      },
      { label: "Desarrollo a la medida", value: "A la Medida" },
    ],
  },
  {
    id: "estadoData",
    question: "¿Cuál es el estado actual de la información de tu negocio?",
    options: [
      {
        label: "Tengo todo listo: Fotos profesionales, textos y productos",
        value: "Todo Listo",
      },
      {
        label:
          "Tengo la base, pero necesito ayuda para organizar el contenido",
        value: "Necesita Ayuda con Data",
      },
      {
        label: "No tengo nada todavía, estoy partiendo desde cero",
        value: "Desde Cero (Sin Data)",
      },
    ],
  },
  {
    id: "urgencia",
    question: "¿Para cuándo necesitas tener la plataforma online?",
    options: [
      { label: "¡Para ayer! (Urgente)", value: "Urgente" },
      {
        label: "En los próximos 30 a 45 días (Plazo ideal)",
        value: "30-45 días",
      },
      {
        label: "No tengo prisa, busco calidad ante todo",
        value: "Sin Prisa / Calidad",
      },
    ],
  },
  {
    id: "inversion",
    question:
      "¿Qué rango de inversión tienes proyectado para este desarrollo?",
    options: [
      { label: "Menos de $500.000 CLP", value: "Bajo (<500k)" },
      {
        label: "Entre $600.000 y $1.000.000 CLP",
        value: "Plan Catálogo (600k-1M)",
      },
      {
        label: "Entre $1.200.000 y $2.000.000 CLP",
        value: "Plan Headless (1.2M-2M)",
      },
      { label: "Más de $2.000.000 CLP", value: "Corporativo (>2M)" },
    ],
  },
];

export const contactFields: ContactField[] = [
  {
    id: "nombre",
    name: "nombre",
    label: "Nombre",
    type: "text",
    placeholder: "Tu nombre",
    required: true,
    validators: ["required"],
  },
  {
    id: "negocio",
    name: "negocio",
    label: "Negocio",
    type: "text",
    placeholder: "Nombre de tu negocio",
    required: true,
    validators: ["required"],
  },
  {
    id: "whatsapp",
    name: "whatsapp",
    label: "WhatsApp",
    type: "tel",
    placeholder: "+56 9 1234 5678",
    required: true,
    validators: ["required", "whatsapp"],
  },
  {
    id: "correo",
    name: "correo",
    label: "Correo",
    type: "email",
    placeholder: "hola@tunegocio.cl",
    required: true,
    validators: ["required", "email"],
  },
];
