// @ts-nocheck
'use server';
import { aiAssistedActivityLogging } from '@/ai/flows/ai-assisted-activity-logging-flow';
import type { AiAssistedActivityLoggingInput, AiAssistedActivityLoggingOutput } from '@/ai/flows/ai-assisted-activity-logging-flow';
import { emissionFactors } from '@/lib/emission-factors';

// Define a new output type that includes the calculated co2e
export type AnalyzedActivity = AiAssistedActivityLoggingOutput & {
  co2e: number;
};

function calculateEmissions(item: AiAssistedActivityLoggingOutput): number {
  const factor = emissionFactors.find(f => f.name === item.itemName);

  if (!factor) {
    console.warn(`No emission factor found for item: ${item.itemName}`);
    return 0;
  }

  let quantity = item.quantity;
  
  // Unit conversion
  // Convert user's grams to kg if factor is in kg
  if (item.unit === 'g' && factor.unit === 'kg') {
    quantity = quantity / 1000;
  }
  // Convert user's miles to km if factor is in km
  if (item.unit === 'mile' && factor.unit === 'km') {
    quantity = quantity * 1.60934;
  }
  
  // Add other conversions as needed

  const co2e = quantity * factor.value;
  return parseFloat(co2e.toFixed(3));
}

export async function analyzeActivity(input: AiAssistedActivityLoggingInput): Promise<{ success: true, data: AnalyzedActivity } | { success: false, error: string }> {
  try {
    const aiResult = await aiAssistedActivityLogging(input);
    const co2e = calculateEmissions(aiResult);
    
    const data: AnalyzedActivity = {
      ...aiResult,
      co2e,
    };

    return { success: true, data };
  } catch (error) {
    console.error('AI analysis failed:', error);
    // In a real app, you might want to log this error to a monitoring service
    return { success: false, error: 'Failed to analyze activity. The AI model may be temporarily unavailable or could not parse the input.' };
  }
}
