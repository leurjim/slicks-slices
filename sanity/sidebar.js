import React from 'react';
import S from '@sanity/desk-tool/structure-builder';

// construir un sidebar personalizado
export default function Sidebar() {
  return S.list()
    .title(`Slick's Slices`)
    .items([
      // crear un nuevo sub item
      S.listItem()
        .title('Home Page')
        .icon(() => <strong>🔥</strong>)
        .child(
          S.editor()
            .schemaType('storeSettings')
            // hacer un nuevo documento ID, así no tenemos un random string of numbers
            .documentId('downtown')
        ),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== 'storeSettings'
      ),
    ]);
}
