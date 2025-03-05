import React from 'react'
import { Route, Routes } from 'react-router'
import AdminSignIn from './AdminSignIn'
// import AdminSignUp from './AdminSignUp'
import Dashboard from './Dashboard'
import Products from './Products'
import Users from './Users'

function AdminRoutes() {
  return (

    <Routes>
      <Route path='/' element={<Dashboard/>} />
      <Route path='/signin' element={<AdminSignIn />} />
      {/* <Route path='/signup' element={<AdminSignUp/>} /> */}
      <Route path='/products' element={<Products/>} />
      <Route path='/users' element={<Users/>} />
    </Routes>
  )
}

export default AdminRoutes