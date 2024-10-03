import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// context for cart + localStorage
// and to use useEffect, useState
const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [cart, setCart] = useState(
    // parse object or array
    JSON.parse(window?.localStorage.getItem('cart')) || []
  );

  // TODO
  // const [darkMode, setDarkMode] = useState(
  //   localStorage.getItem('lightTheme') !== 'true'
  // );

  // useeffect to save the cart state to local storage
  useEffect(() => {
    // stringify object(array)
    window?.localStorage.setItem('cart', JSON.stringify(cart));
    // no clean-up since no resourse to clean up
  }, [cart]);

  // TODO
  // useEffect(() => {
  //   localStorage.setItem('lightTheme', !darkMode);
  // }, [darkMode]);

  // Function to toggle between light and dark themes
  // const toggleTheme = () => {
  //   setDarkMode(!darkMode);
  // };

  // ?
  const itemTotal = () => cart.length;

  const totalCost = () =>
    cart.reduce((total, item) => total + item.quantity * item.product.price, 0);

  // TODO: fix mutation?
  const addProduct = (product, callback) => {
    const updatedCart = [...cart];
    const productIndex = updatedCart.findIndex(
      item => item.product._id === product._id
    );

    if (productIndex !== -1) {
      // if the product is already in cart, update its quantity
      updatedCart[productIndex].quantity += 1; // mutation
    } else {
      // if product is not yet in cart, add it w/ quantity 1
      updatedCart.push({
        // mutation
        product,
        quantity: 1,
        shop: product.shop._id
      });
    }

    setCart(updatedCart);
    if (callback) callback();
  };

  // update quantity
  const updateCart = (productId, quantity) => {
    setCart(
      cart.map(item => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeProduct = productId => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  return (
    <DataContext.Provider
      value={{
        auth,
        setAuth,
        cart,
        itemTotal,
        totalCost,
        addProduct,
        updateCart,
        removeProduct,
        clearCart
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default DataContext;
