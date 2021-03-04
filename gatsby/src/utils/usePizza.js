import { useContext, useState } from 'react';
import OrderContext from '../components/OrderContext';
import attachNamesAndPrices from './attachNamesAndPrices';
import calculateOrderTotal from './calculateOrderTotal';
import formatMoney from './formatMoney';

export default function usePizza({ pizzas, values }) {
  // 1. Crea algun estado para mantener nuestra orden
  // Vamos rid de esta linea por que moveremos useState up a el provider
  // const [order, setOrder] = useState([]);
  // Ahora accedemos ambos state y nuestra updater función (setOrder) via context
  const [order, setOrder] = useContext(OrderContext);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  // 2. Hacer una función que agrege cosas a la orden
  function addToOrder(orderedPizza) {
    setOrder([...order, orderedPizza]);
  }
  // 3. Hacer una función que remueva cosas desde orden
  function removeFromOrder(index) {
    setOrder([
      // todo antes del item queremos remover
      ...order.slice(0, index),
      // todo despues del item queremos remover
      ...order.slice(index + 1),
    ]);
  }

  // esta es la función que corre cuando alguien submits el formulario
  async function submitOrder(e) {
    e.preventDefault();
    console.log(e);
    setLoading(true);
    setError(null);
    // setMessage('Go eat!');

    // recolectar toda la data
    const body = {
      order: attachNamesAndPrices(order, pizzas),
      total: formatMoney(calculateOrderTotal(order, pizzas)),
      name: values,
      email: values.email,
      mapleSyrup: values.mapleSyrup,
    };
    // 4. Enviar esta data al servidor función cuando ellos salgan
    const res = await fetch(
      `${process.env.GATSBY_SERVERLESS_BASE}/placeOrder`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    const text = JSON.parse(await res.text());

    // revisa si todo trabaja
    if (res.status >= 400 && res.status < 600) {
      setLoading(false); // apaga la carga
      setError(text.message);
    } else {
      // esto trabaja!
      setLoading(false);
      setMessage('Éxito! Ven por tu pizza');
    }
  }

  return {
    order,
    addToOrder,
    removeFromOrder,
    error,
    loading,
    message,
    submitOrder,
  };
}
