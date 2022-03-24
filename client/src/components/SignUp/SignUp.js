import React, { useState } from 'react';
import Drawer from '../Drawer/Drawer';
import { Typography, Grid, Button, TextField } from '@material-ui/core';
import axios from 'axios';
import { useHistory } from 'react-router';
import Logo from '../Logo/Logo';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const history = useHistory();

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const signUp = (e) => {
    e.preventDefault();
    const user = {
      name: username,
      email: email,
      password: password,
      passwordConfirm: confirmPassword,
    };

    axios
      .post('users/signup', user)
      .then(function (response) {
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        alert('Udało ci się zarejestrować, zaloguj się');
        history.push('/LogIn');
      })
      .catch(function (error) {
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        alert('Wprowadzone dane są nieprawidłowe, spróbuj jeszcze raz');
        console.error(error);
      });
  };

  return (
    <>
      <Drawer />
      <Grid
        container
        direction="column"
        justifyContent="space-around"
        alignItems="center"
        style={{ height: '80vh', margin: 'auto', marginTop: '10vh' }}
      >
        <Logo />
        <Typography variant="h4" component="h1">
          Zarejestruj się
        </Typography>
        <form
          onSubmit={signUp}
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          <TextField
            label="E-mail"
            variant="filled"
            required
            onChange={handleEmail}
            type="email"
            value={email}
          />
          <TextField
            label="Nazwa Użytkownika"
            variant="filled"
            required
            onChange={handleUsername}
            type="text"
            value={username}
          />
          <TextField
            label="Hasło"
            variant="filled"
            required
            onChange={handlePassword}
            type="password"
            value={password}
          />
          <TextField
            label="Powtórz Hasło"
            variant="filled"
            required
            onChange={handleConfirmPassword}
            type="password"
            value={confirmPassword}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            primary={true}
          >
            Zarejestruj się
          </Button>
        </form>

        <Button variant="contained" color="secondary">
          Kontynuuj jako gość
        </Button>
      </Grid>
    </>
  );
};

export default SignUp;
