import axios from 'axios';
import React from 'react';
import { Button, Table } from 'reactstrap';
import { smola20url } from '../config';
import ItemListComponent from './ItemListComponent';
function ShipmentListComponent(props) {
  const shipments = props.shipments;
  const setShipments = props.setShipments;
  const getLocaleDate = (isoString) => {
    let date = new Date(isoString);
    let now = new Date();
    if (now.toLocaleDateString() === date.toLocaleDateString()) {
      return date.toLocaleTimeString('ru');
    } else {
      return (
        date.toLocaleDateString('ru') + ' ' + date.toLocaleTimeString('ru')
      );
    }
  };
  const getShipmentURL = (deliveryId, orderId) => {
    return `${smola20url}bitrix/admin/sale_order_shipment_edit.php?order_id=${orderId}&shipment_id=${deliveryId}`;
  };
  const getDispatchBlankLink = (trackingString) => {
    if (!trackingString) {
      return '#';
    }
    var [dispatchCompany, dispatchId] = trackingString.split(' ');
    if (dispatchCompany === 'CDEK') {
      return `https://lk.cdek.ru/print/print-order?numberOrd=${dispatchId}`;
    }
    return '#';
  };
  const setStage = (shipment, e) => {
    e.target.disabled = true;
    let updatedShipment = { ...shipment, statusId: 'DA' };
    axios.post('/api/shipment/stage', updatedShipment).then((res) => {
      e.target.disabled = false;
      let newShipment = res.data;
      console.log(newShipment);
      setShipments(
        shipments.map((item) => {
          if (item.id !== newShipment.id) {
            return item;
          }
          return {
            ...item,
            statusId: newShipment.statusId,
          };
        })
      );
    });
  };
  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Действие</th>
          <th>Дата разрешения</th>
          <th>Номер заказа</th>
          <th>Статус</th>
          <th>Способ доставки</th>
          <th>Номер накладной</th>
          <th>Товары</th>
        </tr>
      </thead>

      <tbody>
        {shipments.map((shipment) => {
          const {
            id,
            dateAllowDelivery,
            orderId,
            statusId,
            deliveryName,
            trackingNumber,
          } = shipment;
          return (
            <tr key={id}>
              <td>
                <Button onClick={(e) => setStage(shipment, e)}>В сборку</Button>
              </td>
              <td>{getLocaleDate(dateAllowDelivery)}</td>
              <td>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={getShipmentURL(id, orderId)}
                >
                  812{orderId}
                </a>
              </td>
              <td>{statusId}</td>
              <td>{deliveryName}</td>
              <td>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={getDispatchBlankLink(trackingNumber)}
                >
                  {trackingNumber}
                </a>
              </td>
              <td>
                <ItemListComponent items={shipment.items} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
export default ShipmentListComponent;
