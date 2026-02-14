// import "./styles/globals.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { RecipeProvider } from "./recipe/RecipeContext";
import { ViewProvider } from "./view/ViewContext";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecipeProvider>
      <ViewProvider>
        <App />
      </ViewProvider>
    </RecipeProvider>
  </StrictMode>,
)
