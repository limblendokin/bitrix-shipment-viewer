const axios = require('axios');
require('dotenv').config();
const baseUrl = process.env.BITRIX_URL; 

const getShipmentList = async () => {
  var shipments = await axios.get(`${baseUrl}sale.shipment.list`, {
    params:{
      "filter[allowDelivery]":"Y",
      "select":["id", "deducted", "deliveryName", "statusId", "orderId", "trackingNumber", "deliveryId", "allowDelivery"]
    }
  });
  shipments = shipments.data.result.shipments;
  var orderIds =[];
  for(let i=0; i<shipments.length; i++){
    var orderId = shipments[i].orderId
    orderIds.push(orderId);
  }
  console.log(orderIds);
  var items = await axios.get(`${baseUrl}sale.basketItem.list`,{
    params:{
      'filter[orderId]': orderIds,
      'select':["detailPageUrl", "measureName", "name", "quantity", "orderId"]
    }
  });
  // var trackingNumber = await axios.get(`${baseUrl}sale.order.list`,{
  //   params: {
  //     'filter[id]':orderIds,
  //     'select': []
  //   }
  // })
  
  items = items.data.result.basketItems;
  console.log(items);
  for(let i=0; i < shipments.length; i++){
    var orderId = shipments[i].orderId;
    var basket = items.filter(item => item.orderId == orderId);
    shipments[i].items = basket;
  }


  return shipments;
}


const setDeducted = async (id, deducted, allowDelivery, deliveryId) => {
  axios.get(`${baseUrl}sale.shipment.update`, {
    params: {
      'id': id,
      'fields[deducted]': deducted,
      'fields[allowDelivery]':allowDelivery,
      'fields[deliveryId]':deliveryId
    }
  }).then(res => {
    return res;
  });
}

const setStage = async (id, stageId, allowDelivery, deducted, deliveryId) =>{
  axios.get(`${baseUrl}sale.shipment.update`, {
    params:{
      'id': id,
      'fields[deducted]': deducted,
      'fields[allowDelivery]':allowDelivery,
      'fields[deliveryId]':deliveryId,
      'fields[stageId]': stageId
    }
  }).then(res => {
    return res;
  });
}

module.exports = {getShipmentList:getShipmentList};