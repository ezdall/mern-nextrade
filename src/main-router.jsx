import React from 'react';
import { Route, Routes, Switch } from 'react-router-dom'

import { Home } from './components/home.comp'
import NewShop from './shop/new-shop.comp'
import MyShop  from './shop/my-shop.comp'

export const MainRouter = () => {
    return ( <div>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/seller/shop/new" element={<NewShop />} />
        <Route path="/seller/shops" element={<MyShop />} />
      </Routes>
    </div>
   )
}