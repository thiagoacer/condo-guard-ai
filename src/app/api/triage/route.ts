import { NextRequest, NextResponse } from 'next/server';
import { TriageService } from '@/services/triageAnalysis';
import { SourceSchema } from '@/types/triage';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Basic Input Validation
        if (!body.message || !body.source || !body.senderId) {
            return NextResponse.json(
                { error: 'Missing required fields: message, source, senderId' },
                { status: 400 }
            );
        }

        // Validate Source matches enum
        const sourceResult = SourceSchema.safeParse(body.source);
        if (!sourceResult.success) {
            return NextResponse.json(
                { error: 'Invalid source. Must be WhatsApp, Email, or SMS' },
                { status: 400 }
            );
        }

        const result = await TriageService.analyze(
            body.message,
            sourceResult.data,
            body.senderId,
            body.senderName,
            body.senderUnit
        );

        return NextResponse.json(result);

    } catch (error) {
        console.error('Triage Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error processing triage' },
            { status: 500 }
        );
    }
}
