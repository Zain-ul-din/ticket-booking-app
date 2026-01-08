import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { BookingProvider } from '../contexts/BookingContext'
import { TooltipProvider } from '../components/ui/tooltip'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <BookingProvider>
      <TooltipProvider>
        <Component {...pageProps} />
      </TooltipProvider>
    </BookingProvider>
  )
}
