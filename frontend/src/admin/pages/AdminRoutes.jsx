import React from 'react'
import { Route, Routes } from 'react-router'
import AdminSignIn from './AdminSignIn'
// import AdminSignUp from './AdminSignUp'
import Dashboard from './Index'
import Products from './Products'
import Users from './Users'
import NotFound from './NotFound'
import Blog from './Blog'

function AdminRoutes() {
  return (

    <Routes>
      <Route path='/' element={<Dashboard/>} />
      <Route path='/signin' element={<AdminSignIn />} />
      <Route path='/products' element={<Products/>} />
      <Route path='/users' element={<Users/>} />
      <Route path='/blog' element={<Blog/>} />
      <Route path='/*' element={<NotFound/>} />



      {/* <Route path='/signup' element={<AdminSignUp/>} /> */}
    </Routes>
  )
}

export default AdminRoutes