import { Route, Routes } from 'react-router-dom';

import Home from './components/home.comp';
import Menu from './components/menu.comp';

import Users from './user/users.comp'
import EditProfile from './user/edit-profile.comp'

import NewShop from './shop/new-shop.comp';
import EditShop from './shop/edit-shop.comp';
import MyShops from './shop/my-shops.comp';
import Shops from './shop/shops.comp';
import Shop from './shop/shop.comp';

import SignUp from './user/sign-up.comp'
import Login from './auth/login.comp';
import RequireAuth from './auth/require-auth.comp';
import Profile from './user/profile.comp';

import Product from './product/product.comp';
import NewProduct from './product/new-product.comp';
import EditProduct from './product/edit-product.comp';

import ShopOrders from './order/shop-order.comp'
import Order from './order/order.comp'
import Cart from './cart/cart.comp'

export default function MainRouter() {
  return (
    <div>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/users" element={<Users />} />
        
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/shops/all" element={<Shops />} />
        <Route path="/shops/:shopId" element={<Shop />} />

        <Route path="/order/:orderId" element={<Order />} />
        {/* this route must be Private */}
        <Route element={<RequireAuth />}>
          <Route path="/user/:userId" element={<Profile />} />
          <Route path="/user/edit/:userId" element={<EditProfile />} />

          <Route path="/seller/orders/:shop/:shopId" element={<ShopOrders />} />

          <Route path="/seller/shop/edit/:shopId" element={<EditShop />} />
          <Route path="/seller/shop/new" element={<NewShop />} />
          <Route path="/seller/shops" element={<MyShops />} />

          <Route path="/seller/:shopId/:productId/edit" element={<EditProduct />}/>
          <Route path="/seller/:shopId/products/new" element={<NewProduct />} />
        </Route>
        <Route path="*" element={<>Error Page</>} />
      </Routes>      
    </div>
  );
}
