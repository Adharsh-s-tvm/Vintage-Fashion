import { BrowserRouter, Route, Routes } from "react-router"
import UserRoutes from './users/pages/UserRoutes'
import AdminRoutes from "./admin/pages/AdminRoutes"
import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
