import axios from 'axios';
import React from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
function LoginComponent(props) {
  const [username, setUsername] = React.useState('');
  const [password, setUserPassword] = React.useState('');
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [error, setError] = React.useState({});
  const onLogin = props.onLogin;
  const login = async () => {
    setIsDisabled(true);
    axios
      .post(
        '/api/login',
        { username, password },
        { withCredentials: 'same-origin' }
      )
      .then((res) => {
        onLogin(res.data);
        setIsDisabled(false);
        setError({});
      })
      .catch((err) => {
        setError(err.response);
        setIsDisabled(false);
      });
  };
  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        window.history.pushState('', '');
        login();
      }}
    >
      <FormGroup>
        <Label for="username">Логин</Label>
        <Input
          autoFocus
          type="username"
          name="username"
          id="username"
          placeholder="РаботникМесяца"
          autoComplete="username"
          value={username}
          disabled={isDisabled}
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label for="current-password">Пароль</Label>
        <Input
          type="password"
          name="current-password"
          id="current-password"
          placeholder="ТвойСекрет"
          autoComplete="current-password"
          value={password}
          disabled={isDisabled}
          onChange={(e) => setUserPassword(e.target.value)}
        />
      </FormGroup>
      {error.data && <div className="alert alert-danger">{error.data}</div>}
      <Button type="submit" className={isDisabled && 'disabled'}>
        Войти
      </Button>
    </Form>
  );
}
export default LoginComponent;
