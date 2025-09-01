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
  created_at: string;
  // votes: number; // This will be calculated or fetched separately
};

export default function PollsPage() {
  const { session, supabase } = useSupabase()!;
  const router = useRouter();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/auth');
    } else {
      const fetchPolls = async () => {
        const { data, error } = await supabase.from('polls').select('*');
        if (error) {
          console.error('Error fetching polls:', error);
        } else {
          setPolls(data as Poll[]);
        }
        setLoading(false);
      };
      fetchPolls();
    }
  }, [session, router, supabase]);

  if (!session) {
    return null;
  }

  if (loading) {
    return <div className="container mx-auto py-8 px-4 text-center">Loading polls...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Polls</h1>
        <Link href="/create-poll" className="transition-transform duration-200 hover:scale-105 inline-block">
          <Button className="font-medium">Create New Poll</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {polls.map((poll) => (
          <Link href={`/polls/${poll.id}`} key={poll.id} className="block transition-all duration-300">
            <Card className="h-full hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="transition-colors duration-200 group-hover:text-primary">{poll.title}</CardTitle>
                <CardDescription>{poll.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Created on {new Date(poll.created_at).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                {/* <p className="text-sm">{poll.votes} votes</p> */}
                <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                  View Poll
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {polls.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground mb-4">No polls available yet</p>
          <Link href="/create-poll" className="transition-transform duration-200 hover:scale-105 inline-block">
            <Button className="font-medium shadow-md hover:shadow-lg">Create Your First Poll</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
