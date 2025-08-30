'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabase } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

type Poll = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  votes: number;
};

export default function PollsPage() {
  const { session } = useSupabase()!;
  const router = useRouter();
  // Mock data - will be replaced with actual API calls
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: '1',
      title: 'Favorite Programming Language',
      description: 'What programming language do you prefer to use?',
      createdAt: '2023-08-28',
      votes: 42,
    },
    {
      id: '2',
      title: 'Best Frontend Framework',
      description: 'Which frontend framework do you think is the best?',
      createdAt: '2023-08-27',
      votes: 36,
    },
    {
      id: '3',
      title: 'Remote Work Preference',
      description: 'Do you prefer working remotely or in an office?',
      createdAt: '2023-08-26',
      votes: 28,
    },
  ]);

  useEffect(() => {
    if (!session) {
      router.push('/auth');
    }
  }, [session, router]);

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Polls</h1>
        <Link href="/create-poll">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {polls.map((poll) => (
          <Link href={`/polls/${poll.id}`} key={poll.id} className="block">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{poll.title}</CardTitle>
                <CardDescription>{poll.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Created on {new Date(poll.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm">{poll.votes} votes</p>
                <Button variant="ghost" size="sm">
                  View Poll
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {polls.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground mb-4">No polls available yet</p>
          <Link href="/create-poll">
            <Button>Create Your First Poll</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
