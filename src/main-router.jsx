// import React from 'react';
import { Route, Routes, Switch } from 'react-router-dom'

import { Home } from './components/home.comp'
import Menu from './components/menu.comp'

import NewShop from './shop/new-shop.comp'
import MyShops  from './shop/my-shops.comp'
import Login from './auth/login.comp'

export const MainRouter = () => {
    return ( <div>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/seller/shop/new" element={<NewShop />} />
        <Route path="/seller/shops" element={<MyShops />} />
      </Routes>
    </div>
   )
}