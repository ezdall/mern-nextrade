import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';

import auth from './auth-helper';
import { login } from './api-auth';
import { handleAxiosError } from '../axios'

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
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // console.log({location})

  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    redirectToReferrer: false
  });

  // console.log({location})

  const clickSubmit = () => {
    const { email, password } = values;

    if (!email || !password) {
      return setValues({ ...values, error: 'all fields are required' });
    }

    return login({ email, password })
      .then(data => {
        // console.log({data})
        if (data.isAxiosError) {
          console.log({error: data.message})
          return handleAxiosError(data, ()=> {
           return setValues({
              ...values,
              email: '',
              password: '',
              error: data.message
            });
          })
        }

        return auth.authenticate(data, () => {
          setValues({ ...values, error: '', redirectToReferrer: true });
          return navigate(from, { replace: true });
        });
      })
      .catch(err => {
        console.log({ err });

        if (!err.response) {
          return setValues({
            ...values,
            email: '',
            password: '',
            error: 'No Server Response'
          });
        }

        return setValues({
          ...values,
          email: '',
          password: '',
          error: err.message
        });
      });
  };

  const handleChange = event => {
    const {name, value} = event.target
    setValues({ ...values, error: '' });

    setValues({ ...values, [name]: value });
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" className={classes.title}>
          Log In
        </Typography>
        <TextField
          id="email"
          type="email"
          name="email"
          label="Email"
          className={classes.textField}
          value={values.email}
          onChange={handleChange}
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
          margin="normal"
        />
        <br />
        {values.error && (
          <Typography component="p" color="error">
            <Icon color="error" className={classes.error}>
              error
            </Icon>
            {values.error}
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
          Submit
        </Button>
      </CardActions>
    </Card>
  );
}
