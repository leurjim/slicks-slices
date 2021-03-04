import React, { useState } from 'react';

// Crear una orden context
const OrderContext = React.createContext();

export function OrderProvider({ children }) {
  // necesitamos para stick state aquí
  const [order, setOrder] = useState([]);
  return (
    <OrderContext.Provider value={[order, setOrder]}>
      {children}
    </OrderContext.Provider>
  );
}

export default OrderContext;
