import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Avatar from '@material-ui/core/Avatar';
import FileUpload from '@material-ui/icons/AddPhotoAlternate';
import Grid from '@material-ui/core/Grid';

import useAxiosPrivate from '../auth/useAxiosPrivate';
import useDataContext from '../auth/useDataContext';
import { readShop, updateShop } from './api-shop';
import { BASE_URL } from '../axios';
import MyProducts from '../product/my-products.comp';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: 30
  },
  card: {
    textAlign: 'center',
    paddingBottom: theme.spacing(2)
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  subheading: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle
  },
  error: {
    verticalAlign: 'middle'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 400
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto'
  },
  input: {
    display: 'none'
  },
  filename: {
    marginLeft: '10px'
  }
}));

export default function EditShop() {
  const params = useParams();
  const { auth: auth2 } = useDataContext();
  const axiosPrivate = useAxiosPrivate();

  const classes = useStyles();

  const [values, setValues] = useState({
    name: '',
    description: '',
    image: '',
    id: ''
  });

  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    readShop({ shopId: params.shopId }, signal).then(data => {
      if (data.isAxiosError) {
        return setError(data.response.data.error);
      }

      return setValues(prev => ({
        ...prev,
        id: data._id,
        name: data.name,
        description: data.description,
        owner: data.owner.name
      }));
    });

    return () => {
      console.log('edit-shop abort');
      abortController.abort();
    };
  }, [params.shopId]);

  const handleChange = ev => {
    const { name, value, files } = ev.target;

    setError('');

    const inputValue = name === 'image' ? files[0] : value;

    setValues({ ...values, [name]: inputValue });
  };

  const clickSubmit = () => {
    const { name, description, image } = values;

    if (!name) {
      return setError('name is required');
    }

    const shopData = new FormData();

    if (name) shopData.append('name', name);
    if (description) shopData.append('description', description);
    if (image) shopData.append('image', image);

    return updateShop({
      shopData,
      axiosPrivate,
      shopId: params.shopId,
      accessToken2: auth2.accessToken
    }).then(data => {
      if (data.isAxiosError) {
        return setError(data.response.data.error);
      }
      setError('');
      return setRedirect(true);
    });
  };

  const logoUrl = values.id
    ? `${BASE_URL}/api/shops/logo/${values.id}?${new Date().getTime()}`
    : `${BASE_URL}/api/shops/defaultphoto`;

  if (redirect) {
    return <Navigate to="/seller/shops" />;
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={8}>
        <Grid item xs={6} sm={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography
                type="headline"
                component="h2"
                className={classes.title}
              >
                Edit Shop
              </Typography>
              <br />
              <Avatar src={logoUrl} className={classes.bigAvatar} />
              <br />
              <input
                name="image"
                accept="image/*"
                onChange={handleChange}
                className={classes.input}
                id="icon-button-file"
                type="file"
              />
              <label htmlFor="icon-button-file">
                <Button variant="contained" color="default" component="span">
                  Change Logo
                  <FileUpload />
                </Button>
              </label>
              <span className={classes.filename}>
                {values.image.name ?? ''}
              </span>
              <br />
              <TextField
                autoFocus
                id="name"
                type="text"
                name="name"
                label="Name"
                required
                error={!!error}
                className={classes.textField}
                value={values.name}
                onChange={handleChange}
                margin="normal"
              />
              <br />
              <TextField
                id="multiline-flexible"
                name="description"
                label="Description"
                multiline
                minRows="3"
                value={values.description}
                onChange={handleChange}
                className={classes.textField}
                margin="normal"
              />
              <br />
              <Typography
                type="subheading"
                component="h4"
                className={classes.subheading}
              >
                Owner: {values.owner}
              </Typography>
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
                Update
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6}>
          <MyProducts shopId={params.shopId} />
        </Grid>
      </Grid>
    </div>
  );
}
