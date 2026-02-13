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
import { analyzeActivity, AnalyzedActivity } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Bot, Footprints, Loader2, Sparkles } from 'lucide-react';
import { useFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';


const activitySchema = z.object({
  description: z.string().min(10, 'Please provide a more detailed description.'),
});

type ActivityFormData = z.infer<typeof activitySchema>;

export function ActivityLogger() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AnalyzedActivity | null>(null);
  const { toast } = useToast();
  const { firestore, user } = useFirebase();

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
      toast({
        title: 'Analysis Complete',
        description: `Carbon footprint calculated: ${result.data.co2e} kg CO₂e`,
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
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Signed In',
        description: 'You must be signed in to log activities.',
      });
      return;
    }

    if (!aiResult) {
      toast({
        variant: 'destructive',
        title: 'No AI Result',
        description: 'Please analyze the activity first.',
      });
      return;
    }

    // Prepare data for Firestore, creating a details object from the flat AI result
    const details = {
      itemName: aiResult.itemName,
      quantity: aiResult.quantity,
      unit: aiResult.unit,
    };

    const activityData = {
      userId: user.uid,
      activityName: aiResult.activityName,
      category: aiResult.category,
      details: details,
      rawInput: data.description,
      activityDate: new Date(),
      createdAt: serverTimestamp(),
      status: 'Pending',
      co2e: aiResult.co2e,
    };

    const activitiesRef = collection(firestore, 'users', user.uid, 'carbonActivities');
    addDocumentNonBlocking(activitiesRef, activityData);

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
            <CardTitle className="font-headline">Structured Data &amp; Footprint</CardTitle>
            <CardDescription>
              Review the data and calculated footprint. This will be saved to your history.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">AI is processing and calculating...</p>
              </div>
            )}
            {!isAnalyzing && aiResult && (
              <div className="space-y-6 animate-in fade-in-0 duration-500">
                <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-6 text-center">
                  <span className="text-sm text-muted-foreground">Estimated Carbon Footprint</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tight text-primary">{aiResult.co2e}</span>
                    <span className="text-xl font-medium text-muted-foreground">kg CO₂e</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Activity Name</Label>
                        <p className="font-medium">{aiResult.activityName}</p>
                    </div>
                     <div>
                        <Label>Category</Label>
                        <p className="font-medium capitalize">{aiResult.category.replace(/_/g, ' ')}</p>
                    </div>
                </div>
                 <div>
                    <Label>Extracted Details</Label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Item</Label>
                        <p className="font-medium capitalize">{aiResult.itemName}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Quantity</Label>
                        <p className="font-medium">{aiResult.quantity}</p>
                      </div>
                       <div>
                        <Label className="text-xs text-muted-foreground">Unit</Label>
                        <p className="font-medium">{aiResult.unit}</p>
                      </div>
                    </div>
                </div>
                 <div>
                    <Label>AI Reasoning</Label>
                    <p className="text-sm text-muted-foreground italic mt-1 p-3 bg-muted rounded-md">{aiResult.reasoning}</p>
                </div>
              </div>
            )}
            {!isAnalyzing && !aiResult && (
                <div className="flex flex-col items-center justify-center h-64 space-y-4 border-2 border-dashed rounded-lg">
                    <Footprints className="h-10 w-10 text-muted-foreground/50" />
                    <p className="text-muted-foreground">Footprint calculation will appear here.</p>
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
