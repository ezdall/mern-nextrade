import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';

import useDataContext from './useDataContext';
import auth from './auth-helper';
import { login } from './api-auth';
import { handleAxiosError } from '../axios';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  }
}));

export default function Login() {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuth } = useDataContext();
  const from = location.state?.from?.pathname || '/';

  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState(false);

  // console.log({location})

  const clickSubmit = () => {
    const { email, password } = values;

    if (!email || !password) {
      return setError('all fields are required');
    }

    return login({ email, password })
      .then(data => {
        // console.log({data})
        if (data.isAxiosError) {
          // console.log({ error: data.message });
          handleAxiosError(data);
          // console.log({err:data})
          setError(data.response.data.error);
        } else {
          setAuth(data);
          setError('');
          setValues({ email: '', password: '' });
          setRedirect(true);
          navigate(from, { replace: true });
        }
      })
      .catch(err => {
        console.log({ err });

        if (!err.response) {
          return setError('No Server Response');
        }
        return setError(err.message);
      });
  };

  const handleChange = event => {
    const { name, value } = event.target;

    setError('');

    setValues({ ...values, [name]: value });
  };

  // if(redirect) {
  //   return <Navigate to={from} replace />
  // }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" className={classes.title}>
          Log In
        </Typography>
        <TextField
          autoFocus
          id="email"
          type="email"
          name="email"
          label="Email"
          className={classes.textField}
          value={values.email}
          onChange={handleChange}
          error={!!error}
          required
          margin="normal"
        />
        <br />
        <TextField
          id="password"
          type="password"
          name="password"
          label="Password"
          className={classes.textField}
          value={values.password}
          onChange={handleChange}
          required
          error={!!error}
          margin="normal"
        />
        <br />
        {error && (
          <Typography component="p" color="error">
            <Icon color="error" className={classes.error}>
              error
            </Icon>
            {error}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          variant="contained"
          onClick={clickSubmit}
          className={classes.submit}
        >
          Login
        </Button>
      </CardActions>
    </Card>
  );
}
