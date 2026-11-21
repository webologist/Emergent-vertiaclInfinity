import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/index.css";
import App from "@/App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

const container = document.getElementById("root");
const tree = (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

// Prerendered builds ship real HTML in #root — hydrate it; otherwise mount fresh (dev server).
if (container.hasChildNodes()) {
  ReactDOM.hydrateRoot(container, tree, { onRecoverableError: () => {} });
} else {
  ReactDOM.createRoot(container).render(tree);
}
