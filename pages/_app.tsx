import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { BookingProvider } from '../contexts/BookingContext'
import { TerminalProvider, useTerminal } from '../contexts/TerminalContext'
import { TooltipProvider } from '../components/ui/tooltip'

// Component that checks terminal setup
function TerminalSetupGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isSetupComplete } = useTerminal();

  useEffect(() => {
    // Allow access to terminal-setup page itself
    if (router.pathname === '/terminal-setup') {
      return;
    }

    // Redirect to setup if not complete
    if (!isSetupComplete) {
      router.push('/terminal-setup');
    }
  }, [isSetupComplete, router]);

  // Show nothing while checking or redirecting
  if (!isSetupComplete && router.pathname !== '/terminal-setup') {
    return null;
  }

  return <>{children}</>;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TerminalProvider>
      <BookingProvider>
        <TooltipProvider>
          <TerminalSetupGuard>
            <Component {...pageProps} />
          </TerminalSetupGuard>
        </TooltipProvider>
      </BookingProvider>
    </TerminalProvider>
  )
}
