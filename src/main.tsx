import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client/react";
import client from "./lib/apollo.ts";
import App from "./App.tsx";
import "./index.css";

// Import test utilities in development mode
if (import.meta.env.DEV) {
  import('./test-backend.ts');
}

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
