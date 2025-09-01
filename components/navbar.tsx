'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useSupabase } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { session, supabase } = useSupabase()!;
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-sm transition-all duration-200 ${isScrolled ? 'shadow-md bg-background/80' : 'bg-background'}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center group">
            <div className="flex items-center font-bold text-xl">
              <span className="bg-primary text-primary-foreground rounded px-2 py-0.5 transition-all duration-200 group-hover:shadow-md group-hover:bg-primary/90">Polly</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/polls" 
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/polls' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
            >
              Polls
            </Link>
            <Link 
              href="/create-poll" 
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/create-poll' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
            >
              Create Poll
            </Link>
          </nav>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-md hover:bg-muted hover:text-primary transition-all duration-200"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          {session ? (
            <>
              <p className="text-sm text-muted-foreground hidden sm:block">{session.user?.email}</p>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="hover:bg-primary hover:text-primary-foreground transition-colors">
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/auth">
              <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t p-4 bg-background">
          <nav className="flex flex-col space-y-4">
            <Link 
              href="/polls" 
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/polls' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Polls
            </Link>
            <Link 
              href="/create-poll" 
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/create-poll' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Create Poll
            </Link>
            <div className="flex items-center justify-between pt-4 border-t">
              <ThemeToggle />
              {session ? (
                <>
                  <p className="text-sm text-muted-foreground">{session.user?.email?.split('@')[0]}</p>
                  <Button variant="outline" size="sm" onClick={handleSignOut} className="hover:bg-primary hover:text-primary-foreground transition-colors">
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}