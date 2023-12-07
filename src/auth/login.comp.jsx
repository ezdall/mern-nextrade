import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';

import { addAuth } from '../redux/auth.slice';
import useDataContext from './useDataContext';
import { login } from './api-auth';
// import { handleAxiosError } from '../axios';

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

  const dispatch = useDispatch();
  const location = useLocation();
  // const navigate = useNavigate();
  const auth = useSelector(state => state.auth);

  // const { setAuth } = useDataContext();
  const from = location.state?.from?.pathname || '/';

  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState(false);

  const clickSubmit = () => {
    const { email, password } = values;

    if (!email || !password) {
      return setError('all fields are required');
    }

    return login({
      user: { email, password }
    })
      .then(data => {
        if (data?.response) {
          // handleAxiosError(data);
          console.log({ errLogin: data?.response?.data });
          return setError(data.response?.data?.error);
        }
        dispatch(addAuth(data));
        // setAuth(data);
        setError('');
        setValues({ email: '', password: '' });
        return setRedirect(true);
        // return navigate(from, { replace: true });
      })
      .catch(err => {
        console.log({ err });

        if (err.request) {
          return setError(err.message);
        }
        return setError(err.message);
      });
  };

  const handleChange = event => {
    const { name, value } = event.target;

    setError('');
    setValues({ ...values, [name]: value });
  };

  if (auth?.user) return <Navigate to="/" />;

  if (redirect) return <Navigate to={from} replace />;

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
