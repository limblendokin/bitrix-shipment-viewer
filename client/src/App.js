import React, {useState, useEffect} from 'react';
//import axios from 'axios';
import './App.css';

function App() {
  const [username, setUsername] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");
  const [shipments, setShipments] = React.useState([]);
  //const data = {shipments:[{id:'', deducted:'', deliveryName:'', statusId:'', orderId:'', trackingNumber:'', deliveryId:'', allowDelivery:'', items:[]}]};
  const smola20url = 'https://smola20.ru';
 
  useEffect(() => {
  const fetchData = async () => {
    fetch(
      `/api/shipment`,
      {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json',}
      }
    ).then(res => res.json()).then(data => {
      if(data.err) data = [];
      setShipments(data)
    });
  };
  fetchData();
}, []);
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={async e=>{
          e.preventDefault();
          fetch(`/api/login`, 
          {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
              username: username,
              password: userPassword
            })
          });
        }}>
        Enter Username:<input type="text" name="username" value={username} onChange={e=>setUsername(e.target.value)}></input>
        Enter Password:<input type="password" name="password" value={userPassword} onChange={e=>setUserPassword(e.target.value)}></input>
        <input type="submit" value="Submit"></input>
      </form>
      <table>
        {shipments.map(shipment => (
          <tr key={shipment.id}>
            <td>812{shipment.orderId}</td>
            <td>{shipment.statusId}</td>
            <td>{shipment.deliveryName}</td>
            <td>{shipment.trackingNumber}</td>
            <table>
              {shipment.items.map(item => (
                <tr>
                  <td>
                    <a href={smola20url+item.detailPageUrl}>{item.name}</a>
                    </td>
                  <td>{item.quantity}</td>
                  <td>{item.measureName}</td>
                </tr>
              ))}
            </table>
          </tr>
              ))}
      </table>
    </div>
  );
}

export default App;
