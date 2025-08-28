'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type PollOption = {
  id: string;
  text: string;
  votes: number;
};

type Poll = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  options: PollOption[];
  totalVotes: number;
};

export default function PollPage() {
  const params = useParams();
  const pollId = params.id as string;
  
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data fetch - will be replaced with actual API call
    const fetchPoll = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockPoll: Poll = {
        id: pollId,
        title: 'Favorite Programming Language',
        description: 'What programming language do you prefer to use?',
        createdAt: '2023-08-28',
        options: [
          { id: 'opt1', text: 'JavaScript', votes: 15 },
          { id: 'opt2', text: 'Python', votes: 12 },
          { id: 'opt3', text: 'TypeScript', votes: 8 },
          { id: 'opt4', text: 'Java', votes: 7 },
        ],
        totalVotes: 42,
      };
      
      setPoll(mockPoll);
      setLoading(false);
    };
    
    fetchPoll();
  }, [pollId]);

  const handleVote = async () => {
    if (!selectedOption || hasVoted || !poll) return;
    
    // Update UI optimistically
    setPoll(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        options: prev.options.map(opt => 
          opt.id === selectedOption 
            ? { ...opt, votes: opt.votes + 1 } 
            : opt
        ),
        totalVotes: prev.totalVotes + 1
      };
    });
    
    setHasVoted(true);
    
    // In a real app, we would send the vote to the server here
    console.log(`Voted for option ${selectedOption} in poll ${pollId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <p>Loading poll...</p>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Poll not found</h1>
        <p className="mb-8">The poll you're looking for doesn't exist or has been removed.</p>
        <Link href="/polls">
          <Button>Back to Polls</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Link href="/polls" className="inline-flex items-center mb-6 text-sm hover:underline">
        ← Back to all polls
      </Link>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{poll.title}</CardTitle>
          <CardDescription>{poll.description}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {poll.options.map((option) => {
              const percentage = poll.totalVotes > 0 
                ? Math.round((option.votes / poll.totalVotes) * 100) 
                : 0;
                
              return (
                <div key={option.id} className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id={option.id}
                      name="poll-option"
                      value={option.id}
                      checked={selectedOption === option.id}
                      onChange={() => setSelectedOption(option.id)}
                      disabled={hasVoted}
                      className="mr-2"
                    />
                    <label htmlFor={option.id} className="flex-grow">
                      {option.text}
                    </label>
                    {hasVoted && (
                      <span className="text-sm font-medium">{percentage}%</span>
                    )}
                  </div>
                  
                  {hasVoted && (
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-muted-foreground">
            Total votes: {poll.totalVotes}
          </p>
          
          {!hasVoted ? (
            <Button 
              onClick={handleVote} 
              disabled={!selectedOption}
            >
              Submit Vote
            </Button>
          ) : (
            <p className="text-sm font-medium text-green-600">
              Thank you for voting!
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}