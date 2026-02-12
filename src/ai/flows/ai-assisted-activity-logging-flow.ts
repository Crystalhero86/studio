'use server';
/**
 * @fileOverview A Genkit flow that assists users in describing daily activities
 * in natural language and parses them into structured data for carbon footprint calculation.
 *
 * - aiAssistedActivityLogging - A function that handles the AI-assisted activity logging process.
 * - AiAssistedActivityLoggingInput - The input type for the aiAssistedActivityLogging function.
 * - AiAssistedActivityLoggingOutput - The return type for the aiAssistedActivityLogging function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ActivityCategorySchema = z.enum([
  'transportation',
  'electricity_usage',
  'food_consumption',
  'shopping_lifestyle',
  'other', // For activities that don't fit neatly into the main categories
]).describe('The primary category of the activity.');

const AiAssistedActivityLoggingInputSchema = z.object({
  activityDescription: z
    .string()
    .describe('A natural language description of a daily activity.'),
});
export type AiAssistedActivityLoggingInput = z.infer<typeof AiAssistedActivityLoggingInputSchema>;

const AiAssistedActivityLoggingOutputSchema = z.object({
  category: ActivityCategorySchema,
  activityName: z.string().describe('A concise, descriptive name for the activity.'),
  extractedDetails: z.record(z.string(), z.any()).describe(
    'A JSON object containing key-value pairs of extracted details relevant for calculating carbon footprint. ' +
    'Examples: {"mode": "car", "distance_km": 10}, {"food_type": "beef", "quantity_grams": 200}, ' +
    '{"appliance": "laptop", "duration_hours": 3}, {"item": "t-shirt", "new_or_used": "new"}. ' +
    'Include numerical values as numbers, not strings.'
  ),
  reasoning: z.string().optional().describe('A brief explanation for the categorization and detail extraction.'),
});
export type AiAssistedActivityLoggingOutput = z.infer<typeof AiAssistedActivityLoggingOutputSchema>;

export async function aiAssistedActivityLogging(
  input: AiAssistedActivityLoggingInput
): Promise<AiAssistedActivityLoggingOutput> {
  return aiAssistedActivityLoggingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAssistedActivityLoggingPrompt',
  input: {schema: AiAssistedActivityLoggingInputSchema},
  output: {schema: AiAssistedActivityLoggingOutputSchema},
  prompt: `You are an AI assistant designed to help users categorize their daily activities and extract key details for carbon footprint calculation.
The user will provide a natural language description of an activity. Your task is to:
1. Identify the most appropriate category for the activity from 'transportation', 'electricity_usage', 'food_consumption', 'shopping_lifestyle', or 'other'.
2. Create a concise, descriptive name for the activity.
3. Extract all relevant details that would be useful for calculating the carbon footprint of this activity.
   Represent these details as a JSON object with key-value pairs.
   - For transportation, look for: mode (e.g., car, bus, train, flight, walk, bike), distance (e.g., 10 km, 5 miles), duration (e.g., 30 minutes), number of people. Convert distance to kilometers if specified in miles.
   - For electricity_usage, look for: appliance/device (e.g., laptop, TV, heater), duration (e.g., 2 hours), power consumption (e.g., 100 W, 0.5 kWh).
   - For food_consumption, look for: type of food (e.g., beef, chicken, vegetables, dairy, coffee), quantity (e.g., 200g, 1 serving, 1 cup), meal type (e.g., breakfast, lunch, dinner).
   - For shopping_lifestyle, look for: item bought (e.g., t-shirt, smartphone, groceries), quantity (e.g., 1, 5kg), whether it's new or used, estimated cost.
   - For 'other', extract general descriptive details.
   Ensure numerical values are parsed as numbers.
4. Provide a brief reasoning for your categorization and extracted details.

Here is the user's activity description:
{{{activityDescription}}}`,
});

const aiAssistedActivityLoggingFlow = ai.defineFlow(
  {
    name: 'aiAssistedActivityLoggingFlow',
    inputSchema: AiAssistedActivityLoggingInputSchema,
    outputSchema: AiAssistedActivityLoggingOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
