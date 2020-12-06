import React, { useEffect } from 'react';
import './App.css';
import ShipmentsComponent from './components/ShipmentsComponent';
import { Spinner, Container, Row } from 'reactstrap';
import LoginComponent from './components/LoginComponent';
import axios from 'axios';
import NavBarComponent from './components/NavBarComponent';
import PivotItemsComponent from './components/PivotItemsComponent';
import FooterComponent from './components/FooterComponent';

function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState('');
  const [currentView, setCurrentView] = React.useState('shipments');
  const onChangeView = (viewName) => {
    setCurrentView(viewName);
  };
  const onLogin = (user) => {
    setUser(user);
  };
  const onLogout = () => {
    axios
      .get('/api/logout')
      .then((res) => {
        setUser('');
      })
      .catch((err) => console.log(err));
  };
  const getLoginState = async () => {
    axios
      .get('/api/me')
      .then((res) => {
        if (!res.data.err) {
          setUser(res.data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    getLoginState();
  }, []);
  if (isLoading) {
    return (
      <Container className="h-100">
        <Row className="h-100 align-items-center justify-content-center">
          <Spinner color="dark"></Spinner>
        </Row>
      </Container>
    );
  }
  if (!user) {
    return (
      <Container className="h-100">
        <Row className="h-100 align-items-center justify-content-center">
          <LoginComponent onLogin={onLogin} />
        </Row>
      </Container>
    );
  }
  return (
    <div className=" h-100">
      <NavBarComponent
        user={user}
        onChangeView={onChangeView}
        onLogout={onLogout}
      />
      <div className="m-auto w-75 min-vh-100">
        {currentView === 'shipments' && <ShipmentsComponent />}
        {currentView === 'items' && <PivotItemsComponent />}
      </div>
      <FooterComponent />
    </div>
  );
}

export default App;
