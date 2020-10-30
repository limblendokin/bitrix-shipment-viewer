import React, {useState, useEffect} from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

function App() {
  const [username, setUsername] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");
  const [data, setData] = useState({ shipments: [] });
  const smola20url = 'https://smola20.ru';
  const localUrl = 'http://localhost:4000/';
 
  useEffect(() => {
  const fetchData = async () => {
    const result = await axios(
      `${localUrl}api/shipments`,
    ).catch(err=>setData([]));

    setData(result.data);
  };

  fetchData();
}, []);
  return (
    <div>
      <h1>Register Page</h1>
      <form onSubmit={e=>{
          e.preventDefault();
          axios.post(`${localUrl}login`, {
            username: username,
            password: userPassword
          })
        }}>
        Enter Username:<input type="text" name="username" value={username} onChange={e=>setUsername(e.target.value)}></input>
        Enter Password:<input type="password" name="password" value={userPassword} onChange={e=>setUserPassword(e.target.value)}></input>
        <input type="submit" value="Submit"></input>
      </form>
      <table>
        {data.shipments.map(shipment => (
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
