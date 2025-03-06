import { BrowserRouter, Route, Routes } from "react-router"
import UserRoutes from './users/pages/UserRoutes'
import AdminRoutes from "./admin/pages/AdminRoutes"
import './App.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./ui/Tooltip";
import { Toaster } from "./ui/Toaster";
import { Toaster as Sonner } from "sonner"

const queryClient = new QueryClient();

function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/*" element={<UserRoutes />} />
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </>
  )
}

export default App
