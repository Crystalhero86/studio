// @ts-nocheck
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { analyzeActivity } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, Sparkles } from 'lucide-react';
import { AiAssistedActivityLoggingOutput } from '@/ai/flows/ai-assisted-activity-logging-flow';

const activitySchema = z.object({
  description: z.string().min(10, 'Please provide a more detailed description.'),
  category: z.string().optional(),
  activityName: z.string().optional(),
  details: z.record(z.any()).optional(),
});

type ActivityFormData = z.infer<typeof activitySchema>;

export function ActivityLogger() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AiAssistedActivityLoggingOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      description: '',
    },
  });

  const handleAnalyze = async () => {
    const description = form.getValues('description');
    if (!description || description.length < 10) {
      form.setError('description', {
        type: 'manual',
        message: 'Please enter at least 10 characters to analyze.',
      });
      return;
    }

    setIsAnalyzing(true);
    setAiResult(null);

    const result = await analyzeActivity({ activityDescription: description });
    
    setIsAnalyzing(false);

    if (result.success && result.data) {
      setAiResult(result.data);
      form.setValue('category', result.data.category);
      form.setValue('activityName', result.data.activityName);
      form.setValue('details', result.data.extractedDetails);
      toast({
        title: 'Analysis Complete',
        description: 'AI has structured your activity. Please review and log.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: result.error || 'An unknown error occurred.',
      });
    }
  };

  const onSubmit = (data: ActivityFormData) => {
    // Here you would typically send the structured data to your backend
    console.log('Submitting data:', {
      category: aiResult?.category,
      activityName: aiResult?.activityName,
      details: aiResult?.extractedDetails,
      originalDescription: data.description,
    });

    toast({
      title: 'Activity Logged!',
      description: `"${aiResult?.activityName}" has been added to your history.`,
    });

    // Reset form
    form.reset({ description: '' });
    setAiResult(null);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Bot /> Describe Your Activity</CardTitle>
            <CardDescription>
              Write down what you did in plain English. For example, "I drove 15km to work in my petrol car" or "Had a beef steak for dinner".
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full gap-2">
              <Controller
                name="description"
                control={form.control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Describe your activity here..."
                    rows={6}
                    className="resize-none"
                  />
                )}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="button" onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
              {isAnalyzing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
            </Button>
          </CardFooter>
        </Card>

        <Card className={`lg:col-span-2 transition-opacity duration-500 ${aiResult || isAnalyzing ? 'opacity-100' : 'opacity-40'}`}>
          <CardHeader>
            <CardTitle className="font-headline">Structured Data</CardTitle>
            <CardDescription>
              Review the data extracted by the AI. You can make changes before logging.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center h-48 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">AI is processing your activity...</p>
              </div>
            )}
            {!isAnalyzing && aiResult && (
              <div className="space-y-4 animate-in fade-in-0 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="activityName">Activity Name</Label>
                        <Input id="activityName" defaultValue={aiResult.activityName} />
                    </div>
                     <div>
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" defaultValue={aiResult.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} />
                    </div>
                </div>
                 <div>
                    <Label>Extracted Details</Label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(aiResult.extractedDetails).map(([key, value]) => (
                            <div key={key}>
                                <Label htmlFor={`detail-${key}`} className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</Label>
                                <Input id={`detail-${key}`} defaultValue={value.toString()} />
                            </div>
                        ))}
                    </div>
                </div>
                 <div>
                    <Label>AI Reasoning</Label>
                    <p className="text-sm text-muted-foreground italic mt-1 p-3 bg-muted rounded-md">{aiResult.reasoning}</p>
                </div>
              </div>
            )}
            {!isAnalyzing && !aiResult && (
                <div className="flex flex-col items-center justify-center h-48 space-y-4 border-2 border-dashed rounded-lg">
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">AI analysis results will appear here.</p>
                </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={!aiResult || isAnalyzing} className="w-full">
              Log This Activity
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
}
