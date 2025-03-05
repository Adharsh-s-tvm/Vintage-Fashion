import React from 'react'
import { Route, Routes } from 'react-router'
import UserLogin from '../../users/pages/UserLogin'
import UserSignUp from './UserSignUp'
import Home from '../../users/pages/Home'
import NotFound from '../../ui/NotFound'
import ProductList from './ProductListing'
import Cart from './Cart'
import WishList from './WishList'
import Orders from './Orders'
import UserDashboard from './UserDashboard'
import ProductDetail from './ProductDetail'

function UserRoutes() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/signup' element={<UserSignUp />} />
        <Route path='/products' element={<ProductList />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/wishlist' element={<WishList />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/dashboard' element={<UserDashboard />} />
        <Route path='/products/:id' element={<ProductDetail />} />
        <Route path='/*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default UserRoutes