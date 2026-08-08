export interface WizardOption {
  label: string;
  value: string;
}

export interface WizardStep {
  id: string;
  question: string;
  options: WizardOption[];
}

export interface ContactField {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
  validators?: string[];
}

export interface WizardAnswers {
  [stepId: string]: string;
}

export interface ContactData {
  nombre: string;
  negocio: string;
  whatsapp: string;
  correo: string;
}

export interface WizardPayload extends WizardAnswers, ContactData {}

export interface WizardConfig {
  steps: WizardStep[];
  contactFields: ContactField[];
  totalSteps: number;
}
