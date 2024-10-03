import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
import MemoMyProducts from '../product/my-products.comp'; //  memoized
import { readShop, updateShop } from './api-shop';
import { BASE_URL } from '../axios';

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
  const classes = useStyles();
  const navigate = useNavigate();
  const { shopId } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const [values, setValues] = useState({
    name: '',
    description: '',
    image: '',
    id: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    readShop({
      shopId,
      signal
    }).then(data => {
      if (!data?.isAxiosError) {
        return setValues(prev => ({ ...prev, ...data }));
      }
      return setError(data?.response?.data?.error);
    });

    return () => {
      abortController.abort();
      console.log('abort edit-shop');
    };
  }, [shopId]);

  const handleChange = event => {
    setError('');
    const { name, value, files } = event.target;

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
      shopId,
      axiosPrivate2: axiosPrivate
    }).then(data => {
      if (!data?.isAxiosError) {
        return setError(data?.response?.data?.error);
      }
      setError('');

      return navigate('/seller/shops');
    });
  };

  const logoUrl = values._id
    ? `${BASE_URL}/api/shops/logo/${values._id}?${new Date().getTime()}`
    : `${BASE_URL}/api/shops/defaultphoto`;

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
                minRows="2"
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
                Owner: {values.owner?.name}
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
          <MemoMyProducts />
        </Grid>
      </Grid>
    </div>
  );
}
