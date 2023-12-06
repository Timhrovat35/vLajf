import React from 'react';
import AppNavigation from './Navigation/appNavigation';
import { ThemeProvider } from './Components/ThemeContext';
import { MotiProvider } from 'moti';

function App() {
  return (
    <ThemeProvider>
      <AppNavigation />
    </ThemeProvider>
  )

}

export default App;