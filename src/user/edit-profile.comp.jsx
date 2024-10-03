import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useParams, useNavigate } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import useAxiosPrivate from '../auth/useAxiosPrivate';
import { read, updateUser } from './api-user';
import { handleAxiosError } from '../axios';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle
  },
  error: {
    verticalAlign: 'middle'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  },
  subheading: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle
  }
}));

const nameRegex = /^[a-zA-Z0-9-_]{1,23}$/;
const passRegex = /^[a-zA-Z0-9]{4,24}$/;
const emailRegex = /^[a-zA-Z0-9]*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/;

export default function EditProfile() {
  const { userId } = useParams();
  const classes = useStyles();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [validName, setValidName] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPass, setValidPass] = useState(false);

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    seller: false
  });

  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const result = nameRegex.test(values.name);
    setValidName(result);
  }, [values.name]);

  useEffect(() => {
    const result = emailRegex.test(values.email);
    setValidEmail({ result });
  }, [values.email]);

  useEffect(() => {
    const result = passRegex.test(values.password);
    setValidPass({ result });
  }, [values.password]);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    read({
      userId,
      signal,
      axiosPrivate2: axiosPrivate
    }).then(data => {
      if (!data?.isAxiosError) {
        setError('');
        return setValues(prev => ({ ...prev, ...data }));
      }
      setError(data.response?.data?.error);
      return (
        data.response?.status === 401 && navigate('/users', { replace: true })
      );
    });

    return () => {
      abortController.abort();
      console.log('abort read edit-prof');
    };
  }, [userId, axiosPrivate, navigate]);

  const handleChange = ev => {
    const { name, value } = ev.target;

    setValues({ ...values, [name]: value });
  };

  const handleCheck = (ev, checked) => {
    setValues({ ...values, seller: checked });
  };

  const clickSubmit = () => {
    let vPass = null;
    const vName = nameRegex.test(values.name);
    const vEmail = emailRegex.test(values.email);
    const vSeller = typeof values.seller === 'boolean';

    if (values.password) {
      vPass = passRegex.test(values.password);
    }

    if (!vName || !vEmail || !vSeller || (values.password && !vPass)) {
      return setError('valid fields are required');
    }

    // must be turn to "undefined" if empty-string ''
    // due to mongoose
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
      seller: values.seller
    };

    return updateUser({
      user, // body
      userId,
      axiosPrivate2: axiosPrivate
    }).then(data => {
      if (!data?.isAxiosError) {
        setValues({ ...values, userId: data._id });
        return setRedirect(true);
      }
      handleAxiosError(data);
      return setError(data.response?.data?.error);
    });
  };

  if (redirect) {
    return <Navigate to={`/user/${values.userId}`} />;
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          Edit Profile
        </Typography>
        <TextField
          autoFocus
          id="name"
          name="name"
          label="Name"
          className={classes.textField}
          value={values.name}
          onChange={handleChange}
          error={(!!values.name && !validName) || !!error}
          margin="normal"
        />
        <br />
        <TextField
          id="email"
          name="email"
          type="email"
          label="Email"
          className={classes.textField}
          value={values.email}
          onChange={handleChange}
          error={(!!values.email && !validEmail) || !!error}
          margin="normal"
        />
        <br />
        <TextField
          id="password"
          name="password"
          type="password"
          label="Password"
          className={classes.textField}
          value={values.password}
          onChange={handleChange}
          error={(!!values.password && !validPass) || !!error}
          margin="normal"
        />
        <Typography variant="subtitle1" className={classes.subheading}>
          Seller Account
        </Typography>
        <FormControlLabel
          control={
            <Switch
              classes={{
                checked: classes.checked,
                bar: classes.bar
              }}
              checked={values.seller}
              onChange={handleCheck}
            />
          }
          label={values.seller ? 'Active' : 'Inactive'}
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
          disabled={!validName || !validEmail}
        >
          Submit
        </Button>
      </CardActions>
    </Card>
  );
}
