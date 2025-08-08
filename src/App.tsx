import { Toaster } from 'sonner';
import Router from './router';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <Router />
      <Toaster 
        position="top-right"
        richColors
        closeButton
        duration={4000}
      />
    </LanguageProvider>
  );
}

export default App;
