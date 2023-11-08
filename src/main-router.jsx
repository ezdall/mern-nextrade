import { Route, Routes } from 'react-router-dom';

import Home from './components/home.comp';
import Menu from './components/menu.comp';

import NewShop from './shop/new-shop.comp';
import MyShops from './shop/my-shops.comp';
import Login from './auth/login.comp';
import Profile from './user/profile.comp';

export default function MainRouter() {
  return (
    <div>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/seller/shop/new" element={<NewShop />} />
        <Route path="/seller/shops" element={<MyShops />} />
        <Route path="/user/:userId" element={<Profile />} />
      </Routes>
    </div>
  );
}
