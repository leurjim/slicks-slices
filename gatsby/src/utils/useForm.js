import { useState } from 'react';

export default function useForm(defaults) {
  const [values, setValues] = useState(defaults);

  function updateValue(e) {
    // revisa si este es un número y conviertelo
    let { value } = e.target;
    if (e.target.type === 'number') {
      value = parseInt(e.target.value);
    }
    setValues({
      // copia el existente value dentro de este
      ...values,
      // sube el nuevo value que cambia
      [e.target.name]: value,
    });
  }

  return { values, updateValue };
}
