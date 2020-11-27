import React, {useState, useEffect} from 'react';
//import axios from 'axios';
import './App.css';
import {Button, Form, FormGroup, Input, Label, Table, TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import classnames from 'classnames';

function App() {
  const [username, setUsername] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");
  const [shipments, setShipments] = React.useState([]);
  const [orders, setOrders] = React.useState([]);
  const smola20url = 'https://smola20.ru';
  const [activeTab, setActiveTab] = useState('1');
  const [items, setItems] = React.useState([]);
  const toggle = tab => {
    if(activeTab !== tab) setActiveTab(tab);
  }

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
        setShipments(data);
        var itemsArr=[];
        for(let i = 0; i<data.length;i++){
          var order = data[i];
          for(let j = 0; j<order.items.length; j++){
            let item = order.items[j]; 
            let found = itemsArr.find(x => x.name===item.name);
            if(found){
              found.quantity+=Number.parseInt(item.quantity);
            }
            else{
              var newItem = JSON.parse(JSON.stringify(item));
              newItem.quantity = Number.parseInt(newItem.quantity);
              itemsArr.push(newItem);

            }
          }
        }
        setItems(itemsArr);
      });
    };
    const fetchOrders = async () => {
      fetch(
        `/api/orders`,
        {
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json',}
        }
      ).then(res => res.json()).then(data => {
        setOrders(data?data:[]);
      })
    }
    fetchData();
    fetchOrders();
  }, []);
  return (
    <div>
      <Form inline className="m-3" onSubmit={async e=>{
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
        <FormGroup inline className="mb-2 mr-sm-2 mb-sm-0">
          <Label for="exampleEmail" className="mr-sm-2">Email</Label>
          <Input type="username" name="username" id="username" placeholder="something" value={username} onChange={e=>setUsername(e.target.value)}/>
        </FormGroup>
        <FormGroup inline className="mb-2 mr-sm-2 mb-sm-0">
          <Label for="examplePassword" className="mr-sm-2">Password</Label>
          <Input type="password" name="userPassword" id="userPassword" placeholder="don't tell!" value={userPassword} onChange={e=>setUserPassword(e.target.value)}/>
        </FormGroup>
        <Button type="submit">Submit</Button>
      </Form>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '1' })}
            onClick={() => { toggle('1'); }}
          >
            Отгрузки
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => { toggle('2'); }}
          >
            Товары в отгрузках
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '3' })}
            onClick={() => { toggle('3'); }}
          >
            Оплаченные заказы
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Table hover>
            <thead>
              <tr>
                <th>Номер заказа</th>
                <th>Статус</th>
                <th>Способ доставки</th>
                <th>Номер накладной</th>
                <th>Товары</th>

              </tr>
            </thead>
            <tbody>
              {shipments.map(shipment => (

                <tr key={shipment.id}>
                  <td>812{shipment.orderId}</td>
                  <td>{shipment.statusId}</td>
                  <td>{shipment.deliveryName}</td>
                  <td>{shipment.trackingNumber}</td>
                  <Table>
                    {shipment.items.map(item => (
                      <tr>
                        <td>
                          <a href={smola20url+item.detailPageUrl}>{item.name}</a>
                          </td>
                        <td>{item.quantity}</td>
                        <td>{item.measureName}</td>
                      </tr>
                    ))}
                  </Table>
                </tr>
                    ))}
            </tbody>
          </Table>
        </TabPane>
        <TabPane tabId="2">
          <Table hover>
            <thead>
              <tr>
                <th>Наименование</th>
                <th>Количество</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr>
                  <td>
                    <a href={smola20url+item.detailPageUrl}>{item.name}</a>
                  </td>
                  <td>{item.quantity}</td>
                  <td>{item.measureName}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TabPane>
        <TabPane tabId="3">
          {/* <Table hover>
            <thead>
              <tr>
                <th>Номер заказа</th>
                <th>Дата</th>
                <th>Сумма</th>

              </tr>
            </thead>
            <tbody>
              {orders.map(order => (

                <tr key={order.id}>
                  <td>812{order.id}</td>
                  <td>{order.dateInsert}</td>
                  <td>{order.price}</td>
                </tr>
                    ))}
            </tbody>
          </Table> */}
        </TabPane>
      </TabContent>
    </div>
  );
}

export default App;
