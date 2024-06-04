import React, {useEffect, useState} from 'react';
import {Button, Checkbox, FormControlLabel, TextField} from '@mui/material';
import {Email, Lock, Visibility, VisibilityOff} from '@mui/icons-material';
import Link from 'next/link';
import {useSnackbar} from 'notistack';
import {useRouter} from 'next/router';
import hospitalLoginImage from '../assets/hospital_login.jpg';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email === 'admin@rajalakshmi.edu.in' && password === 'admin') {
      enqueueSnackbar('Login successful', { variant: 'success', autoHideDuration: 5000 });

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      setTimeout(() => {
        router.push('/Dashboard');
      }, 1000);
    } else {
      enqueueSnackbar('Invalid email or password', { variant: 'error', autoHideDuration: 5000 });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundImage: `url(${hospitalLoginImage.src})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="w-full max-w-md p-8 bg-white bg-opacity-60 rounded-lg shadow-md font-inter">
        <h1 className="text-2xl font-bold text-center mb-8">Log In</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
              required
              type="email"
              InputProps={{
                startAdornment: (
                  <div className="pr-2">
                    <Email className="text-gray-500" />
                  </div>
                )
              }}
            />
          </div>

          <div className="mb-6 relative">
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              value={password}
              onChange={handlePasswordChange}
              required
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                startAdornment: (
                  <div className="pr-2">
                    <Lock className="text-gray-500" />
                  </div>
                ),
                endAdornment: (
                  <Button onClick={handleShowPassword} className="focus:outline-none">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                ),
              }}
            />
          </div>

          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
            }
            label="Remember me"
            className="mb-6"
          />

          <Button variant="contained" type="submit" color="primary" fullWidth>
            Log In
          </Button>
        </form>

        <Link href="/ForgotPasswordPage">
          <span className="text-blue-500 block mt-4 text-center hover:underline">
            Forgot password?
          </span>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
