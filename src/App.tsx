// src/App.tsx
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navigation from "@/router/Navigation";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <Navigation />
      </Router>
    </ThemeProvider>
  );
}

export default App;
