import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [cart, setCart] = useState(
    JSON.parse(window?.localStorage.getItem('cart')) || []
  );

  // useeffect to save the cart state to local storage
  useEffect(() => {
    window?.localStorage.setItem('cart', JSON.stringify(cart));
    // no clean-up since no resourse to clean up
  }, [cart]);

  // total number of item
  const itemTotal = () => cart.length;

  const getCart = () => cart;

  const addProduct = (product, callback) => {
    const updatedCart = [...cart];
    const productIndex = updatedCart.findIndex(
      item => item._id === product._id
    );

    if (productIndex !== -1) {
      // if the product is already in cart, update its quantity
      updatedCart[productIndex].quantity += 1;
    } else {
      // if product is not yet in cart, add it w/ quantity 1
      updatedCart.push({
        product,
        quantity: 1,
        shop: product.shop._id
      });
    }

    setCart(updatedCart);
    if (callback) callback();
  };

  const updateCart = (productId, quantity) => {
    const updatedCart = cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );

    setCart(updatedCart);
  };

  const removeProduct = productId => {
    const updatedCart = cart.filter(item => item.id !== productId);

    setCart(updatedCart);
  };

  const emptyCart = () => setCart([]);

  return (
    <DataContext.Provider
      value={{
        auth,
        setAuth,
        cart,
        itemTotal,
        getCart,
        addProduct,
        updateCart,
        removeProduct,
        emptyCart
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;

DataProvider.propTypes = {
  children: PropTypes.node.isRequired
};
