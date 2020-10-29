const axios = require('axios');
require('dotenv').config();
const baseUrl = process.env.BITRIX_URL; 

const getShipmentList = () => {
  axios.get(`${baseUrl}sale.shipment.list`, {
    params:{
      "filter[allowDelivery]":"Y",
      "select[]":["id", "deducted", "deliveryName", "statusId", "orderId", "trackingNumber"]
    }
  }).then(res => console.log(res.data));
}

module.exports = {getShipmentList:getShipmentList};