import React from 'react'
import { Route, Routes } from 'react-router'
import UserLogin from '../../users/pages/UserLogin'
import UserSignUp from './UserSignUp'
import Home from '../../users/pages/Home'

function UserRoutes() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/signup' element={<UserSignUp />} />
      </Routes>
    </>
  )
}

export default UserRoutes