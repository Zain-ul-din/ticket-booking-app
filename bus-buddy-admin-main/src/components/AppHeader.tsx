import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useBookingStore } from '@/store/bookingStore';
import { ArrowLeft, Building2 } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  actions?: React.ReactNode;
}

export function AppHeader({ title, subtitle, backTo, actions }: AppHeaderProps) {
  const { terminal } = useBookingStore();

  return (
    <header className="border-b bg-card sticky top-0 z-10 print:hidden">
      <div className="container max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {backTo && (
              <Link to={backTo}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
            )}
            <div>
              <h1 className="text-xl font-bold">{title}</h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {actions}
            
            {/* Terminal Info */}
            {terminal && (
              <div className="hidden sm:flex items-center gap-2 pl-4 border-l">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium leading-tight">{terminal.name}</p>
                  <p className="text-xs text-muted-foreground">{terminal.city}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
