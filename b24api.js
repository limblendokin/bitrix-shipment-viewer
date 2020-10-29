const axios = require('axios');
require('dotenv').config();
const baseUrl = process.env.BITRIX_URL; 

const getShipmentList = () => {
  axios.get(`${baseUrl}sale.shipment.list`, {
    params:{
      "filter[allowDelivery]":"Y",
      "select[]":["id", "deducted", "deliveryName", "statusId", "orderId", "trackingNumber"]
    }
  }).then(res => {
    var shipments = res.data.result;
    var orderIds =[];
    for(let i=0; shipments.length; i++){
      orderIds.push(shipments[i]['orderId']);
    }
    axios.get(`${baseUrl}sale.basketItem.list`,{
      params:{
        'filter[orderId][]': orderIds,
        'select[]':["detailPageUrl", "measureName", "name", "quantity"]
      }
    }).then(res=>console.log(res.data))
  });
}

module.exports = {getShipmentList:getShipmentList};