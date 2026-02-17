# Epic 1: MVP de Triagem e Resposta Automática

**Goal:** Implement a high-volume semantic triage engine for condominium management that classifies incoming messages (P0-P3) and generates automated responses or technical data blocks.

## Stories

### Story 1: Capture Inputs
- **Description:** Create an input interface (API/Simulated) to receive raw text messages from various sources (WhatsApp, Email, SMS).
- **Acceptance Criteria:**
  - System accepts JSON payload with `source`, `sender`, and `message`.
  - Input is logged with timestamp and unique `triage_id`.
  - Basic validation ensures message content is not empty.

### Story 2: Semantic Classification (Analyst Core)
- **Description:** Implement the Analyst agent logic to classify messages into P0-P3 priority levels and assign categories using the XML protocol.
- **Acceptance Criteria:**
  - Messages are correctly tagged with P0, P1, P2, or P3.
  - Category is assigned from the allowed list (Maintenance, Security, etc.).
  - Confidence score > 0.8 required for automated processing; detailed flag otherwise.

### Story 3: Response Generation & Data Block
- **Description:** Generate the appropriate output based on priority.
  - **High Urgency (P0/P1):** Empathetic, reassuring response + escalation alert.
  - **Low Urgency (P2/P3):** Technical data block for admin dashboard + informational receipt.
- **Acceptance Criteria:**
  - JSON output matches Architect schema.
  - Response tone adapts to priority level.
  - PII is sanitized in public fields.
