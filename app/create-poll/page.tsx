'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabase } from '@/contexts/AuthContext';

type PollOption = {
  id: string;
  text: string;
};

export default function CreatePollPage() {
  const router = useRouter();
  const { supabase, session } = useSupabase()!;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<PollOption[]>([
    { id: '1', text: '' },
    { id: '2', text: '' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionChange = (id: string, value: string) => {
    setOptions(prev => 
      prev.map(option => 
        option.id === id ? { ...option, text: value } : option
      )
    );
  };

  const addOption = () => {
    setOptions(prev => [...prev, { id: `${prev.length + 1}`, text: '' }]);
  };

  const removeOption = (id: string) => {
    if (options.length <= 2) return; // Minimum 2 options required
    setOptions(prev => prev.filter(option => option.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      alert('Please enter a poll title');
      return;
    }
    
    const validOptions = options.map(opt => opt.text.trim()).filter(Boolean);
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }
    
    if (!session) {
      alert('You must be logged in to create a poll.');
      router.push('/auth');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Insert the poll into the 'polls' table
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .insert({
          title,
          description,
          user_id: session.user.id,
        })
        .select()
        .single();

      if (pollError) throw pollError;

      // Insert the options into the 'options' table
      const optionsToInsert = validOptions.map(optionText => ({
        poll_id: pollData.id,
        text: optionText,
      }));

      const { error: optionsError } = await supabase
        .from('options')
        .insert(optionsToInsert);

      if (optionsError) throw optionsError;
      
      // Redirect to polls page
      router.push('/polls');
    } catch (error: any) {
      console.error('Full error creating poll:', JSON.stringify(error, null, 2));
      let errorMessage = 'Failed to create poll. Please try again.';
      if (error.message.includes('violates row-level security policy')) {
        errorMessage = 'Error: You do not have permission to create a poll. Please check the database security policies.';
      } else {
        errorMessage = `An unexpected error occurred: ${error.message}`;
      }
      alert(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Link href="/polls" className="inline-flex items-center mb-6 text-sm hover:underline">
        ← Back to polls
      </Link>
      
      <Card>
        <CardHeader>
          <CardTitle>Create a New Poll</CardTitle>
          <CardDescription>
            Fill out the form below to create your poll. You need at least two options.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Poll Title</Label>
              <Input
                id="title"
                placeholder="Enter your question here"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Add more context to your question"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div className="space-y-4">
              <Label>Poll Options</Label>
              
              {options.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                    required
                  />
                  {options.length > 2 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeOption(option.id)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={addOption}
                className="w-full mt-2"
              >
                Add Option
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push('/polls')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Poll'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}