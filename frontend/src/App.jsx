import { BrowserRouter, Route, Routes } from "react-router"
import UserRoutes from "./pages/main/UserRoutes"
import AdminRoutes from "./pages/admin/AdminRoutes"
import UserLogin from "./pages/main/UserLogin"


function App() {

  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<UserRoutes/>} />
            <Route path="/admin/*" element={<AdminRoutes/>} />
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
