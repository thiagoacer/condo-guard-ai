import { v4 as uuidv4 } from 'uuid';
import {
    TriageOutputSchema,
    TriageOutput,
    Priority,
    Category,
    Source
} from '@/types/triage';

// Simulation logic for MVP until LLM integration
export class TriageService {
    static async analyze(
        message: string,
        source: Source,
        senderId: string,
        senderName?: string,
        senderUnit?: string
    ): Promise<TriageOutput> {

        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const lowerMsg = message.toLowerCase();
        let priority: Priority = 'P3';
        let category: Category = 'Administration';
        let confidence = 0.9;
        let actionRequired = false;
        let summary = "Consulta geral";
        let suggestedResponse = "Olá, recebemos sua mensagem. Retornaremos em breve.";

        // --- Simple Rule-Based Simulation (to be replaced by LLM) ---

        // P0 - Urgent
        if (lowerMsg.match(/(fogo|incêndio|vazamento grave|cano estourou|roubo|ladrão|socorro|gás|fumaça|explosão)/)) {
            priority = 'P0';
            category = 'Security';
            if (lowerMsg.includes('vazamento') || lowerMsg.includes('cano') || lowerMsg.includes('gás')) category = 'Maintenance';
            actionRequired = true;
            confidence = 0.98;
            summary = "CRÍTICO: Relato de emergência (fogo/gás/segurança)";
            suggestedResponse = "🚨 Recebemos seu alerta de emergência! A equipe de segurança e manutenção foi notificada IMEDIATAMENTE. Por favor, aguarde em local seguro.";
        }
        // P1 - High
        else if (lowerMsg.match(/(elevador|portão|sem água|sem luz|internet)/)) {
            priority = 'P1';
            category = 'Maintenance';
            actionRequired = true;
            confidence = 0.95;
            summary = "ALTA: Problema estrutural ou de serviço essência";
            suggestedResponse = "⚠️ Identificamos um problema prioritário. Nossa equipe técnica já foi acionada para verificar. O prazo estimado de diagnóstico é de 2 horas.";
        }
        // P2 - Medium
        else if (lowerMsg.match(/(barulho|festa|sujeira|limpeza|lâmpada queimada)/)) {
            priority = 'P2';
            category = lowerMsg.includes('barulho') ? 'Community' : 'Maintenance';
            actionRequired = false; // System can handle auto-ticket
            confidence = 0.88;
            summary = "MÉDIA: Reclamação de convivência ou manutenção leve";
            suggestedResponse = "📝 Registramos sua solicitação. Um chamado foi aberto e será analisado pelo zelador no próximo dia útil. Protocolo: #" + uuidv4().slice(0, 6);
        }
        // P3 - Low (Default)
        else {
            priority = 'P3';
            category = 'Administration';
            if (lowerMsg.includes('boleto') || lowerMsg.includes('pagamento')) category = 'Financial';
            actionRequired = false;
            confidence = 0.85;
            summary = "BAIXA: Dúvida administrativa ou financeira";
            suggestedResponse = "Olá! Recebemos sua dúvida. Nossa administração responderá em até 24h úteis. Caso seja sobre boletos, você pode retirar a 2ª via no app.";
        }

        const traces: any[] = [];
        const addTrace = (agent: 'Analyst' | 'Architect' | 'Dev' | 'Agente de Portaria' | 'Jurista', step: string, status: 'processing' | 'success' | 'warning' | 'error', details?: string) => {
            traces.push({
                agent,
                step,
                status,
                details,
                timestamp: Date.now()
            });
        };

        // 1. Analyst Agent - Consumption
        addTrace('Analyst', 'Ingesting message from source', 'processing');
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate think time
        addTrace('Analyst', 'Parsing semantics and intent', 'success', `Detected keywords in "${lowerMsg.slice(0, 20)}..."`);

        // --- Reservation Logic (Sub-Agent: Gestor de Reservas) ---
        let reservation: any = undefined;

        if (lowerMsg.includes('reserva') || lowerMsg.includes('churrasqueira') || lowerMsg.includes('salão')) {
            addTrace('Analyst', 'Intent Detected: Space Reservation', 'success', 'Routing to Reservation Sub-Agent');

            const isUrgentRequest = lowerMsg.includes('hoje') || lowerMsg.includes('amanhã');
            const space = lowerMsg.includes('churrasqueira') ? 'CHURRASQUEIRA_GORMET' : 'SALAO_FESTAS_A';

            // Constraint Check: 48h Advance Notice
            if (isUrgentRequest) {
                addTrace('Analyst', 'Constraint Check Failed', 'warning', 'Rule: Minimum 48h advance notice required');
                reservation = {
                    intent: 'RESERVA_ESPACO',
                    espaco: space,
                    morador_id: senderUnit || 'UNKNOWN_UNIT',
                    status: 'denied',
                    motivo_recusa: 'Regra de Antecedência: Pedidos devem ser feitos com 48h de antecedência.'
                };
                suggestedResponse = "🚫 Infelizmente não podemos confirmar. O regulamento exige 48h de antecedência para reservas.";
                summary = "RESERVA NEGADA: Antecedência insuficiente";
            } else {
                addTrace('Analyst', 'Constraint Check Passed', 'success', 'User valid, Schedule open');
                reservation = {
                    intent: 'RESERVA_ESPACO',
                    espaco: space,
                    data_iso: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // Mock date +3 days
                    morador_id: senderUnit || 'UNKNOWN_UNIT',
                    status: 'confirmed'
                };
                suggestedResponse = `✅ Reserva confirmada para o ${space.replace('_', ' ')}. Um convite QR Code foi enviado para seu e-mail.`;
                summary = "RESERVA CONFIRMADA: Espaço agendado com sucesso";
            }
            category = 'Community';
            priority = 'P3';
        }

        // --- Visitor Access Logic (Sub-Agent: Agente de Portaria) ---
        let visitor_access: any = undefined;

        if (lowerMsg.includes('entrada') || lowerMsg.includes('visita') || lowerMsg.includes('qr') || lowerMsg.includes('autoriza')) {
            addTrace('Analyst', 'Intent Detected: Visitor Access', 'success', 'Routing to Agente de Portaria');

            const isService = lowerMsg.includes('técnico') || lowerMsg.includes('entregador') || lowerMsg.includes('pedreiro');
            const visitorName = lowerMsg.match(/(?:liberar|entrada|para|senhor|senhora)\s+([A-ZÀ-Ú][a-zà-ú]+(?:\s[A-ZÀ-Ú][a-zà-ú]+)*)/i)?.[1] || "Visitante";

            addTrace('Analyst', 'Entity Extraction', 'success', `Visitor: ${visitorName}, Type: ${isService ? 'SERVICE' : 'GUEST'}`);

            // Generating Mock Secure Token
            const token = `QR-${uuidv4().split('-')[0].toUpperCase()}-${Date.now().toString().slice(-4)}`;

            addTrace('Agente de Portaria', 'Generating Secure Token', 'processing');
            await new Promise(resolve => setTimeout(resolve, 300));
            addTrace('Agente de Portaria', 'Token Generated', 'success', `Token: ${token}`);

            visitor_access = {
                intent: 'LIBERAR_ACESSO',
                nome_visitante: visitorName,
                tipo: isService ? 'PRESTADOR_SERVICO' : 'VISITANTE',
                data_validade: new Date(Date.now() + 86400000).toISOString(), // Valid for 24h
                qr_code_token: token,
                status: 'authorized'
            };

            suggestedResponse = `🔓 Acesso autorizado para ${visitorName}. O QR Code foi gerado e é válido por 24h.`;
            summary = `ACESSO LIBERADO: ${visitorName} (${isService ? 'Prestador' : 'Visitante'})`;
            category = 'Security';
            priority = 'P2';
        }

        // --- RAG Logic (Sub-Agent: Jurista / CondoGPT) ---
        let rag_response: any = undefined;

        if (!reservation && !visitor_access && (lowerMsg.includes('pode') || lowerMsg.includes('posso') || lowerMsg.includes('regra') || lowerMsg.includes('lei') || lowerMsg.includes('horário'))) {
            addTrace('Analyst', 'Intent Detected: Regulatory Inquiry', 'success', 'Routing to Jurist Agent (CondoGPT)');

            // Imported lazily to avoid circular deps if any, but fine here
            const { CONDO_REGULATIONS } = require('../data/regulations');

            addTrace('Jurista', 'Retrieving Documents', 'processing', 'Searching Knowledge Base...');
            await new Promise(resolve => setTimeout(resolve, 600)); // Simulate vector search latency

            // Improved Semantic Search (Rank by Keyword Matches)
            const relevantArticle = CONDO_REGULATIONS
                .map((reg: any) => ({
                    ...reg,
                    score: reg.topic.reduce((acc: number, t: string) => lowerMsg.includes(t) ? acc + 1 : acc, 0)
                }))
                .filter((reg: any) => reg.score > 0)
                .sort((a: any, b: any) => b.score - a.score)[0];

            if (relevantArticle) {
                addTrace('Jurista', 'Document Found', 'success', `Match: ${relevantArticle.article} (Confidence: 0.95)`);

                rag_response = {
                    intent: 'CONSULTA_REGRAS',
                    pergunta_identificada: message,
                    resposta: `De acordo com o nosso regulamento, ${relevantArticle.content.toLowerCase()}`,
                    citacoes: [{
                        artigo: relevantArticle.article,
                        texto: relevantArticle.content
                    }],
                    confianca: 0.95
                };

                suggestedResponse = `📜 ${relevantArticle.article}: ${relevantArticle.content}`;
                summary = `CONSULTA JURÍDICA: ${relevantArticle.article} - ${relevantArticle.topic[0].toUpperCase()}`;
                category = 'Administration';
                priority = 'P3';
            } else {
                addTrace('Jurista', 'No Document Found', 'warning', 'Low confidence on retrieval');
                // Fallback or generic response
            }
        }

        const resultBody = {
            triage_id: uuidv4(),
            timestamp: new Date().toISOString(),
            source,
            sender: {
                id: senderId,
                name: senderName,
                unit: senderUnit,
            },
            classification: {
                priority,
                category,
                confidence_score: confidence,
            },
            summary,
            action_required: actionRequired,
            suggested_response: suggestedResponse,
            original_message: message,
            agent_traces: traces,
            reservation,
            visitor_access,
            rag_response
        };

        // 2. Analyst Agent - Classification
        addTrace('Analyst', 'Determining Priority Protocol', 'success', `Classified as ${priority} based on keyword match`);

        // 3. Architect Agent - Validation
        addTrace('Architect', 'Validating JSON Schema compliance', 'processing');
        await new Promise(resolve => setTimeout(resolve, 200));

        if (confidence < 0.8 && (priority === 'P0' || priority === 'P1')) {
            addTrace('Architect', 'Quality Gate Warning', 'warning', 'High priority with low confidence requires human review');
        } else {
            addTrace('Architect', 'Quality Gate Passed', 'success', 'Schema and Confidence thresholds met');
        }

        // 4. Dev Agent - Triggers
        if (actionRequired) {
            addTrace('Dev', 'Triggering Emergency Workflows', 'processing');
            await new Promise(resolve => setTimeout(resolve, 200));
            addTrace('Dev', 'Webhook Dispatched', 'success', 'Sent payload to OpsGenie/Twilio');
        } else {
            addTrace('Dev', 'Logging Routine Interaction', 'success', 'Saved to database without escalation');
        }

        const finalResult = { ...resultBody, agent_traces: traces };

        // Validate with Zod
        return TriageOutputSchema.parse(finalResult);
    }
}
