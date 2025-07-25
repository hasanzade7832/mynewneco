/* ─── src/index.tsx ─────────────────────────────────────────────── */
import 'ag-grid-enterprise';            // فقط همین کافیست تا امکانات Enterprise فعال شود
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
/* ──────────────────────────────────────────────────────────────── */
