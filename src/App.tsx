/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { AppLayout } from "./layout/AppLayout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Analysis from "./pages/Analysis";
import Reports from "./pages/Reports";
import Pricing from "./pages/Pricing";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/pricing" element={<Pricing />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
