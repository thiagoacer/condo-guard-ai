import { z } from 'zod';

// --- Primitives ---
export const PrioritySchema = z.enum(['P0', 'P1', 'P2', 'P3']);
export type Priority = z.infer<typeof PrioritySchema>;

export const CategorySchema = z.enum([
  'Maintenance',
  'Security',
  'Administration',
  'Financial',
  'Community'
]);
export type Category = z.infer<typeof CategorySchema>;

export const SourceSchema = z.enum(['WhatsApp', 'Email', 'SMS']);
export type Source = z.infer<typeof SourceSchema>;

// --- Entities ---
export const SenderSchema = z.object({
  id: z.string().describe("Hashed ID of the sender"),
  unit: z.string().optional().describe("Unit number if available"),
  name: z.string().optional().describe("Name if available"),
});
export type Sender = z.infer<typeof SenderSchema>;

// --- Classification ---
export const ClassificationSchema = z.object({
  priority: PrioritySchema,
  category: CategorySchema,
  confidence_score: z.number().min(0).max(1).describe("Confidence score 0.0-1.0"),
});
export type Classification = z.infer<typeof ClassificationSchema>;

// --- Agent Trace ---
export const AgentTraceSchema = z.object({
  agent: z.enum(['Analyst', 'Architect', 'Dev', 'Agente de Portaria', 'Jurista']),
  step: z.string(),
  status: z.enum(['processing', 'success', 'warning', 'error']),
  details: z.string().optional(),
  timestamp: z.number()
});
export type AgentTrace = z.infer<typeof AgentTraceSchema>;

// --- Reservation Output ---
export const ReservationSchema = z.object({
  intent: z.literal('RESERVA_ESPACO'),
  espaco: z.string(),
  data_iso: z.string().optional(),
  morador_id: z.string(),
  status: z.enum(['confirmed', 'denied', 'pending_confirmation']),
  motivo_recusa: z.string().optional()
});
export type Reservation = z.infer<typeof ReservationSchema>;

// --- Visitor Access Output ---
export const VisitorAccessSchema = z.object({
  intent: z.literal('LIBERAR_ACESSO'),
  nome_visitante: z.string(),
  tipo: z.enum(['VISITANTE', 'PRESTADOR_SERVICO']),
  data_validade: z.string().datetime().optional(),
  qr_code_token: z.string(),
  status: z.enum(['authorized', 'denied'])
});
export type VisitorAccess = z.infer<typeof VisitorAccessSchema>;

// --- RAG Output (The Jurist) ---
export const RAGResponseSchema = z.object({
  intent: z.literal('CONSULTA_REGRAS'),
  pergunta_identificada: z.string(),
  resposta: z.string(),
  citacoes: z.array(z.object({
    artigo: z.string(),
    texto: z.string()
  })),
  confianca: z.number()
});
export type RAGResponse = z.infer<typeof RAGResponseSchema>;

// --- Main Output Schema ---
export const TriageOutputSchema = z.object({
  triage_id: z.string().uuid().describe("Unique UUID for this triage event"),
  timestamp: z.string().datetime().describe("ISO 8601 timestamp"),
  source: SourceSchema,
  sender: SenderSchema,
  classification: ClassificationSchema,
  summary: z.string().describe("Concise summary of the issue"),
  action_required: z.boolean().describe("Whether immediate action is needed"),
  suggested_response: z.string().optional().describe("Drafted response based on priority"),
  original_message: z.string().optional().describe("Original text content"),
  agent_traces: z.array(AgentTraceSchema).optional().describe("Log of agent activities"),
  reservation: ReservationSchema.optional().describe("Reservation details"),
  visitor_access: VisitorAccessSchema.optional().describe("Visitor access details"),
  rag_response: RAGResponseSchema.optional().describe("Legal advice from CondoGPT"),
});

export type TriageOutput = z.infer<typeof TriageOutputSchema>;

// --- Quality Gates ---
export const QualityGateSchema = TriageOutputSchema.refine(
  (data) => {
    // Critical (P0) or High (P1) requires high confidence
    if (['P0', 'P1'].includes(data.classification.priority)) {
      return data.classification.confidence_score >= 0.8;
    }
    return true;
  },
  {
    message: "High priority classification requires confidence score >= 0.8",
    path: ["classification", "confidence_score"],
  }
);
