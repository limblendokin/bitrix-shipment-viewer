import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText,
} from 'reactstrap';

function NavBarComponent(props) {
  const user = props.user;
  const onChangeView = props.onChangeView;
  const onLogout = props.onLogout;
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/">Zavod 2.0</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="#" onClick={() => onChangeView('shipments')}>
                Отгрузки
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" onClick={() => onChangeView('items')}>
                Товары
              </NavLink>
            </NavItem>
          </Nav>
          <NavbarText>{user}</NavbarText>
          <NavbarText>
            <NavLink href="#" onClick={onLogout}>
              Выйти
            </NavLink>
          </NavbarText>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default NavBarComponent;
