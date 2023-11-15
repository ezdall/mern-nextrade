import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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

import auth from '../auth/auth-helper';
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

export default function EditProfile() {
  const navigate = useNavigate();
  const params = useParams();

  const classes = useStyles();

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    seller: false,
    redirectToProfile: false,
    error: ''
  });

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    read(
      {
        userId: params.userId
      },
      signal
    ).then(data => {
      if (data?.isAxiosError) {
        handleAxiosError(data);
        setValues({ ...values, error: data.message });
      }
      // console.log(data.user)
      return setValues({ ...values, ...data.user, error: '' });
    });
    return () => abortController.abort();
  }, [params.userId, values]);

  const clickSubmit = () => {
    // must be turn to "undefined" if empty-string
    // due to mongoose
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
      seller: typeof values.seller === 'boolean' ? values.seller : undefined
    };

    updateUser(
      {
        userId: params.userId
      },
      user
    ).then(data => {
      if (data.isAxiosError) {
        handleAxiosError(data);
        return setValues({ ...values, error: data.message });
      }
      return auth.updateUser(data, () => {
        navigate(`/user/${data._id}`);
        setValues({ ...values, userId: data._id, redirectToProfile: true });
      });
    });
  };

  const handleChange = ev => {
    const { value, name } = ev.target;

    setValues({ ...values, [name]: value });
  };

  const handleCheck = (event, checked) => {
    setValues({ ...values, seller: checked });
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          Edit Profile
        </Typography>
        <TextField
          id="name"
          name="name"
          label="Name"
          className={classes.textField}
          value={values.name}
          onChange={handleChange}
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
        <br />{' '}
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
