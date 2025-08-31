'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useSupabase } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  const { session, supabase } = useSupabase()!;
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };
  
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6">
        <Link href="/" className="font-bold text-xl mr-6">
          Polly
        </Link>
        
        <nav className="flex flex-1 items-center space-x-4 sm:space-x-6">
          <Link 
            href="/polls" 
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/polls' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Polls
          </Link>
          <Link 
            href="/create-poll" 
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/create-poll' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Create Poll
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {session ? (
            <>
              <p className="text-sm text-muted-foreground">{session.user?.email}</p>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/auth">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}