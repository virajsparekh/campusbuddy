import AppRoutes from './routes/AppRoutes';
import './App.css';
import './styles/StudyHub.css';
import './styles/UserProfile.css';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Prevent automatic scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Prevent automatic scrolling on page load
    const preventAutoScroll = () => {
      window.scrollTo(0, 0);
    };
    
    // Prevent scroll on focus
    const preventFocusScroll = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
        e.target.scrollIntoView = () => {};
      }
    };
    
    // Add event listeners
    window.addEventListener('load', preventAutoScroll);
    document.addEventListener('focusin', preventFocusScroll);
    
    // Force scroll to top on mount
    setTimeout(preventAutoScroll, 0);
    
    return () => {
      window.removeEventListener('load', preventAutoScroll);
      document.removeEventListener('focusin', preventFocusScroll);
    };
  }, []);

  return <AppRoutes />;
}

export default App;
