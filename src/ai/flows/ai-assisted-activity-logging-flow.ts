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
  activityName: z.string().describe('A concise, descriptive name for the activity. E.g., "Lunch with Chicken" or "Drive to work".'),
  itemName: z.string().toLowerCase().describe('The primary item keyword for footprint calculation (e.g., "chicken", "beef", "petrol car", "bus"). Must be in lowercase.'),
  quantity: z.number().describe('The numerical quantity of the activity (e.g., distance in km, weight in grams).'),
  unit: z.enum(['g', 'kg', 'km', 'mile', 'hour', 'kwh', 'serving']).describe('The unit of measurement for the quantity.'),
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
  prompt: `You are an AI assistant for a carbon footprint tracker. Your task is to parse a user's natural language description of an activity into structured data.

Your response MUST follow this structure:
1.  **category**: Choose the most appropriate category: 'transportation', 'electricity_usage', 'food_consumption', 'shopping_lifestyle', or 'other'.
2.  **activityName**: Create a short, descriptive name for the activity.
3.  **itemName**: Extract the single most relevant lowercase keyword for calculation. This is critical. Examples: "chicken", "beef", "petrol car", "bus", "train", "domestic flight", "cotton t-shirt".
4.  **quantity**: Extract the numerical amount. Default to 1 if it is a single item (like 'a t-shirt'). If a unit is specified (e.g., miles, g), convert it to a standard unit for the 'unit' field. E.g., convert 15 miles to 24.14 km and output 24.14.
5.  **unit**: Extract the unit of measurement. Must be one of: 'g', 'kg', 'km', 'mile', 'hour', 'kwh', 'serving'. If the user gives grams, use 'g'. If they give kg, use 'kg'. If they give miles, use 'mile'.
6.  **reasoning**: Briefly explain your logic.

Example 1:
User input: "I drove 15km to work in my petrol car"
Your output:
{
  "category": "transportation",
  "activityName": "Drive to work",
  "itemName": "petrol car",
  "quantity": 15,
  "unit": "km",
  "reasoning": "The user drove a petrol car for 15 km, which falls under transportation."
}

Example 2:
User input: "Had a 200g fried chicken for lunch"
Your output:
{
  "category": "food_consumption",
  "activityName": "Lunch with Fried Chicken",
  "itemName": "chicken",
  "quantity": 200,
  "unit": "g",
  "reasoning": "The user ate 200g of chicken, which is a food consumption activity."
}

Example 3:
User input: "I bought a new pair of jeans"
Your output:
{
  "category": "shopping_lifestyle",
  "activityName": "Bought new jeans",
  "itemName": "jeans",
  "quantity": 1,
  "unit": "serving",
  "reasoning": "The user bought one item (a pair of jeans), which is a shopping activity."
}


Now, parse the following user activity:
"{{{activityDescription}}}"`,
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
