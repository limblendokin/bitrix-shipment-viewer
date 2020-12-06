const axios = require('axios');
const e = require('express');
require('dotenv').config();
const baseUrl = process.env.BITRIX_URL;

const getShipmentList = async (stages) => {
  var shipments = [];
  try {
    var next = 0;
    do {
      var res = await axios.get(`${baseUrl}sale.shipment.list`, {
        params: {
          'filter[allowDelivery]': 'Y',
          'filter[deducted]': 'N',
          'filter[canceled]': 'N',
          'filter[statusId]': stages,
          select: [
            'id',
            'deducted',
            'deliveryName',
            'statusId',
            'orderId',
            'trackingNumber',
            'deliveryId',
            'allowDelivery',
            'dateAllowDelivery',
          ],
          start: next,
        },
      });
      next = res.data.next;
      shipments = shipments.concat(res.data.result.shipments);
    } while (next);
  } catch (err) {
    console.log(err);
  }
  console.log(`fetched ${shipments.length} shipments`);
  return shipments;
};

const getShipmentListWithBaskets = async (stages) => {
  var shipments = await getShipmentList(stages);
  var orderIds = getOrderIdsArray(shipments);
  var items = await getItems({ orderIds });
  for (let i = 0; i < shipments.length; i++) {
    var orderId = shipments[i].orderId;
    var basket = items.filter((item) => item.orderId == orderId);
    shipments[i].items = basket;
  }
  console.log(`fetched ${shipments.length} shipments with baskets`);
  return shipments;
};

const getOrderIdsArray = (shipments) => {
  var orderIds = [];
  for (let i = 0; i < shipments.length; i++) {
    var orderId = shipments[i].orderId;
    orderIds.push(orderId);
  }
  return orderIds;
};

const getItems = async (filter) => {
  var orderIds = filter.orderIds;
  if (!orderIds) {
    if (!filter.stages) {
      throw new Error('specify stages or orderIds');
    }
    var shipments = await getShipmentList(filter.stages);
    orderIds = getOrderIdsArray(shipments);
  }
  var next = 0;
  var items = [];
  do {
    var res = await axios.get(`${baseUrl}sale.basketItem.list`, {
      params: {
        'filter[orderId]': orderIds,
        select: [
          'id',
          'detailPageUrl',
          'measureName',
          'name',
          'quantity',
          'orderId',
        ],
        start: next,
      },
    });
    next = res.data.next;
    items = items.concat(res.data.result.basketItems);
  } while (next);
  console.log(`fetched ${items.length} items`);
  return items;
};

const setDeducted = async (id, deducted, allowDelivery, deliveryId) => {
  axios
    .get(`${baseUrl}sale.shipment.update`, {
      params: {
        id: id,
        'fields[deducted]': deducted,
        'fields[allowDelivery]': allowDelivery,
        'fields[deliveryId]': deliveryId,
      },
    })
    .then((res) => {
      return res.data;
    });
};
/**
 *
 * @param {Object} fields
 * @param {Number} fields.id
 * @param {String} fields.statudId
 * @param {String} fields.allowDelivery
 * @param {String} fields.deducted
 * @param {Number} fields.deliveryId
 */
const setStage = async (fields) => {
  const { id, statusId, allowDelivery, deducted, deliveryId } = fields;
  if (!(id && statusId && allowDelivery && deducted && deliveryId)) {
    throw new Error('not enough args');
  }
  axios
    .get(`${baseUrl}sale.shipment.update`, {
      params: {
        id: id,
        'fields[deducted]': deducted,
        'fields[allowDelivery]': allowDelivery,
        'fields[deliveryId]': deliveryId,
        'fields[statusId]': statusId,
      },
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => console.log(err));
};
module.exports = {
  getShipmentList,
  getItems,
  getShipmentListWithBaskets,
  setStage,
};
