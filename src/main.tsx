import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Theme } from '@radix-ui/themes'
import Router from "../src/router";
import './index.css'
import "sweetalert2/dist/sweetalert2.min.css";

const queryCliente = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme>
      <QueryClientProvider client={queryCliente}>
        <Router />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </Theme>
  </StrictMode>,
)
