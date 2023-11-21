import { createContext, useState } from 'react';

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [cart, setCart] = useState([]);

  return (
    <DataContext.Provider value={{ auth, setAuth, cart, setCart }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
