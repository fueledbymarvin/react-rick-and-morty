import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AxiosError } from "axios";
import "./index.css";
import Home from "./Home";
import Character from "./Character";
import NotFound from "./NotFound";
import ScrollToTop from "./ScrollToTop";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (_count, error) =>
        !(error instanceof AxiosError && error.response?.status === 404),
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route index element={<Home />} />
          <Route path="c/:id" element={<Character />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
