import { useState, useEffect } from 'react';

export default function useLatestData() {
  // hot slices
  const [hotSlices, setHotSlices] = useState();
  // slicemasters
  const [slicemasters, setSlicemasters] = useState();
  // Usar un efecto para fetch la data de el graphql endpoint
  useEffect(function () {
    // Cuando el componente cargue, fetch la data
    fetch(process.env.GATSBY_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
            query {
                StoreSettings(id: "downtown") {
                  name
                  slicemaster {
                    name
                  }
                  hotSlices {
                    name
                  }
                }
              }
            `,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        // TODO: revisa para errores
        // configura la data para el state
        setHotSlices(res.data.StoreSettings.hotSlices);
        setSlicemasters(res.data.StoreSettings.slicemaster);
      });
  }, []);
  return {
    hotSlices,
    slicemasters,
  };
}
