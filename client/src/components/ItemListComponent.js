import React from 'react';
import { Table } from 'reactstrap';
import { smola20url } from '../config';

function ItemListComponent(props) {
  const items = props.items || [];
  const getItemLink = (detailPageUrl) => {
    return smola20url + detailPageUrl;
  };
  return (
    <Table hover>
      <thead>
        <tr>
          <th>Наименование</th>
          <th>Количество</th>
          <th>Ед.изм.</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          const { id, detailPageUrl, name, quantity, measureName } = item;
          return (
            <tr key={id}>
              <td>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={getItemLink(detailPageUrl)}
                >
                  {name}
                </a>
              </td>
              <td>{Number.parseInt(quantity)}</td>
              <td>{measureName}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default ItemListComponent;
