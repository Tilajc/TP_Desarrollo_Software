import { useState } from 'react';
import { MyContext } from './MyContext';

export const MyProvider = ({ children }) => {
  // esto es un useState normal
  const [data, setData] = useState('Valor inicial Global');

  return (
    <MyContext.Provider value={{ data, setData }}>
      {children}
    </MyContext.Provider>
  );
};
