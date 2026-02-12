// @ts-nocheck
'use server';
import { aiAssistedActivityLogging } from '@/ai/flows/ai-assisted-activity-logging-flow';
import type { AiAssistedActivityLoggingInput } from '@/ai/flows/ai-assisted-activity-logging-flow';

export async function analyzeActivity(input: AiAssistedActivityLoggingInput) {
  try {
    const result = await aiAssistedActivityLogging(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('AI analysis failed:', error);
    // In a real app, you might want to log this error to a monitoring service
    return { success: false, error: 'Failed to analyze activity. The AI model may be temporarily unavailable.' };
  }
}
